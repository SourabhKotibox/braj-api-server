import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { MediaFileModel, IHlsQuality } from '../models/MediaFile';
import { logger } from './logger';
import { getHlsPublicBaseUrl, isS3Configured, uploadHlsFolderToS3 } from './s3';
import { safeRemoveDir, checkDiskSpace } from './hlsCleanup';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_ROOT = path.join(__dirname, '../../uploads');
const TEMP_DIR = path.join(UPLOADS_ROOT, 'temp');

// Ensure temp directory exists
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

// Define qualities: 144p to 4K (2160p), we'll adapt to max height of input
const QUALITY_PRESETS = [
  { quality: '144p', height: 144, bitrate: 200 },
  { quality: '240p', height: 240, bitrate: 400 },
  { quality: '360p', height: 360, bitrate: 800 },
  { quality: '480p', height: 480, bitrate: 1200 },
  { quality: '720p', height: 720, bitrate: 2500 },
  { quality: '1080p', height: 1080, bitrate: 5000 },
  { quality: '1440p', height: 1440, bitrate: 8000 },
  { quality: '2160p', height: 2160, bitrate: 16000 },
];

const ffmpegInputOptions = (input: string) =>
  input.startsWith('http://') || input.startsWith('https://')
    ? ['-protocol_whitelist', 'file,http,https,tcp,tls,crypto']
    : [];

export const getVideoInfo = (filePath: string): Promise<{ duration: number; width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const command = ffmpeg(filePath).inputOptions(ffmpegInputOptions(filePath));
    command.ffprobe((err, metadata) => {
      if (err) {
        logger.error(err, 'Error getting video info');
        reject(err);
        return;
      }
      const stream = metadata.streams?.find(s => s.codec_type === 'video');
      if (!stream) {
        reject(new Error('No video stream found'));
        return;
      }
      const rawDuration = Number(metadata.format?.duration || stream.duration || 0);
      resolve({
        duration: Number.isFinite(rawDuration) && rawDuration > 0 ? rawDuration : 0,
        width: stream.width || 0,
        height: stream.height || 0,
      });
    });
  });
};

export const transcodeToHls = async (
  mediaFileId: string,
  inputFilePath: string,
  baseUrl: string
): Promise<void> => {
  const mediaFile = await MediaFileModel.findById(mediaFileId);
  if (!mediaFile) {
    throw new Error('Media file not found');
  }

  // Create output directory — must exist before we use it in finally
  const hlsOutputDir = path.join(UPLOADS_ROOT, 'hls', mediaFile._id.toString());
  if (!fs.existsSync(hlsOutputDir)) {
    fs.mkdirSync(hlsOutputDir, { recursive: true });
  }

  logger.info(`[HLS] Processing started: ${mediaFileId}`);
  logger.info(`[HLS] HLS directory created: ${hlsOutputDir}`);

  // Pre-flight disk space check
  const minFreeGb = Number(process.env.MIN_FREE_DISK_GB ?? 2);
  const diskOk = await checkDiskSpace(UPLOADS_ROOT, minFreeGb);
  if (!diskOk) {
    const msg = `[HLS] Insufficient disk space (< ${minFreeGb} GB free). Refusing to start transcode for ${mediaFileId}.`;
    logger.error(msg);
    mediaFile.hlsStatus = 'failed';
    mediaFile.hlsError = msg;
    await mediaFile.save();
    // Cleanup the empty dir we just created
    await safeRemoveDir(hlsOutputDir, mediaFileId);
    throw new Error(msg);
  }

  let processingError: Error | null = null;

  try {
    // Update status to processing
    mediaFile.hlsStatus = 'processing';
    await mediaFile.save();

    const { duration, width, height } = await getVideoInfo(inputFilePath);
    mediaFile.duration = Math.round(duration);

    // Determine which presets to use based on input height
    const applicablePresets = QUALITY_PRESETS.filter(preset => preset.height <= height);
    // If video is smaller than 144p, add at least 144p
    if (applicablePresets.length === 0) {
      applicablePresets.push(QUALITY_PRESETS[0]);
    }

    const qualities: IHlsQuality[] = [];
    const spacesActive = await isS3Configured();

    // Transcode each quality
    logger.info(`[HLS] Transcoding started: ${mediaFileId} (${applicablePresets.length} qualities)`);
    for (const preset of applicablePresets) {
      const outputDir = path.join(hlsOutputDir, preset.quality);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      const playlistPath = path.join(outputDir, 'index.m3u8');
      const segmentPattern = path.join(outputDir, 'segment-%03d.ts');

      await new Promise<void>((resolve, reject) => {
        ffmpeg(inputFilePath)
          .inputOptions(ffmpegInputOptions(inputFilePath))
          .outputOptions([
            '-preset', 'fast',
            '-g', '48',
            '-sc_threshold', '0',
            '-keyint_min', '48',
            '-hls_time', '4',
            '-hls_list_size', '0',
            '-hls_segment_filename', segmentPattern,
            '-vf', `scale=-2:${preset.height}`,
            '-b:v', `${preset.bitrate}k`,
            '-maxrate', `${preset.bitrate * 1.5}k`,
            '-bufsize', `${preset.bitrate * 2}k`,
            '-c:a', 'aac',
            '-b:a', '128k',
            '-ac', '2',
          ])
          .output(playlistPath)
          .on('start', (commandLine) => {
            logger.debug({ commandLine }, `[HLS] Starting FFmpeg for ${preset.quality}: ${mediaFileId}`);
          })
          .on('progress', (progress) => {
            logger.debug({ percent: progress.percent, preset: preset.quality }, 'HLS transcoding progress');
          })
          .on('end', () => {
            logger.info(`[HLS] Quality ${preset.quality} completed: ${mediaFileId}`);
            resolve();
          })
          .on('error', (err, stdout, stderr) => {
            logger.error({ err, stdout, stderr }, `[HLS] Error transcoding ${preset.quality}: ${mediaFileId}`);
            reject(err);
          })
          .run();
      });

      const relativePlaylistPath = `hls/${mediaFile._id.toString()}/${preset.quality}/index.m3u8`;
      const qualityUrl = spacesActive
        ? ''
        : `${baseUrl.replace(/\/$/, '')}/uploads/${relativePlaylistPath}`;

      qualities.push({
        quality: preset.quality,
        url: qualityUrl,
        filePath: `/uploads/${relativePlaylistPath}`,
        bitrate: preset.bitrate,
        resolution: `${Math.round(width * (preset.height / height))}x${preset.height}`,
      });
    }

    // Create master playlist
    let masterPlaylistContent = '#EXTM3U\n';
    for (const q of qualities) {
      const preset = applicablePresets.find(p => p.quality === q.quality);
      if (preset) {
        masterPlaylistContent += `#EXT-X-STREAM-INF:BANDWIDTH=${preset.bitrate * 1000},RESOLUTION=${q.resolution}\n`;
        masterPlaylistContent += `${q.quality}/index.m3u8\n`;
      }
    }

    const masterPlaylistPath = path.join(hlsOutputDir, 'index.m3u8');
    fs.writeFileSync(masterPlaylistPath, masterPlaylistContent);

    const relativeMasterPlaylistPath = `hls/${mediaFile._id.toString()}/index.m3u8`;
    let masterPlaylistUrl = `${baseUrl.replace(/\/$/, '')}/uploads/${relativeMasterPlaylistPath}`;

    if (spacesActive) {
      const s3Prefix = `hls/${mediaFile._id.toString()}`;
      logger.info(`[HLS] Upload to Spaces started: ${mediaFileId}`);
      // This MUST succeed before we mark completed or delete local files
      await uploadHlsFolderToS3(hlsOutputDir, s3Prefix);
      logger.info(`[HLS] Upload to Spaces completed: ${mediaFileId}`);

      const publicBase = await getHlsPublicBaseUrl();
      masterPlaylistUrl = `${publicBase}/${relativeMasterPlaylistPath}`;
      for (const q of qualities) {
        q.url = `${publicBase}/hls/${mediaFile._id.toString()}/${q.quality}/index.m3u8`;
        q.filePath = q.url;
      }
    }

    // Update media file with HLS data — only after successful upload
    mediaFile.isHls = true;
    mediaFile.hlsMasterPlaylistUrl = masterPlaylistUrl;
    mediaFile.hlsMasterPlaylistPath = spacesActive ? masterPlaylistUrl : `/uploads/${relativeMasterPlaylistPath}`;
    mediaFile.hlsQualities = qualities;
    mediaFile.hlsStatus = 'completed';
    await mediaFile.save();

    logger.info(`[HLS] Processing completed: ${mediaFileId}`);

  } catch (error: any) {
    processingError = error instanceof Error ? error : new Error(String(error));
    logger.error({ error }, `[HLS] Processing failed: ${mediaFileId}`);
    mediaFile.hlsStatus = 'failed';
    mediaFile.hlsError = processingError.message;
    await mediaFile.save();
    throw processingError;
  } finally {
    // Always clean local HLS files regardless of success or failure.
    // On success: Spaces is permanent storage, local copy is redundant.
    // On failure: prevent disk accumulation.
    const spacesActive = await isS3Configured().catch(() => false);
    if (spacesActive) {
      logger.info(`[HLS] Cleaning local files: ${mediaFileId}`);
      await safeRemoveDir(hlsOutputDir, mediaFileId);
    }
    // In local-only mode, keep the files — they ARE the permanent storage.
  }
};

export default {
  getVideoInfo,
  transcodeToHls,
};
