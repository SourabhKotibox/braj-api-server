import type { FastifyPluginAsync } from 'fastify';

const relatedRoutes: FastifyPluginAsync = async (fastify) => {
  // Related audio tracks endpoint
  fastify.get('/public/audio/related/:id', async (request, reply) => {
    try {
      const { AudioModel } = await import('../models/Audio');
      const { id } = request.params as { id: string };
      const { limit } = request.query as { limit?: string };

      const audio = await AudioModel.findById(id).lean();
      if (!audio) {
        return reply.status(404).send({ success: false, error: 'Audio not found' });
      }

      const relatedLimit = Math.min(20, Math.max(1, Number(limit || 10)));

      const filter: any = {
        status: 'published',
        _id: { $ne: audio._id },
        $or: [],
      };

      if (audio.artist) {
        filter.$or.push({ artist: audio.artist });
      }
      if (audio.genre) {
        filter.$or.push({ genre: audio.genre });
      }
      if (audio.tags && audio.tags.length > 0) {
        filter.$or.push({ tags: { $in: audio.tags } });
      }

      const query = filter.$or.length > 0 ? filter : { status: 'published', _id: { $ne: audio._id } };

      const related = await AudioModel.find(query)
        .sort({ views: -1, createdAt: -1 })
        .limit(relatedLimit)
        .lean();

      return reply.send({
        success: true,
        data: related.map((a: any) => ({ ...a, id: a._id?.toString() })),
      });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Related video music tracks endpoint
  fastify.get('/public/video-music/related/:id', async (request, reply) => {
    try {
      const { VideoMusicModel } = await import('../models/VideoMusic');
      const { id } = request.params as { id: string };
      const { limit } = request.query as { limit?: string };

      const video = await VideoMusicModel.findById(id).lean();
      if (!video) {
        return reply.status(404).send({ success: false, error: 'Video not found' });
      }

      const relatedLimit = Math.min(20, Math.max(1, Number(limit || 10)));

      const filter: any = {
        status: 'published',
        _id: { $ne: video._id },
        $or: [],
      };

      if (video.artist) {
        filter.$or.push({ artist: video.artist });
      }
      if (video.genre) {
        filter.$or.push({ genre: video.genre });
      }
      if (video.tags && video.tags.length > 0) {
        filter.$or.push({ tags: { $in: video.tags } });
      }

      const query = filter.$or.length > 0 ? filter : { status: 'published', _id: { $ne: video._id } };

      const related = await VideoMusicModel.find(query)
        .sort({ views: -1, createdAt: -1 })
        .limit(relatedLimit)
        .lean();

      return reply.send({
        success: true,
        data: related.map((v: any) => ({ ...v, id: v._id?.toString() })),
      });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });
};

export default relatedRoutes;
