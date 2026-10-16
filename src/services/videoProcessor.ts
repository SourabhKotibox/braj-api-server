import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { Types } from 'mongoose';
import { MovieModel } from '../models/Movie';
import { EpisodeModel } from '../models/Episode';
import { ContentModel } from '../models/Content';
import { logger } from '../lib/logger';
import { isS3Configured, uploadHlsFolderToS3, getHlsPublicBaseUrl } from '../lib/s3';
import { safeRemoveDir, checkDiskSpace } from '../lib/hlsCleanup';

// ─────────────────────────────────────────────────────────────────────────────
// All 7 quality renditions with Netflix-grade bitrate settings
// ─────────────────────────────────────────────────────────────────────────────
export const HLS_QUALITY_LADDER = [
  { name: '144p',  width: 256,  height: 144,  bitrate: '100k',  maxrate: '110k',   bufsize: '150k',   audioBitrate: '48k'  },
  { name: '240p',  width: 426,  height: 240,  bitrate: '400k',  maxrate: '428k',   bufsize: '600k',   audioBitrate: '64k'  },
  { name: '360p',  width: 640,  height: 360,  bitrate: '800k',  maxrate: '856k',   bufsize: '1200k',  audioBitrate: '96k'  },
  { name: '480p',  width: 854,  height: 480,  bitrate: '1400k', maxrate: '1498k',  bufsize: '2100k',  audioBitrate: '128k' },
  { name: '720p',  width: 1280, height: 720,  bitrate: '2800k', maxrate: '2996k',  bufsize: '4200k',  audioBitrate: '128k' },
  { name: '1080p', width: 1920, height: 1080, bitrate: '5000k', maxrate: '5350k',  bufsize: '7500k',  audioBitrate: '192k' },
  { name: '1440p', width: 2560, height: 1440, bitrate: '8000k', maxrate: '8560k',  bufsize: '12000k', audioBitrate: '192k' },
  { name: '2160p', width: 3840, height: 2160, bitrate: '16000k',maxrate: '17120k', bufsize: '24000k', audioBitrate: '192k' },
] as const;

export type QualityName = typeof HLS_QUALITY_LADDER[number]['name'];

// Bandwidth values for master.m3u8 BANDWIDTH attribute (bits/s)
const BANDWIDTH_MAP: Record<QualityName, number> = {
  '144p':  100_000,
  '240p':  400_000,
  '360p':  800_000,
  '480p':  1_400_000,
  '720p':  2_800_000,
  '1080p': 5_000_000,
  '1440p': 8_000_000,
  '2160p': 16_000_000,
};

const RESOLUTION_MAP: Record<QualityName, string> = {
  '144p':  '256x144',
  '240p':  '426x240',
  '360p':  '640x360',
  '480p':  '854x480',
  '720p':  '1280x720',
  '1080p': '1920x1080',
  '1440p': '2560x1440',
  '2160p': '3840x2160',
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const runCommand = (command: string, args: string[]): Promise<string> => {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args);
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => { stdout += chunk.toString(); });
    child.stderr.on('data', (chunk) => { stderr += chunk.toString(); });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve(stdout.trim());
      else reject(new Error(stderr.trim() || `${command} exited with code ${code}`));
    });
  });
};

const getVideoDurationSeconds = async (filePath: string): Promise<number | undefined> => {
  try {
    const output = await runCommand('ffprobe', [
      '-v', 'error',
      '-show_entries', 'format=duration',
      '-of', 'default=noprint_wrappers=1:nokey=1',
      filePath,
    ]);
    const duration = Number(output);
    return Number.isFinite(duration) && duration > 0 ? duration : undefined;
  } catch (error) {
    logger.warn({ error, filePath }, 'ffprobe duration probe failed');
    return undefined;
  }
};

const ensureDir = (dir: string) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

export const toLocalUploadPath = (urlPath: string): string | null => {
  if (!urlPath) return null;
  if (/^https?:\/\//i.test(urlPath)) return null;
  const uploadsRoot = path.join(process.cwd(), 'uploads');
  let relPath = urlPath;
  if (relPath.startsWith('/uploads/')) relPath = relPath.replace('/uploads/', '');
  else if (relPath.startsWith('uploads/')) relPath = relPath.replace('uploads/', '');
  else if (relPath.startsWith('/media/')) relPath = relPath.replace('/', '');
  return path.join(uploadsRoot, relPath);
};

const resolveFfmpegInput = (sourceVideoUrl: string): string => {
  if (/^https?:\/\//i.test(sourceVideoUrl)) return sourceVideoUrl;
  const local = toLocalUploadPath(sourceVideoUrl);
  if (local && fs.existsSync(local)) return local;
  throw new Error(`Source video not found: ${sourceVideoUrl}`);
};

const ffmpegHttpArgs = (input: string): string[] =>
  /^https?:\/\//i.test(input) ? ['-protocol_whitelist', 'file,http,https,tcp,tls,crypto'] : [];

const getFolderSize = (folderPath: string): number => {
  try {
    if (!fs.existsSync(folderPath)) return 0;
    const walk = (dir: string): number => {
      let size = 0;
      for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
        const fp = path.join(dir, f.name);
        size += f.isDirectory() ? walk(fp) : fs.statSync(fp).size;
      }
      return size;
    };
    return walk(folderPath);
  } catch { return 0; }
};

/**
 * Probe source video resolution using ffprobe.
 * Returns { width, height } or null on failure.
 */
const probeResolution = async (inputPath: string): Promise<{ width: number; height: number } | null> => {
  try {
    const output = await runCommand('ffprobe', [
      '-v', 'error',
      '-select_streams', 'v:0',
      '-show_entries', 'stream=width,height',
      '-of', 'csv=p=0',
      inputPath,
    ]);
    const parts = output.trim().split(',');
    if (parts.length >= 2) {
      const w = parseInt(parts[0], 10);
      const h = parseInt(parts[1], 10);
      if (!isNaN(w) && !isNaN(h)) return { width: w, height: h };
    }
  } catch (err) {
    logger.warn({ err }, 'ffprobe resolution detection failed — will use all qualities');
  }
  return null;
};

/**
 * Filter quality ladder to only include renditions whose height
 * does not exceed the source video's height.
 */
const filterQualitiesByResolution = (
  sourceHeight: number,
  ladder: typeof HLS_QUALITY_LADDER
) => ladder.filter((q) => q.height <= sourceHeight);

// ─────────────────────────────────────────────────────────────────────────────
// Core HLS Transcoder — Single-pass multi-variant FFmpeg
// ─────────────────────────────────────────────────────────────────────────────
export const transcodeHlsMultiResolution = async (options: {
  id: string;
  type: 'movie' | 'episode';
  sourceVideoUrl: string;
  startSeconds?: number;
  duration?: number;
  episodeNumber?: number;
  contentIdForEpisode?: string;
}) => {
  const { id, type, sourceVideoUrl, startSeconds, duration, episodeNumber, contentIdForEpisode } = options;

  // ── Resolve input path (local disk or DigitalOcean Spaces URL) ──────────
  const ffmpegInput = resolveFfmpegInput(sourceVideoUrl);

  // ── Determine local HLS output folder ──────────────────────────────────
  const uploadsRoot = path.join(process.cwd(), 'uploads');
  let hlsFolder = '';
  let localUrlBase = '';
  let s3Prefix = '';

  if (type === 'movie') {
    hlsFolder    = path.join(uploadsRoot, 'hls', 'movies', id);
    localUrlBase = `/uploads/hls/movies/${id}`;
    s3Prefix     = `hls/movies/${id}`;
  } else {
    hlsFolder    = path.join(uploadsRoot, 'hls', contentIdForEpisode!, `episode-${episodeNumber}`);
    localUrlBase = `/uploads/hls/${contentIdForEpisode}/episode-${episodeNumber}`;
    s3Prefix     = `hls/${contentIdForEpisode}/episode-${episodeNumber}`;
  }

  // ── Pre-flight disk space check ─────────────────────────────────────────
  const minFreeGb = Number(process.env.MIN_FREE_DISK_GB ?? 2);
  const diskOk = await checkDiskSpace(uploadsRoot, minFreeGb);
  if (!diskOk) {
    throw new Error(`Insufficient disk space (< ${minFreeGb} GB free). Job ${id} refused.`);
  }

  // Clear any existing HLS files to prevent mixing old and new uploads
  if (fs.existsSync(hlsFolder)) {
    try {
      fs.rmSync(hlsFolder, { recursive: true, force: true });
    } catch (rmErr) {
      logger.warn({ rmErr, hlsFolder }, 'Failed to clear existing HLS folder before processing');
    }
  }
  ensureDir(hlsFolder);

  logger.info(`[HLS] Processing started: ${id}`);
  logger.info(`[HLS] HLS directory created: ${hlsFolder}`);

  // ── Detect source resolution & duration & filter quality ladder ──────────
  const [sourceRes, sourceDuration] = await Promise.all([
    probeResolution(ffmpegInput),
    getVideoDurationSeconds(ffmpegInput),
  ]);
  const sourceHeight = sourceRes?.height ?? 2160; // assume max if detection fails
  const qualities = filterQualitiesByResolution(sourceHeight, HLS_QUALITY_LADDER);
  logger.info({ id, type, sourceHeight, sourceDuration, qualityCount: qualities.length }, '[HLS] Transcoding started');

  let processingError: Error | null = null;

  try {
    // ── Build single-pass FFmpeg args ───────────────────────────────────────
    const args: string[] = ['-y', ...ffmpegHttpArgs(ffmpegInput)];

    // Input seek (must come before -i for fast seek)
    if (startSeconds !== undefined && startSeconds > 0) {
      args.push('-ss', String(startSeconds));
    }
    args.push('-i', ffmpegInput);
    if (duration !== undefined && duration > 0) {
      args.push('-t', String(duration));
    }

    // Build filter_complex: split video and scale each output stream
    const n = qualities.length;
    const splitOutputs = qualities.map((_, i) => `[temp${i}]`).join('');
    const scaleFilters = qualities.map((q, i) => `[temp${i}]scale=${q.width}:${q.height}[v${i}]`).join(';');
    const filterComplexString = `[0:v]split=${n}${splitOutputs};${scaleFilters}`;
    args.push('-filter_complex', filterComplexString);

    // Map each video stream, then audio
    qualities.forEach((q, i) => {
      args.push(
        `-map`, `[v${i}]`,
        `-c:v:${i}`, 'libx264',
        `-b:v:${i}`, q.bitrate,
        `-maxrate:v:${i}`, q.maxrate,
        `-bufsize:v:${i}`, q.bufsize,
        `-preset:v:${i}`, 'veryfast',
        `-profile:v:${i}`, 'main',
        `-map`, '0:a:0',
        `-c:a:${i}`, 'aac',
        `-b:a:${i}`, q.audioBitrate,
        `-ar:a:${i}`, '48000',
      );
    });

    // var_stream_map — pairs each video track with audio track
    const streamMap = qualities.map((_, i) => `v:${i},a:${i},name:${qualities[i].name}`).join(' ');
    args.push(
      '-var_stream_map', streamMap,
      '-master_pl_name', 'master.m3u8',
      '-f', 'hls',
      '-hls_time', '6',
      '-hls_playlist_type', 'vod',
      '-hls_flags', 'independent_segments',
      '-hls_segment_filename', path.join(hlsFolder, '%v/segment_%03d.ts'),
      path.join(hlsFolder, '%v/playlist.m3u8'),
    );

    // ── Run FFmpeg ──────────────────────────────────────────────────────────
    try {
      await runCommand('ffmpeg', args);
      logger.info({ id, type }, '[HLS] Single-pass FFmpeg completed');
    } catch (err: any) {
      logger.error({ err, id, type }, '[HLS] FFmpeg single-pass failed — falling back to sequential');
      // Fallback: process each quality sequentially (avoids OOM on low-RAM EC2)
      // This fallback can also throw — let it propagate to the outer catch.
      await transcodeHlsSequentialInner({ startSeconds, duration, qualities, hlsFolder, ffmpegInput });
    }

    // ── Build master.m3u8 ───────────────────────────────────────────────────
    const masterLines = ['#EXTM3U', '#EXT-X-VERSION:3'];
    for (const q of qualities) {
      const bandwidth  = BANDWIDTH_MAP[q.name as QualityName];
      const resolution = RESOLUTION_MAP[q.name as QualityName];
      masterLines.push(
        `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},RESOLUTION=${resolution},NAME="${q.name}"`,
        `${q.name}/playlist.m3u8`,
      );
    }
    fs.writeFileSync(path.join(hlsFolder, 'master.m3u8'), masterLines.join('\n'), 'utf-8');

    // ── Upload to DigitalOcean Spaces (if configured) or keep local ─────────
    const s3Active = await isS3Configured();
    const processedQualities = await finalizeHlsOutput({
      id,
      qualities,
      hlsFolder,
      s3Active,
      s3Prefix,
      localUrlBase,
    });

    logger.info(`[HLS] Processing completed: ${id}`);

    return {
      hlsUrl: processedQualities.masterUrl,
      videoQualities: processedQualities.renditions,
      hlsS3Prefix: s3Active ? s3Prefix : undefined,
      duration: sourceDuration ? Math.round(sourceDuration) : undefined,
    };

  } catch (err: any) {
    processingError = err instanceof Error ? err : new Error(String(err));
    logger.error({ err, id, type }, `[HLS] Processing failed: ${id}`);
    throw processingError;
  } finally {
    // Always remove local HLS temp folder when using Spaces.
    // In local-only mode the folder is permanent storage — do not delete it.
    const s3Active = await isS3Configured().catch(() => false);
    if (s3Active) {
      // Only delete if upload succeeded (folder still exists) OR if this is a failure cleanup.
      // safeRemoveDir is a no-op if the folder was already deleted by finalizeHlsOutput.
      if (processingError !== null) {
        // Failed job — always clean up partial files
        logger.info(`[HLS] Cleaning local files after failure: ${id}`);
        await safeRemoveDir(hlsFolder, id);
      }
      // On success, finalizeHlsOutput already deleted the folder.
    }
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Sequential fallback inner (one quality at a time — safer on low-RAM servers)
// Throws on failure; called from within the outer try block so cleanup happens.
// ─────────────────────────────────────────────────────────────────────────────
const transcodeHlsSequentialInner = async (opts: {
  startSeconds?: number;
  duration?: number;
  qualities: ReadonlyArray<typeof HLS_QUALITY_LADDER[number]>;
  hlsFolder: string;
  ffmpegInput: string;
}) => {
  const { startSeconds, duration, qualities, hlsFolder, ffmpegInput } = opts;

  for (const q of qualities) {
    const qFolder = path.join(hlsFolder, q.name);
    ensureDir(qFolder);

    const args: string[] = ['-y', ...ffmpegHttpArgs(ffmpegInput)];
    if (startSeconds !== undefined && startSeconds > 0) args.push('-ss', String(startSeconds));
    args.push('-i', ffmpegInput);
    if (duration !== undefined && duration > 0) args.push('-t', String(duration));

    args.push(
      '-vf',           `scale=${q.width}:${q.height}`,
      '-c:v',          'libx264',
      '-b:v',          q.bitrate,
      '-maxrate',      q.maxrate,
      '-bufsize',      q.bufsize,
      '-profile:v',    'main',
      '-preset',       'veryfast',
      '-c:a',          'aac',
      '-b:a',          q.audioBitrate,
      '-ar',           '48000',
      '-f',            'hls',
      '-hls_time',     '6',
      '-hls_playlist_type', 'vod',
      '-hls_segment_filename', path.join(qFolder, 'segment_%03d.ts'),
      path.join(qFolder, 'playlist.m3u8'),
    );

    await runCommand('ffmpeg', args);
    logger.info({ quality: q.name }, '[HLS] Sequential quality encoded');
  }

  // Rebuild master.m3u8
  const masterLines = ['#EXTM3U', '#EXT-X-VERSION:3'];
  for (const q of qualities) {
    const bandwidth  = BANDWIDTH_MAP[q.name as QualityName];
    const resolution = RESOLUTION_MAP[q.name as QualityName];
    masterLines.push(
      `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},RESOLUTION=${resolution},NAME="${q.name}"`,
      `${q.name}/playlist.m3u8`,
    );
  }
  fs.writeFileSync(path.join(hlsFolder, 'master.m3u8'), masterLines.join('\n'), 'utf-8');
};

// ─────────────────────────────────────────────────────────────────────────────
// Finalize: Upload to S3 (or keep local), return URL map
// IMPORTANT: Local cleanup happens ONLY after a confirmed successful upload.
// If upload throws, the error propagates — the caller's finally block will
// then clean up the local folder.
// ─────────────────────────────────────────────────────────────────────────────
const finalizeHlsOutput = async (opts: {
  id: string;
  qualities: ReadonlyArray<typeof HLS_QUALITY_LADDER[number]>;
  hlsFolder: string;
  s3Active: boolean;
  s3Prefix: string;
  localUrlBase: string;
}) => {
  const { id, qualities, hlsFolder, s3Active, s3Prefix, localUrlBase } = opts;

  if (s3Active) {
    // Upload all .ts segments + .m3u8 playlists to Spaces.
    // uploadHlsFolderToS3 THROWS on any upload error — we never swallow it.
    logger.info(`[HLS] Upload to Spaces started: ${id}`);
    await uploadHlsFolderToS3(hlsFolder, s3Prefix);
    logger.info(`[HLS] Upload to Spaces completed: ${id}`);

    const baseUrl = await getHlsPublicBaseUrl();
    const masterUrl = `${baseUrl}/${s3Prefix}/master.m3u8`;

    const renditions = qualities.map((q) => ({
      quality: q.name as QualityName,
      url:  `${baseUrl}/${s3Prefix}/${q.name}/playlist.m3u8`,
      size: getFolderSize(path.join(hlsFolder, q.name)),
    }));

    // Only delete local files AFTER the upload is confirmed successful
    logger.info(`[HLS] Cleaning local files: ${id}`);
    await safeRemoveDir(hlsFolder, id);

    return { masterUrl, renditions };
  } else {
    // Local mode — serve from the uploads directory
    const masterUrl = `${localUrlBase}/master.m3u8`;
    const renditions = qualities.map((q) => ({
      quality: q.name as QualityName,
      url:  `${localUrlBase}/${q.name}/playlist.m3u8`,
      size: getFolderSize(path.join(hlsFolder, q.name)),
    }));
    return { masterUrl, renditions };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Public processors — Movies
// ─────────────────────────────────────────────────────────────────────────────
export const processMovieHls = async (movieId: Types.ObjectId | string, sourceVideoUrl: string) => {
  const id = movieId.toString();
  const uploadsRoot = path.join(process.cwd(), 'uploads');
  const hlsFolder = path.join(uploadsRoot, 'hls', 'movies', id);

  logger.info(`[HLS] Movie processing started: ${id}`);
  try {
    await MovieModel.findByIdAndUpdate(movieId, { processingStatus: 'processing' });

    const result = await transcodeHlsMultiResolution({
      id,
      type: 'movie',
      sourceVideoUrl,
    });

    await MovieModel.findByIdAndUpdate(movieId, {
      hlsUrl:          result.hlsUrl,
      videoUrl:        sourceVideoUrl,
      hlsS3Prefix:     result.hlsS3Prefix,
      videoQualities:  result.videoQualities,
      status:          'published',
      processingStatus:'ready',
      processingError: null,
      ...(result.duration ? { duration: result.duration } : {}),
    });

    logger.info({ movieId, hlsUrl: result.hlsUrl, duration: result.duration }, '[HLS] Movie HLS processing complete');
  } catch (error: any) {
    // The original FFmpeg/upload error is logged here.
    // Cleanup of local HLS files happens inside transcodeHlsMultiResolution's finally block.
    logger.error({ error, movieId }, '[HLS] Error processing movie HLS');
    await MovieModel.findByIdAndUpdate(movieId, {
      processingStatus: 'failed',
      processingError:  error.message,
    });
    // Belt-and-suspenders: if something went wrong before the hlsFolder was
    // even created inside transcodeHlsMultiResolution, safeRemoveDir is a no-op.
    const s3Active = await isS3Configured().catch(() => false);
    if (s3Active) {
      await safeRemoveDir(hlsFolder, `movie-${id}-fallback-cleanup`);
    }
  }
};

export const processMovieInBackground = (movieId: Types.ObjectId | string, sourceVideoUrl: string) => {
  setImmediate(async () => {
    await processMovieHls(movieId, sourceVideoUrl);
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// Public processors — Episodes
// ─────────────────────────────────────────────────────────────────────────────
export const processEpisodeHls = async (episodeId: Types.ObjectId | string, sourceVideoUrl: string) => {
  const id = episodeId.toString();
  logger.info(`[HLS] Episode processing started: ${id}`);

  let hlsFolder = '';
  try {
    const episode = await EpisodeModel.findById(episodeId).lean();
    if (!episode) return;

    const uploadsRoot = path.join(process.cwd(), 'uploads');
    hlsFolder = path.join(uploadsRoot, 'hls', episode.contentId.toString(), `episode-${episode.episode}`);

    await EpisodeModel.findByIdAndUpdate(episodeId, { processingStatus: 'processing' });

    const result = await transcodeHlsMultiResolution({
      id,
      type:                 'episode',
      sourceVideoUrl,
      startSeconds:         episode.sourceStartSeconds,
      duration:             episode.duration,
      episodeNumber:        episode.episode,
      contentIdForEpisode:  episode.contentId.toString(),
    });

    const finalDuration = result.duration || episode.duration;

    await EpisodeModel.findByIdAndUpdate(episodeId, {
      hlsUrl:          result.hlsUrl,
      hlsS3Prefix:     result.hlsS3Prefix,
      videoQualities:  result.videoQualities,
      processingStatus:'ready',
      processingError: null,
      ...(finalDuration ? { duration: finalDuration } : {}),
    });

    logger.info({ episodeId, hlsUrl: result.hlsUrl, duration: finalDuration }, '[HLS] Episode HLS processing complete');
  } catch (error: any) {
    logger.error({ error, episodeId }, '[HLS] Error processing episode HLS');
    await EpisodeModel.findByIdAndUpdate(episodeId, {
      processingStatus: 'failed',
      processingError:  error.message,
    });
    // Belt-and-suspenders fallback cleanup
    if (hlsFolder) {
      const s3Active = await isS3Configured().catch(() => false);
      if (s3Active) {
        await safeRemoveDir(hlsFolder, `episode-${id}-fallback-cleanup`);
      }
    }
  }
};

export const processEpisodesInBackground = (episodeIds: Types.ObjectId[], sourceVideoUrl: string) => {
  setImmediate(async () => {
    for (const episodeId of episodeIds) {
      await processEpisodeHls(episodeId, sourceVideoUrl);
    }

    const firstEpisode = await EpisodeModel.findById(episodeIds[0]).lean();
    if (!firstEpisode) return;

    const unfinishedCount = await EpisodeModel.countDocuments({
      contentId: firstEpisode.contentId,
      processingStatus: { $in: ['queued', 'processing'] },
    });
    const failedCount = await EpisodeModel.countDocuments({
      contentId: firstEpisode.contentId,
      processingStatus: 'failed',
    });

    if (unfinishedCount === 0) {
      await ContentModel.findByIdAndUpdate(firstEpisode.contentId, {
        status: failedCount > 0 ? 'processing' : 'published',
      });
    }
  });
};

export const autoDetectAndSyncQualities = async (
  id: Types.ObjectId | string,
  type: 'movie' | 'episode'
): Promise<any> => {
  const folderName = type === 'movie' ? 'movies' : 'episodes';
  const doc = type === 'movie' 
    ? await MovieModel.findById(id).lean() 
    : await EpisodeModel.findById(id).lean();
  if (!doc) return null;

  const hlsFolder = path.join(process.cwd(), 'uploads/hls', folderName, id.toString());
  const masterPlaylistPath = path.join(hlsFolder, 'master.m3u8');

  if (fs.existsSync(masterPlaylistPath)) {
    const validQualities = ['144p', '240p', '360p', '480p', '720p', '1080p', '1440p', '2160p'];
    const detectedQualities: string[] = [];

    const dirs = fs.readdirSync(hlsFolder, { withFileTypes: true });
    for (const dir of dirs) {
      if (dir.isDirectory() && validQualities.includes(dir.name)) {
        const qualityPlaylistPath = path.join(hlsFolder, dir.name, 'playlist.m3u8');
        if (fs.existsSync(qualityPlaylistPath)) {
          detectedQualities.push(dir.name);
        }
      }
    }

    if (detectedQualities.length > 0) {
      const s3Active = await isS3Configured();
      let uploadSucceeded = false;
      const s3Prefix = `hls/${folderName}/${id}`;

      if (s3Active) {
        try {
          logger.info({ id: id.toString(), type, s3Prefix }, 'Auto-detect: Uploading HLS folder to S3…');
          await uploadHlsFolderToS3(hlsFolder, s3Prefix);
          uploadSucceeded = true;
          logger.info({ id: id.toString(), type }, 'Auto-detect: S3 upload successful. Cleaning up local files.');
          await safeRemoveDir(hlsFolder, `auto-detect-${id}`);
        } catch (uploadErr) {
          logger.error({ uploadErr, id: id.toString() }, 'Auto-detect: Failed to upload HLS to S3, falling back to local files.');
        }
      }

      let hlsUrl = '';
      let videoQualities: any[] = [];

      if (s3Active && uploadSucceeded) {
        const baseUrl = await getHlsPublicBaseUrl();
        hlsUrl = `${baseUrl}/${s3Prefix}/master.m3u8`;
        videoQualities = detectedQualities.map(q => ({
          quality: q,
          url: `${baseUrl}/${s3Prefix}/${q}/playlist.m3u8`,
          size: 0
        }));
      } else {
        const port = process.env.PORT || '3000';
        const localBaseUrl = `http://localhost:${port}`;
        hlsUrl = `${localBaseUrl}/uploads/hls/${folderName}/${id}/master.m3u8`;
        videoQualities = detectedQualities.map(q => ({
          quality: q,
          url: `${localBaseUrl}/uploads/hls/${folderName}/${id}/${q}/playlist.m3u8`,
          size: getFolderSize(path.join(hlsFolder, q))
        }));
      }

      // Check if we need to update
      const currentQualitiesStr = JSON.stringify(doc.videoQualities || []);
      const newQualitiesStr = JSON.stringify(videoQualities);
      const hasDiff = currentQualitiesStr !== newQualitiesStr || 
                      doc.processingStatus !== 'ready' ||
                      doc.hlsUrl !== hlsUrl;

      if (hasDiff) {
        logger.info({ id: id.toString(), type, qualityCount: videoQualities.length }, 'Syncing auto-detected HLS qualities to MongoDB');
        
        const updateData: any = {
          hlsUrl,
          videoQualities,
          processingStatus: 'ready',
          processingError: null,
        };

        if ((doc as any).status === 'draft' || !(doc as any).status) {
          updateData.status = 'published';
        }

        let updatedDoc;
        if (type === 'movie') {
          updatedDoc = await MovieModel.findByIdAndUpdate(id, { $set: updateData }, { returnDocument: 'after' }).lean();
        } else {
          updatedDoc = await EpisodeModel.findByIdAndUpdate(id, { $set: updateData }, { returnDocument: 'after' }).lean();
        }
        return updatedDoc;
      }
    }
  }
  return doc;
};
