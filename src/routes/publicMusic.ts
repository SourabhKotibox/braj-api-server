import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import mongoose from 'mongoose';
import { AudioModel } from '../models/Audio';
import { VideoMusicModel } from '../models/VideoMusic';

const isObjectId = (id?: string) =>
  !!id && mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === id;

const getAudioUrl = (audio: any): string => {
  if (audio.audioQualities?.length) {
    const high = audio.audioQualities.find((q: any) => q.quality === 'high');
    const medium = audio.audioQualities.find((q: any) => q.quality === 'medium');
    return high?.url || medium?.url || audio.audioQualities[0]?.url || audio.audioUrl || '';
  }
  return audio.audioUrl || audio.hlsUrl || '';
};

const getVideoUrl = (video: any): string => {
  if (video.videoQualities?.length) {
    const high = video.videoQualities.find((q: any) => q.quality === '1080p' || q.quality === '720p');
    return high?.url || video.videoQualities[0]?.url || video.videoUrl || video.hlsUrl || '';
  }
  return video.videoUrl || video.hlsUrl || '';
};

const formatAudio = (audio: any) => ({
  ...audio,
  id: audio._id?.toString() || audio.id,
  audioUrl: getAudioUrl(audio),
  thumbnail: audio.thumbnail || audio.coverImage || '',
  coverImage: audio.coverImage || audio.thumbnail || '',
});

const formatVideo = (video: any) => ({
  ...video,
  id: video._id?.toString() || video.id,
  videoUrl: getVideoUrl(video),
  thumbnail: video.thumbnail || video.coverImage || '',
  coverImage: video.coverImage || video.thumbnail || '',
});

const listFilter = (query: any) => {
  const filter: any = { status: 'published' };
  if (query.featured === 'true') filter.featured = true;
  if (query.trending === 'true') filter.trending = true;
  if (query.new === 'true') filter.isNewContent = true;
  if (query.exclusive === 'true') filter.isExclusive = true;
  if (query.genre && isObjectId(query.genre)) filter.genre = query.genre;
  if (query.category && isObjectId(query.category)) filter.category = query.category;
  if (query.language && isObjectId(query.language)) filter.language = query.language;
  if (query.artist) filter.artist = new RegExp(String(query.artist), 'i');
  if (query.album) filter.album = new RegExp(String(query.album), 'i');
  if (query.search) {
    filter.$or = [
      { title: new RegExp(query.search, 'i') },
      { artist: new RegExp(query.search, 'i') },
      { album: new RegExp(query.search, 'i') },
    ];
  }
  return filter;
};

const paging = (query: any, fallbackLimit = 50) => {
  const page = Math.max(1, Number(query.page || 1));
  const limit = Math.min(100, Math.max(1, Number(query.limit || fallbackLimit)));
  return { page, limit, skip: (page - 1) * limit };
};

const sendError = (reply: FastifyReply, error: any) =>
  reply.status(500).send({ success: false, error: error?.message || 'Internal server error' });

const publicMusicRoutes: FastifyPluginAsync = async (fastify) => {
  // ── Audio list ──────────────────────────────────────────────────────
  fastify.get('/public/audio', async (request, reply) => {
    try {
      const query = request.query as any;
      const { page, limit, skip } = paging(query);
      const filter = listFilter(query);
      const [audios, total] = await Promise.all([
        AudioModel.find(filter)
          .populate('genre', 'name')
          .populate('category', 'name')
          .populate('language', 'name')
          .sort(query.trending === 'true' ? { views: -1 } : { createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        AudioModel.countDocuments(filter),
      ]);
      return reply.send({
        success: true,
        data: audios.map(formatAudio),
        pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
      });
    } catch (error: any) {
      return sendError(reply, error);
    }
  });

  fastify.get('/public/audio/related', async (request, reply) => {
    try {
      const { id, limit } = request.query as { id?: string; limit?: string };
      if (!id || !isObjectId(id)) {
        return reply.status(400).send({ success: false, error: 'Valid id query parameter is required' });
      }
      const audio = await AudioModel.findById(id).lean();
      if (!audio) return reply.status(404).send({ success: false, error: 'Audio not found' });

      const relatedLimit = Math.min(20, Math.max(1, Number(limit || 10)));
      const filter: any = { status: 'published', _id: { $ne: audio._id }, $or: [] as any[] };
      if (audio.artist) filter.$or.push({ artist: audio.artist });
      if (audio.genre) filter.$or.push({ genre: audio.genre });
      if (audio.tags?.length) filter.$or.push({ tags: { $in: audio.tags } });
      const query = filter.$or.length > 0 ? filter : { status: 'published', _id: { $ne: audio._id } };
      const related = await AudioModel.find(query).sort({ views: -1, createdAt: -1 }).limit(relatedLimit).lean();
      return reply.send({ success: true, data: related.map(formatAudio) });
    } catch (error: any) {
      return sendError(reply, error);
    }
  });

  fastify.get('/public/audio/artists', async (_request, reply) => {
    try {
      const artists = await AudioModel.distinct('artist', { status: 'published' });
      return reply.send({ success: true, data: artists.filter(Boolean).sort() });
    } catch (error: any) {
      return sendError(reply, error);
    }
  });

  fastify.get('/public/audio/albums', async (_request, reply) => {
    try {
      const albums = await AudioModel.distinct('album', { status: 'published' });
      return reply.send({ success: true, data: albums.filter(Boolean).sort() });
    } catch (error: any) {
      return sendError(reply, error);
    }
  });

  fastify.get('/public/audio/artist/:artist', async (request, reply) => {
    try {
      const { artist } = request.params as { artist: string };
      const query = request.query as any;
      const { page, limit, skip } = paging(query);
      const filter = { status: 'published', artist: new RegExp(decodeURIComponent(artist), 'i') };
      const [audios, total] = await Promise.all([
        AudioModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        AudioModel.countDocuments(filter),
      ]);
      return reply.send({
        success: true,
        data: audios.map(formatAudio),
        pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
      });
    } catch (error: any) {
      return sendError(reply, error);
    }
  });

  fastify.get('/public/audio/album/:album', async (request, reply) => {
    try {
      const { album } = request.params as { album: string };
      const query = request.query as any;
      const { page, limit, skip } = paging(query);
      const filter = { status: 'published', album: new RegExp(decodeURIComponent(album), 'i') };
      const [audios, total] = await Promise.all([
        AudioModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        AudioModel.countDocuments(filter),
      ]);
      return reply.send({
        success: true,
        data: audios.map(formatAudio),
        pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
      });
    } catch (error: any) {
      return sendError(reply, error);
    }
  });

  fastify.get('/public/audio/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      if (!isObjectId(id)) return reply.status(404).send({ success: false, error: 'Not found' });
      const audio = await AudioModel.findById(id)
        .populate('genre', 'name')
        .populate('category', 'name')
        .populate('language', 'name')
        .lean();
      if (!audio) return reply.status(404).send({ success: false, error: 'Not found' });
      AudioModel.findByIdAndUpdate(id, { $inc: { views: 1 } }).exec();
      return reply.send({ success: true, data: formatAudio(audio) });
    } catch (error: any) {
      return sendError(reply, error);
    }
  });

  fastify.post('/public/audio/:id/like', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      if (!isObjectId(id)) return reply.status(404).send({ success: false, error: 'Audio not found' });
      const audio = await AudioModel.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { returnDocument: 'after' }).select('likes').lean();
      if (!audio) return reply.status(404).send({ success: false, error: 'Audio not found' });
      return reply.send({ success: true, data: { likes: audio.likes, isLiked: true } });
    } catch (error: any) {
      return sendError(reply, error);
    }
  });

  fastify.post('/public/audio/:id/share', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      if (!isObjectId(id)) return reply.status(404).send({ success: false, error: 'Audio not found' });
      const audio = await AudioModel.findByIdAndUpdate(id, { $inc: { shares: 1 } }, { returnDocument: 'after' }).select('shares').lean();
      return reply.send({ success: true, data: { shares: audio?.shares ?? 1 } });
    } catch (error: any) {
      return sendError(reply, error);
    }
  });

  // ── Video music list ────────────────────────────────────────────────
  fastify.get('/public/video-music', async (request, reply) => {
    try {
      const query = request.query as any;
      const { page, limit, skip } = paging(query);
      const filter = listFilter(query);
      const [videos, total] = await Promise.all([
        VideoMusicModel.find(filter)
          .populate('genre', 'name')
          .populate('category', 'name')
          .populate('language', 'name')
          .sort(query.trending === 'true' ? { views: -1 } : { createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        VideoMusicModel.countDocuments(filter),
      ]);
      return reply.send({
        success: true,
        data: videos.map(formatVideo),
        pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
      });
    } catch (error: any) {
      return sendError(reply, error);
    }
  });

  fastify.get('/public/video-music/related', async (request, reply) => {
    try {
      const { id, limit } = request.query as { id?: string; limit?: string };
      if (!id || !isObjectId(id)) {
        return reply.status(400).send({ success: false, error: 'Valid id query parameter is required' });
      }
      const video = await VideoMusicModel.findById(id).lean();
      if (!video) return reply.status(404).send({ success: false, error: 'Video not found' });

      const relatedLimit = Math.min(20, Math.max(1, Number(limit || 10)));
      const filter: any = { status: 'published', _id: { $ne: video._id }, $or: [] as any[] };
      if (video.artist) filter.$or.push({ artist: video.artist });
      if (video.genre) filter.$or.push({ genre: video.genre });
      if (video.tags?.length) filter.$or.push({ tags: { $in: video.tags } });
      const query = filter.$or.length > 0 ? filter : { status: 'published', _id: { $ne: video._id } };
      const related = await VideoMusicModel.find(query).sort({ views: -1, createdAt: -1 }).limit(relatedLimit).lean();
      return reply.send({ success: true, data: related.map(formatVideo) });
    } catch (error: any) {
      return sendError(reply, error);
    }
  });

  fastify.get('/public/video-music/artists', async (_request, reply) => {
    try {
      const artists = await VideoMusicModel.distinct('artist', { status: 'published' });
      return reply.send({ success: true, data: artists.filter(Boolean).sort() });
    } catch (error: any) {
      return sendError(reply, error);
    }
  });

  fastify.get('/public/video-music/albums', async (_request, reply) => {
    try {
      const albums = await VideoMusicModel.distinct('album', { status: 'published' });
      return reply.send({ success: true, data: albums.filter(Boolean).sort() });
    } catch (error: any) {
      return sendError(reply, error);
    }
  });

  fastify.get('/public/video-music/artist/:artist', async (request, reply) => {
    try {
      const { artist } = request.params as { artist: string };
      const query = request.query as any;
      const { page, limit, skip } = paging(query);
      const filter = { status: 'published', artist: new RegExp(decodeURIComponent(artist), 'i') };
      const [videos, total] = await Promise.all([
        VideoMusicModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        VideoMusicModel.countDocuments(filter),
      ]);
      return reply.send({
        success: true,
        data: videos.map(formatVideo),
        pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
      });
    } catch (error: any) {
      return sendError(reply, error);
    }
  });

  fastify.get('/public/video-music/album/:album', async (request, reply) => {
    try {
      const { album } = request.params as { album: string };
      const query = request.query as any;
      const { page, limit, skip } = paging(query);
      const filter = { status: 'published', album: new RegExp(decodeURIComponent(album), 'i') };
      const [videos, total] = await Promise.all([
        VideoMusicModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        VideoMusicModel.countDocuments(filter),
      ]);
      return reply.send({
        success: true,
        data: videos.map(formatVideo),
        pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
      });
    } catch (error: any) {
      return sendError(reply, error);
    }
  });

  fastify.get('/public/video-music/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      if (!isObjectId(id)) return reply.status(404).send({ success: false, error: 'Not found' });
      const video = await VideoMusicModel.findById(id)
        .populate('genre', 'name')
        .populate('category', 'name')
        .populate('language', 'name')
        .lean();
      if (!video) return reply.status(404).send({ success: false, error: 'Not found' });
      VideoMusicModel.findByIdAndUpdate(id, { $inc: { views: 1 } }).exec();
      return reply.send({ success: true, data: formatVideo(video) });
    } catch (error: any) {
      return sendError(reply, error);
    }
  });

  fastify.post('/public/video-music/:id/like', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      if (!isObjectId(id)) return reply.status(404).send({ success: false, error: 'Video not found' });
      const video = await VideoMusicModel.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { returnDocument: 'after' }).select('likes').lean();
      if (!video) return reply.status(404).send({ success: false, error: 'Video not found' });
      return reply.send({ success: true, data: { likes: video.likes, isLiked: true } });
    } catch (error: any) {
      return sendError(reply, error);
    }
  });

  fastify.post('/public/video-music/:id/share', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      if (!isObjectId(id)) return reply.status(404).send({ success: false, error: 'Video not found' });
      const video = await VideoMusicModel.findByIdAndUpdate(id, { $inc: { shares: 1 } }, { returnDocument: 'after' }).select('shares').lean();
      return reply.send({ success: true, data: { shares: video?.shares ?? 1 } });
    } catch (error: any) {
      return sendError(reply, error);
    }
  });

  fastify.post('/audio/normalize', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { audioUrl, targetLoudness, truePeak, loudnessRange } = (request.body as any) || {};
      if (!audioUrl) return reply.status(400).send({ success: false, error: 'audioUrl is required' });
      const { normalizeAudio } = await import('../lib/audioNormalization');
      const result = await normalizeAudio(audioUrl, {
        targetLoudness: targetLoudness ? Number(targetLoudness) : undefined,
        truePeak: truePeak ? Number(truePeak) : undefined,
        loudnessRange: loudnessRange ? Number(loudnessRange) : undefined,
      });
      return reply.send(result);
    } catch (error: any) {
      return sendError(reply, error);
    }
  });

  fastify.post('/audio/analyze', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { audioUrl } = (request.body as any) || {};
      if (!audioUrl) return reply.status(400).send({ success: false, error: 'audioUrl is required' });
      const { analyzeAudioLoudness } = await import('../lib/audioNormalization');
      const loudnessInfo = await analyzeAudioLoudness(audioUrl);
      return reply.send({ success: true, data: loudnessInfo });
    } catch (error: any) {
      return sendError(reply, error);
    }
  });

  fastify.get('/public/download', async (request, reply) => {
    try {
      const { url, filename } = request.query as { url?: string; filename?: string };
      if (!url) return reply.status(400).send({ success: false, error: 'URL is required' });
      reply.header('Content-Disposition', `attachment; filename="${filename || 'download.mp3'}"`);
      reply.header('Content-Type', 'application/octet-stream');
      return reply.redirect(url);
    } catch (error: any) {
      return sendError(reply, error);
    }
  });
};

export default publicMusicRoutes;
export { formatAudio, formatVideo, getAudioUrl, getVideoUrl };
