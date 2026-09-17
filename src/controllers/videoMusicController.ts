import type { FastifyRequest, FastifyReply } from 'fastify';
import { VideoMusicModel } from '../models/VideoMusic';
import { MediaFileModel } from '../models/MediaFile';
import { logger } from '../lib/logger';
import { buildRefUpdate, sanitizeRefFields } from '../lib/sanitizeRefs';
import { getVideoPlaybackUrl, normalizeMediaUrl } from '../lib/resolvePlaybackUrl';
import { transcodeToHls } from '../lib/hlsTranscoder';

const getVideoUrl = (video: any): string => getVideoPlaybackUrl(video);

function sanitizeVideoMediaFields(data: Record<string, any>) {
  if ('videoUrl' in data) data.videoUrl = normalizeMediaUrl(data.videoUrl);
  if ('hlsUrl' in data) {
    const hls = normalizeMediaUrl(data.hlsUrl);
    if (hls) data.hlsUrl = hls;
    else delete data.hlsUrl;
  }
  if ('thumbnail' in data) data.thumbnail = normalizeMediaUrl(data.thumbnail) || data.thumbnail;
  if ('coverImage' in data) data.coverImage = normalizeMediaUrl(data.coverImage) || data.coverImage;
  if ('bannerImage' in data) data.bannerImage = normalizeMediaUrl(data.bannerImage) || data.bannerImage;
  if (Array.isArray(data.videoQualities)) {
    data.videoQualities = data.videoQualities.map((q: any) => ({
      ...q,
      url: normalizeMediaUrl(q?.url) || q?.url,
    }));
  }
  return data;
}

/**
 * Sync HLS fields from the MediaFile record that was created during upload.
 * - If the MediaFile has completed HLS transcoding → populate hlsUrl, videoQualities, duration.
 * - If it is still processing → set processingStatus = 'processing'.
 * - If no MediaFile exists yet and the URL is a raw local path → create a MediaFile and trigger HLS.
 */
async function syncHlsFromMediaFile(videoData: Record<string, any>): Promise<void> {
  if (!videoData.videoUrl) return;

  const url: string = videoData.videoUrl;
  const cleanUrl = url.replace(/^\/+/, '');

  // Escape special regex characters safely
  const escaped = cleanUrl.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');

  const mediaFile = await MediaFileModel.findOne({
    $or: [
      { url: url },
      { filePath: url },
      { filePath: '/' + cleanUrl },
      { url: { $regex: new RegExp(escaped + '$') } },
    ],
  }).lean();

  if (mediaFile) {
    if (mediaFile.isHls && mediaFile.hlsMasterPlaylistUrl) {
      videoData.hlsUrl = mediaFile.hlsMasterPlaylistUrl;
      videoData.processingStatus = 'ready';
    } else if (mediaFile.hlsStatus === 'processing' || mediaFile.hlsStatus === 'pending') {
      videoData.processingStatus = 'processing';
    } else if (mediaFile.hlsStatus === 'failed') {
      videoData.processingStatus = 'failed';
    }

    if (mediaFile.hlsQualities && mediaFile.hlsQualities.length > 0) {
      videoData.videoQualities = mediaFile.hlsQualities.map((q: any) => ({
        quality: q.quality,
        url: q.url || q.filePath,
        size: 0,
      }));
    }

    if (mediaFile.duration && !videoData.duration) {
      videoData.duration = mediaFile.duration;
    }
  } else {
    // No MediaFile found — if local path, create one and trigger HLS
    const isRawLocalVideo = !url.startsWith('http://') && !url.startsWith('https://');
    if (isRawLocalVideo) {
      try {
        const newMedia = await MediaFileModel.create({
          name: url.split('/').pop() || 'video',
          url: url,
          filePath: url,
          fileSize: 0,
          fileType: 'video/mp4',
          source: 'video-music',
          storageType: 'local',
        });
        transcodeToHls(newMedia._id.toString(), url, url).catch((err) =>
          logger.error({ err }, 'Failed to trigger HLS transcoding for video music')
        );
        videoData.processingStatus = 'processing';
      } catch (err) {
        logger.error({ err }, 'Failed to create MediaFile for video music HLS');
      }
    }
  }
}

// ─── GET ALL ────────────────────────────────────────────────────────────────────
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
      data: videos.map((v) => ({ ...v, id: v._id?.toString(), videoUrl: getVideoUrl(v) })),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    logger.error({ error }, 'Error getting all video musics');
    return reply.status(500).send({ success: false, error: error.message });
  }
};

// ─── GET BY ID ──────────────────────────────────────────────────────────────────
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

    return reply.send({ success: true, data: { ...video, id: video._id?.toString(), videoUrl: getVideoUrl(video) } });
  } catch (error: any) {
    logger.error({ error }, 'Error getting video music by ID');
    return reply.status(500).send({ success: false, error: error.message });
  }
};

// ─── CREATE ─────────────────────────────────────────────────────────────────────
export const createVideoMusic = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const body = request.body as any;
    const { set: videoData } = sanitizeRefFields(body);
    sanitizeVideoMediaFields(videoData);

    // Sync HLS / duration fields from media library if already uploaded
    await syncHlsFromMediaFile(videoData);

    // Set processingStatus if not already set by syncHlsFromMediaFile
    if (!videoData.processingStatus) {
      const isRawLocal = videoData.videoUrl
        && !videoData.videoUrl.startsWith('http://')
        && !videoData.videoUrl.startsWith('https://');
      videoData.processingStatus = isRawLocal ? 'queued' : 'ready';
    }

    // Default quality entry if none present
    if ((!videoData.videoQualities || videoData.videoQualities.length === 0) && videoData.videoUrl) {
      videoData.videoQualities = [{ quality: '720p', url: videoData.videoUrl, size: 0 }];
    }

    const video = await VideoMusicModel.create(videoData);

    return reply.status(201).send({
      success: true,
      data: { ...video.toObject(), id: video._id?.toString(), videoUrl: getVideoUrl(video.toObject()) },
    });
  } catch (error: any) {
    logger.error({ error }, 'Error creating video music');
    return reply.status(500).send({ success: false, error: error.message });
  }
};

// ─── UPDATE ─────────────────────────────────────────────────────────────────────
export const updateVideoMusic = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    const body = request.body as any;
    const update = buildRefUpdate(body);

    if (update.$set) {
      sanitizeVideoMediaFields(update.$set);
      await syncHlsFromMediaFile(update.$set);
    }

    if (!update.$set && !update.$unset) {
      return reply.status(400).send({ success: false, error: 'No fields to update' });
    }

    const video = await VideoMusicModel.findByIdAndUpdate(id, update, { returnDocument: 'after', runValidators: true });

    if (!video) {
      return reply.status(404).send({ success: false, error: 'Video music not found' });
    }

    return reply.send({ success: true, data: { ...video.toObject(), id: video._id?.toString() } });
  } catch (error: any) {
    logger.error({ error }, 'Error updating video music');
    return reply.status(500).send({ success: false, error: error.message });
  }
};

// ─── DELETE ─────────────────────────────────────────────────────────────────────
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

// ─── TOGGLE FEATURED ────────────────────────────────────────────────────────────
export const toggleVideoMusicFeatured = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    const video = await VideoMusicModel.findById(id).lean();

    if (!video) {
      return reply.status(404).send({ success: false, error: 'Video music not found' });
    }

    const updated = await VideoMusicModel.findByIdAndUpdate(
      id,
      { $set: { featured: !video.featured } },
      { returnDocument: 'after' }
    ).lean();

    return reply.send({ success: true, data: { ...updated, id: updated?._id?.toString() } });
  } catch (error: any) {
    logger.error({ error }, 'Error toggling video music featured');
    return reply.status(500).send({ success: false, error: error.message });
  }
};

// ─── TOGGLE TRENDING ────────────────────────────────────────────────────────────
export const toggleVideoMusicTrending = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    const video = await VideoMusicModel.findById(id).lean();

    if (!video) {
      return reply.status(404).send({ success: false, error: 'Video music not found' });
    }

    const updated = await VideoMusicModel.findByIdAndUpdate(
      id,
      { $set: { trending: !video.trending } },
      { returnDocument: 'after' }
    ).lean();

    return reply.send({ success: true, data: { ...updated, id: updated?._id?.toString() } });
  } catch (error: any) {
    logger.error({ error }, 'Error toggling video music trending');
    return reply.status(500).send({ success: false, error: error.message });
  }
};
