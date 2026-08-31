import type { FastifyRequest, FastifyReply } from 'fastify';
import { VideoMusicModel } from '../models/VideoMusic';
import { logger } from '../lib/logger';

export const getAllVideoMusics = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const query = request.query as {
      page?: string;
      limit?: string;
      search?: string;
      status?: string;
      genre?: string;
      category?: string;
      language?: string;
      featured?: string;
      trending?: string;
    };

    const page = Math.max(1, Number(query.page || 1));
    const limit = Math.min(100, Math.max(1, Number(query.limit || 20)));
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (query.status) filter.status = query.status;
    if (query.featured === 'true') filter.featured = true;
    if (query.trending === 'true') filter.trending = true;
    if (query.genre) filter.genre = query.genre;
    if (query.category) filter.category = query.category;
    if (query.language) filter.language = query.language;

    if (query.search) {
      filter.$or = [
        { title: new RegExp(query.search, 'i') },
        { artist: new RegExp(query.search, 'i') },
        { album: new RegExp(query.search, 'i') },
      ];
    }

    const [videos, total] = await Promise.all([
      VideoMusicModel.find(filter)
        .populate('genre', 'name')
        .populate('category', 'name')
        .populate('language', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      VideoMusicModel.countDocuments(filter),
    ]);

    return reply.send({
      success: true,
      data: videos.map((v) => ({ ...v, id: v._id?.toString() })),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    logger.error({ error }, 'Error getting all video musics');
    return reply.status(500).send({ success: false, error: error.message });
  }
};

export const getVideoMusicById = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    const video = await VideoMusicModel.findById(id)
      .populate('genre', 'name')
      .populate('category', 'name')
      .populate('language', 'name')
      .lean();

    if (!video) {
      return reply.status(404).send({ success: false, error: 'Video music not found' });
    }

    return reply.send({ success: true, data: { ...video, id: video._id?.toString() } });
  } catch (error: any) {
    logger.error({ error }, 'Error getting video music by ID');
    return reply.status(500).send({ success: false, error: error.message });
  }
};

export const createVideoMusic = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const body = request.body as any;
    const isRawLocalVideo = body.videoUrl && !body.videoUrl.startsWith('http://') && !body.videoUrl.startsWith('https://');

    if (isRawLocalVideo) {
      body.processingStatus = 'queued';
    } else {
      body.processingStatus = 'ready';
    }

    const video = await VideoMusicModel.create(body);

    return reply.status(201).send({
      success: true,
      data: { ...video.toObject(), id: video._id?.toString() },
    });
  } catch (error: any) {
    logger.error({ error }, 'Error creating video music');
    return reply.status(500).send({ success: false, error: error.message });
  }
};

export const updateVideoMusic = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    const body = request.body as any;

    const video = await VideoMusicModel.findByIdAndUpdate(id, { $set: body }, { returnDocument: 'after', runValidators: true });

    if (!video) {
      return reply.status(404).send({ success: false, error: 'Video music not found' });
    }

    return reply.send({ success: true, data: { ...video.toObject(), id: video._id?.toString() } });
  } catch (error: any) {
    logger.error({ error }, 'Error updating video music');
    return reply.status(500).send({ success: false, error: error.message });
  }
};

export const deleteVideoMusic = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    const video = await VideoMusicModel.findByIdAndDelete(id);

    if (!video) {
      return reply.status(404).send({ success: false, error: 'Video music not found' });
    }

    return reply.send({ success: true, message: 'Video music deleted successfully' });
  } catch (error: any) {
    logger.error({ error }, 'Error deleting video music');
    return reply.status(500).send({ success: false, error: error.message });
  }
};

export const toggleVideoMusicFeatured = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    const video = await VideoMusicModel.findById(id).lean();

    if (!video) {
      return reply.status(404).send({ success: false, error: 'Video music not found' });
    }

    const updated = await VideoMusicModel.findByIdAndUpdate(id, { $set: { featured: !video.featured } }, { returnDocument: 'after' }).lean();

    return reply.send({ success: true, data: { ...updated, id: updated?._id?.toString() } });
  } catch (error: any) {
    logger.error({ error }, 'Error toggling video music featured');
    return reply.status(500).send({ success: false, error: error.message });
  }
};

export const toggleVideoMusicTrending = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    const video = await VideoMusicModel.findById(id).lean();

    if (!video) {
      return reply.status(404).send({ success: false, error: 'Video music not found' });
    }

    const updated = await VideoMusicModel.findByIdAndUpdate(id, { $set: { trending: !video.trending } }, { returnDocument: 'after' }).lean();

    return reply.send({ success: true, data: { ...updated, id: updated?._id?.toString() } });
  } catch (error: any) {
    logger.error({ error }, 'Error toggling video music trending');
    return reply.status(500).send({ success: false, error: error.message });
  }
};
