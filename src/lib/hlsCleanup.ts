/**
 * hlsCleanup.ts
 *
 * Utilities for:
 * 1. Safely removing a local HLS directory without hiding the original error.
 * 2. Checking available disk space before starting a transcode.
 * 3. Startup orphan cleanup: remove stale HLS folders left by crashed/restarted jobs.
 */
import fs from 'fs';
import path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { logger } from './logger';

const execFileAsync = promisify(execFile);

/**
 * Recursively remove a directory safely.
 * Logs cleanup start/end and any cleanup error separately so it never
 * hides the original processing error.
 */
export async function safeRemoveDir(dirPath: string, label: string): Promise<void> {
  if (!dirPath || !fs.existsSync(dirPath)) return;
  logger.info(`[HLS] Cleaning local files: ${label} (${dirPath})`);
  try {
    await fs.promises.rm(dirPath, { recursive: true, force: true });
    logger.info(`[HLS] Local cleanup completed: ${label}`);
  } catch (cleanupErr: any) {
    // Log the cleanup failure separately — do NOT rethrow so the caller's
    // original error (if any) is preserved.
    logger.error({ cleanupErr, dirPath }, `[HLS] Local cleanup failed: ${label}`);
  }
}

/**
 * Check whether there is at least `minFreeGb` GB of free space on the
 * filesystem that contains `checkPath`.
 *
 * Returns true when there is enough space, false when disk is too full.
 * Falls back to true on platforms where df is unavailable (never blocks).
 */
export async function checkDiskSpace(checkPath: string, minFreeGb: number): Promise<boolean> {
  try {
    // df -k <path> → outputs 1024-byte blocks
    const { stdout } = await execFileAsync('df', ['-k', checkPath]);
    const lines = stdout.trim().split('\n');
    // Header line + data line
    if (lines.length < 2) return true;
    const parts = lines[lines.length - 1].trim().split(/\s+/);
    // df -k columns: Filesystem  1K-blocks  Used  Available  Use%  Mounted
    // Available is at index 3
    const availableKb = Number(parts[3]);
    if (isNaN(availableKb)) return true;
    const availableGb = availableKb / 1024 / 1024;
    if (availableGb < minFreeGb) {
      logger.warn({ availableGb: availableGb.toFixed(2), minFreeGb }, '[HLS] Disk space check failed — low disk space');
      return false;
    }
    logger.debug({ availableGb: availableGb.toFixed(2), minFreeGb }, '[HLS] Disk space check passed');
    return true;
  } catch (err) {
    // If df is not available or fails, don't block the job
    logger.warn({ err }, '[HLS] Could not check disk space — proceeding anyway');
    return true;
  }
}

/**
 * On startup, scan the HLS base directories and remove folders that:
 *  - are not associated with any currently-processing job in the DB, AND
 *  - were last modified more than HLS_CLEANUP_MAX_AGE_HOURS ago (default: 6h)
 *
 * The `activeIds` set contains folder names (mediaIds / "movies/<id>" etc.)
 * that belong to jobs currently in-flight and must NOT be touched.
 *
 * Call this once during server startup after the DB connection is established.
 */
export async function cleanupOrphanedHlsFolders(
  uploadsRoot: string,
  activeIds: Set<string>
): Promise<void> {
  const maxAgeHours = Number(process.env.HLS_CLEANUP_MAX_AGE_HOURS ?? 6);
  const maxAgeMs = maxAgeHours * 60 * 60 * 1000;
  const now = Date.now();

  // HLS output is written to two root directories:
  //   uploads/hls/movies/<movieId>/
  //   uploads/hls/<contentId>/episode-<N>/   (for episodes in videoProcessor)
  //   uploads/hls/<mediaFileId>/             (for MediaFile transcoder)
  const hlsRoot = path.join(uploadsRoot, 'hls');

  if (!fs.existsSync(hlsRoot)) {
    logger.info('[HLS] No hls directory found — nothing to clean on startup');
    return;
  }

  logger.info({ hlsRoot, maxAgeHours }, '[HLS] Starting orphan cleanup scan');
  let cleaned = 0;
  let skipped = 0;

  const scanDir = async (dir: string, depth: number): Promise<void> => {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const fullPath = path.join(dir, entry.name);
      const relPath = path.relative(hlsRoot, fullPath);

      // Only go 2 levels deep (movies/<id> or <contentId>/episode-<N>)
      if (depth >= 2) continue;

      let stat: fs.Stats;
      try {
        stat = fs.statSync(fullPath);
      } catch {
        continue;
      }

      const ageMs = now - stat.mtimeMs;

      // Check if this folder (or its parent) is an active job
      const isActive =
        activeIds.has(relPath) ||
        activeIds.has(entry.name) ||
        activeIds.has(path.basename(dir) + '/' + entry.name);

      if (isActive) {
        logger.debug({ relPath }, '[HLS] Skipping active job folder');
        skipped++;
        continue;
      }

      if (ageMs < maxAgeMs) {
        // Might still be in-flight — recurse to check sub-folders at depth+1
        if (depth < 1) {
          await scanDir(fullPath, depth + 1);
        } else {
          logger.debug({ relPath, ageHours: (ageMs / 3600000).toFixed(1) }, '[HLS] Skipping recent folder');
          skipped++;
        }
        continue;
      }

      // Stale and not active — remove
      logger.info({ relPath, ageHours: (ageMs / 3600000).toFixed(1) }, '[HLS] Removing orphaned HLS folder');
      await safeRemoveDir(fullPath, relPath);
      cleaned++;
    }
  };

  await scanDir(hlsRoot, 0);
  logger.info({ cleaned, skipped }, '[HLS] Orphan cleanup scan complete');
}
