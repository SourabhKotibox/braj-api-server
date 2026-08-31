import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs/promises';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import https from 'https';
import http from 'http';
import { logger } from './logger';

const UPLOADS_DIR = path.join(process.cwd(), '..', 'uploads');
const NORMALIZED_DIR = path.join(UPLOADS_DIR, 'normalized');

async function ensureDir(dir: string) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (e) {
    // Directory already exists
  }
}

function downloadFile(url: string, destPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = createWriteStream(destPath);

    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          downloadFile(redirectUrl, destPath).then(resolve).catch(reject);
          return;
        }
      }
      if (response.statusCode !== 200) {
        reject(new Error(`Download failed with status ${response.statusCode}`));
        return;
      }
      pipeline(response, file).then(resolve).catch(reject);
    }).on('error', reject);
  });
}

function runFfmpeg(args: string[]): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', args);
    let stdout = '';
    let stderr = '';

    ffmpeg.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    ffmpeg.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        reject(new Error(`FFmpeg exited with code ${code}: ${stderr}`));
      }
    });

    ffmpeg.on('error', reject);
  });
}

interface LoudnessInfo {
  inputI: string;
  inputTp: string;
  inputLra: string;
  inputThresh: string;
  targetOffset: string;
}

function parseLoudnessInfo(stderr: string): LoudnessInfo | null {
  const match = stderr.match(/\[Parsed_loudnorm_0 @ [^\]]+\]\s*(\{[^}]+\})/);
  if (!match) return null;

  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

export interface NormalizeOptions {
  targetLoudness?: number; // Target integrated loudness in LUFS (default: -14)
  truePeak?: number; // True peak limit in dBTP (default: -1)
  loudnessRange?: number; // Loudness range target in LU (default: 11)
}

export interface NormalizeResult {
  success: boolean;
  outputPath?: string;
  outputUrl?: string;
  loudnessInfo?: LoudnessInfo;
  error?: string;
}

export async function normalizeAudio(
  inputUrl: string,
  options: NormalizeOptions = {}
): Promise<NormalizeResult> {
  const {
    targetLoudness = -14,
    truePeak = -1,
    loudnessRange = 11,
  } = options;

  await ensureDir(NORMALIZED_DIR);

  const tempId = `temp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const inputPath = path.join(NORMALIZED_DIR, `${tempId}_input.mp3`);
  const outputPath = path.join(NORMALIZED_DIR, `${tempId}_normalized.mp3`);

  try {
    // Download input file if it's a URL
    if (inputUrl.startsWith('http')) {
      logger.info({ url: inputUrl }, 'Downloading audio for normalization');
      await downloadFile(inputUrl, inputPath);
    } else {
      // Local file
      const localPath = path.join(UPLOADS_DIR, inputUrl.replace(/^\/?uploads\//, ''));
      await fs.copyFile(localPath, inputPath);
    }

    // First pass: Analyze loudness
    logger.info('Analyzing audio loudness (first pass)');
    const analyzeArgs = [
      '-i', inputPath,
      '-af', `loudnorm=I=${targetLoudness}:TP=${truePeak}:LRA=${loudnessRange}:print_format=json`,
      '-f', 'null',
      '-'
    ];

    const { stderr: analyzeStderr } = await runFfmpeg(analyzeArgs);
    const loudnessInfo = parseLoudnessInfo(analyzeStderr);

    if (!loudnessInfo) {
      throw new Error('Failed to analyze audio loudness');
    }

    logger.info({ loudnessInfo }, 'Loudness analysis complete');

    // Second pass: Apply normalization with measured values
    logger.info('Applying normalization (second pass)');
    const normalizeArgs = [
      '-i', inputPath,
      '-af', `loudnorm=I=${targetLoudness}:TP=${truePeak}:LRA=${loudnessRange}:measured_I=${loudnessInfo.inputI}:measured_TP=${loudnessInfo.inputTp}:measured_LRA=${loudnessInfo.inputLRA}:measured_thresh=${loudnessInfo.inputThresh}:offset=${loudnessInfo.targetOffset}:linear=true:print_format=json`,
      '-ar', '44100', // Standard sample rate
      '-b:a', '320k', // High quality output
      '-y', // Overwrite output
      outputPath
    ];

    await runFfmpeg(normalizeArgs);

    // Generate output URL
    const fileName = `normalized_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.mp3`;
    const finalPath = path.join(NORMALIZED_DIR, fileName);
    await fs.rename(outputPath, finalPath);

    return {
      success: true,
      outputPath: path.join('normalized', fileName),
      outputUrl: `/uploads/normalized/${fileName}`,
      loudnessInfo,
    };
  } catch (error: any) {
    logger.error({ error: error.message, inputUrl }, 'Audio normalization failed');
    return {
      success: false,
      error: error.message,
    };
  } finally {
    // Cleanup temp files
    try {
      await fs.unlink(inputPath);
    } catch {
      // Ignore cleanup errors
    }
    try {
      await fs.unlink(outputPath);
    } catch {
      // Ignore cleanup errors
    }
  }
}

export async function analyzeAudioLoudness(inputUrl: string): Promise<LoudnessInfo | null> {
  await ensureDir(NORMALIZED_DIR);

  const tempId = `analyze_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const inputPath = path.join(NORMALIZED_DIR, `${tempId}_input.mp3`);

  try {
    // Download input file if it's a URL
    if (inputUrl.startsWith('http')) {
      await downloadFile(inputUrl, inputPath);
    } else {
      const localPath = path.join(UPLOADS_DIR, inputUrl.replace(/^\/?uploads\//, ''));
      await fs.copyFile(localPath, inputPath);
    }

    // Analyze loudness
    const analyzeArgs = [
      '-i', inputPath,
      '-af', 'loudnorm=I=-14:TP=-1:LRA=11:print_format=json',
      '-f', 'null',
      '-'
    ];

    const { stderr } = await runFfmpeg(analyzeArgs);
    return parseLoudnessInfo(stderr);
  } catch (error: any) {
    logger.error({ error: error.message }, 'Audio analysis failed');
    return null;
  } finally {
    try {
      await fs.unlink(inputPath);
    } catch {
      // Ignore cleanup errors
    }
  }
}
