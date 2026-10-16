// Load .env file
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '../.env') });

const { default: fastify } = await import('./app');
import { logger } from './lib/logger';
import { connectMongoDB } from './lib/mongodb';
import { connectRedis } from './lib/redis';
import { seedDatabase } from './lib/seed';

const rawPort = process.env.PORT;

if (!rawPort) {
  throw new Error('PORT environment variable is required but was not provided.');
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

async function startServer() {
  try {
    await connectMongoDB();
    await connectRedis();
    const { ensureSpacesStorage } = await import('./lib/s3');
    await ensureSpacesStorage();

    // Seed database with initial data (Disabled on startup to preserve data)
    // await seedDatabase();

    // ── Startup orphan HLS cleanup ──────────────────────────────────────────
    // Remove HLS temp folders left behind by crashed jobs, EC2 reboots,
    // or PM2 restarts. This runs AFTER DB is connected so we can query
    // active processing jobs and skip their folders.
    try {
      const { cleanupOrphanedHlsFolders } = await import('./lib/hlsCleanup');
      const { MovieModel } = await import('./models/Movie');
      const { EpisodeModel } = await import('./models/Episode');

      // Collect IDs of all jobs that are currently processing.
      // These folders must NOT be deleted if recently modified.
      const processingMovies = await MovieModel.find({ processingStatus: 'processing' })
        .select('_id')
        .lean();
      const processingEpisodes = await EpisodeModel.find({ processingStatus: 'processing' })
        .select('_id episode contentId')
        .lean();

      const activeIds = new Set<string>();
      for (const m of processingMovies) {
        activeIds.add(`movies/${m._id.toString()}`);
      }
      for (const e of processingEpisodes) {
        activeIds.add(`${(e as any).contentId.toString()}/episode-${(e as any).episode}`);
      }

      const uploadsRoot = join(process.cwd(), 'uploads');
      await cleanupOrphanedHlsFolders(uploadsRoot, activeIds);

      // Reset any jobs that were stuck in 'processing' status (from crashed jobs)
      // so they can be re-triggered manually from the admin panel.
      const stuckMovieIds = processingMovies.map((m) => m._id);
      const stuckEpisodeIds = processingEpisodes.map((e) => e._id);
      if (stuckMovieIds.length > 0) {
        await MovieModel.updateMany(
          { _id: { $in: stuckMovieIds } },
          { processingStatus: 'failed', processingError: 'Job was interrupted (server restart). Please re-trigger processing.' }
        );
        logger.warn({ count: stuckMovieIds.length }, '[HLS] Reset stuck movie processing jobs to failed on startup');
      }
      if (stuckEpisodeIds.length > 0) {
        await EpisodeModel.updateMany(
          { _id: { $in: stuckEpisodeIds } },
          { processingStatus: 'failed', processingError: 'Job was interrupted (server restart). Please re-trigger processing.' }
        );
        logger.warn({ count: stuckEpisodeIds.length }, '[HLS] Reset stuck episode processing jobs to failed on startup');
      }
    } catch (cleanupErr) {
      // Startup cleanup failure must never prevent the server from starting
      logger.error({ cleanupErr }, '[HLS] Startup orphan cleanup failed (non-fatal)');
    }
    // ────────────────────────────────────────────────────────────────────────

    await fastify.listen({ port, host: '0.0.0.0' });
    logger.info({ port }, 'Server listening');
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
}

startServer();
