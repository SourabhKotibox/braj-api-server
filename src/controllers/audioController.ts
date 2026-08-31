import type { FastifyRequest, FastifyReply } from 'fastify';
import { AudioModel } from '../models/Audio';
import { logger } from '../lib/logger';

const getAudioUrl = (audio: any): string => {
  if (audio.audioQualities && audio.audioQualities.length > 0) {
    const high = audio.audioQualities.find((q: any) => q.quality === 'high');
    const medium = audio.audioQualities.find((q: any) => q.quality === 'medium');
    return high?.url || medium?.url || audio.audioQualities[0]?.url || audio.audioUrl || '';
  }
  return audio.audioUrl || '';
};

export const getAllAudios = async (request: FastifyRequest, reply: FastifyReply) => {
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

    const [audios, total] = await Promise.all([
      AudioModel.find(filter)
        .populate('genre', 'name')
        .populate('category', 'name')
        .populate('language', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AudioModel.countDocuments(filter),
    ]);

    return reply.send({
      success: true,
      data: audios.map((a) => ({ ...a, id: a._id?.toString(), audioUrl: getAudioUrl(a) })),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    logger.error({ error }, 'Error getting all audios');
    return reply.status(500).send({ success: false, error: error.message });
  }
};

export const getAudioById = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    const audio = await AudioModel.findById(id)
      .populate('genre', 'name')
      .populate('category', 'name')
      .populate('language', 'name')
      .lean();

    if (!audio) {
      return reply.status(404).send({ success: false, error: 'Audio not found' });
    }

    return reply.send({ success: true, data: { ...audio, id: audio._id?.toString(), audioUrl: getAudioUrl(audio) } });
  } catch (error: any) {
    logger.error({ error }, 'Error getting audio by ID');
    return reply.status(500).send({ success: false, error: error.message });
  }
};

export const createAudio = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const body = request.body as any;
    
    // Validate required fields
    if (!body.title || !body.artist) {
      return reply.status(400).send({ 
        success: false, 
        error: 'Validation failed: title and artist are required fields' 
      });
    }

    // Auto-fill metadata if not provided
    const audioData: any = {
      title: body.title,
      artist: body.artist,
      album: body.album || '',
      description: body.description || '',
      shortDescription: body.shortDescription || '',
      thumbnail: body.thumbnail || '',
      coverImage: body.coverImage || '',
      bannerImage: body.bannerImage || '',
      audioUrl: body.audioUrl || '',
      duration: body.duration || 0,
      genre: body.genre || undefined,
      category: body.category || undefined,
      language: body.language || undefined,
      tags: body.tags || [],
      status: body.status || 'draft',
      views: 0,
      likes: 0,
      shares: 0,
      featured: body.featured || false,
      trending: body.trending || false,
      isNewContent: body.isNewContent ?? true,
      isExclusive: body.isExclusive || false,
      downloadAllowed: body.downloadAllowed ?? true,
      planRequired: body.planRequired || 'free',
      lyrics: body.lyrics || '',
      trackNumber: body.trackNumber || undefined,
      bitrate: body.bitrate || undefined,
      sampleRate: body.sampleRate || undefined,
      releaseDate: body.releaseDate || undefined,
      slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      metaTitle: body.metaTitle || body.title,
      metaDescription: body.metaDescription || body.description || '',
    };

    // Add audio qualities if provided
    if (body.audioQualities && body.audioQualities.length > 0) {
      audioData.audioQualities = body.audioQualities;
    }

    const audio = await AudioModel.create(audioData);

    return reply.status(201).send({
      success: true,
      data: { ...audio.toObject(), id: audio._id?.toString() },
    });
  } catch (error: any) {
    logger.error({ error }, 'Error creating audio');
    // Return more specific error message
    const message = error.message || 'Internal server error';
    return reply.status(500).send({ success: false, error: message });
  }
};

export const updateAudio = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    const body = request.body as any;

    const audio = await AudioModel.findByIdAndUpdate(id, { $set: body }, { returnDocument: 'after', runValidators: true });

    if (!audio) {
      return reply.status(404).send({ success: false, error: 'Audio not found' });
    }

    return reply.send({ success: true, data: { ...audio.toObject(), id: audio._id?.toString() } });
  } catch (error: any) {
    logger.error({ error }, 'Error updating audio');
    return reply.status(500).send({ success: false, error: error.message });
  }
};

export const deleteAudio = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    const audio = await AudioModel.findByIdAndDelete(id);

    if (!audio) {
      return reply.status(404).send({ success: false, error: 'Audio not found' });
    }

    return reply.send({ success: true, message: 'Audio deleted successfully' });
  } catch (error: any) {
    logger.error({ error }, 'Error deleting audio');
    return reply.status(500).send({ success: false, error: error.message });
  }
};

export const toggleAudioFeatured = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    const audio = await AudioModel.findById(id).lean();

    if (!audio) {
      return reply.status(404).send({ success: false, error: 'Audio not found' });
    }

    const updated = await AudioModel.findByIdAndUpdate(id, { $set: { featured: !audio.featured } }, { returnDocument: 'after' }).lean();

    return reply.send({ success: true, data: { ...updated, id: updated?._id?.toString() } });
  } catch (error: any) {
    logger.error({ error }, 'Error toggling audio featured');
    return reply.status(500).send({ success: false, error: error.message });
  }
};

export const toggleAudioTrending = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    const audio = await AudioModel.findById(id).lean();

    if (!audio) {
      return reply.status(404).send({ success: false, error: 'Audio not found' });
    }

    const updated = await AudioModel.findByIdAndUpdate(id, { $set: { trending: !audio.trending } }, { returnDocument: 'after' }).lean();

    return reply.send({ success: true, data: { ...updated, id: updated?._id?.toString() } });
  } catch (error: any) {
    logger.error({ error }, 'Error toggling audio trending');
    return reply.status(500).send({ success: false, error: error.message });
  }
};
