import type { FastifyPluginAsync } from 'fastify';
import { AudioModel } from '../models/Audio';
import { VideoMusicModel } from '../models/VideoMusic';
import { AudioArtistModel } from '../models/AudioArtist';
import { AudioAlbumModel } from '../models/AudioAlbum';

const musicApiRoutes: FastifyPluginAsync = async (fastify) => {
  
  // ─── Get All Songs (Audio) ──────────────────────────────────────────
  // GET /api/songs?page=1&limit=20&trending=true&featured=true&genre=xxx&search=xxx
  fastify.get('/songs', async (request, reply) => {
    try {
      const query = request.query as any;
      const page = Math.max(1, Number(query.page || 1));
      const limit = Math.min(50, Math.max(1, Number(query.limit || 20)));
      
      const filter: any = { status: 'published' };
      
      if (query.trending === 'true') filter.trending = true;
      if (query.featured === 'true') filter.featured = true;
      if (query.new === 'true') filter.isNewContent = true;
      if (query.genre) filter.genre = query.genre;
      if (query.artist) filter.artist = new RegExp(query.artist, 'i');
      if (query.album) filter.album = new RegExp(query.album, 'i');
      
      if (query.search) {
        filter.$or = [
          { title: new RegExp(query.search, 'i') },
          { artist: new RegExp(query.search, 'i') },
          { album: new RegExp(query.search, 'i') },
        ];
      }

      const [songs, total] = await Promise.all([
        AudioModel.find(filter)
          .populate('genre', 'name')
          .sort(query.trending === 'true' ? { views: -1 } : { createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean(),
        AudioModel.countDocuments(filter),
      ]);

      return reply.send({
        success: true,
        data: songs.map(formatSong),
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // ─── Get Song Detail ────────────────────────────────────────────────
  // GET /api/songs/:id
  fastify.get('/songs/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      
      const song = await AudioModel.findById(id)
        .populate('genre', 'name')
        .populate('artistId', 'name image')
        .populate('albumId', 'name image')
        .lean();

      if (!song) {
        return reply.status(404).send({ success: false, error: 'Song not found' });
      }

      // Increment views (fire and forget)
      AudioModel.findByIdAndUpdate(id, { $inc: { views: 1 } }).exec();

      // Build filter for related songs — use raw genre id before populate
      const relatedFilter: any = {
        status: 'published',
        _id: { $ne: song._id },
        $or: [] as any[],
      };
      if (song.artist) relatedFilter.$or.push({ artist: song.artist });
      // genre may be populated object or ObjectId
      const genreId = (song.genre as any)?._id || song.genre;
      if (genreId) relatedFilter.$or.push({ genre: genreId });
      const relatedQuery = relatedFilter.$or.length > 0
        ? relatedFilter
        : { status: 'published', _id: { $ne: song._id } };

      const related = await AudioModel.find(relatedQuery)
        .sort({ views: -1 })
        .limit(10)
        .lean();

      return reply.send({
        success: true,
        data: {
          ...formatSong(song),
          description: song.description,
          shortDescription: song.shortDescription,
          coverImage: song.coverImage,
          lyrics: song.lyrics,
          releaseDate: song.releaseDate,
          tags: song.tags,
          audioQualities: song.audioQualities,
          hlsUrl: song.hlsUrl,
          downloadAllowed: song.downloadAllowed,
          related: related.map(formatSong),
        },
      });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // ─── Get All Video Music ────────────────────────────────────────────
  // GET /api/videos?page=1&limit=20&trending=true&featured=true&search=xxx
  fastify.get('/videos', async (request, reply) => {
    try {
      const query = request.query as any;
      const page = Math.max(1, Number(query.page || 1));
      const limit = Math.min(50, Math.max(1, Number(query.limit || 20)));
      
      const filter: any = { status: 'published' };
      
      if (query.trending === 'true') filter.trending = true;
      if (query.featured === 'true') filter.featured = true;
      if (query.new === 'true') filter.isNewContent = true;
      if (query.genre) filter.genre = query.genre;
      if (query.artist) filter.artist = new RegExp(query.artist, 'i');
      
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
          .sort(query.trending === 'true' ? { views: -1 } : { createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean(),
        VideoMusicModel.countDocuments(filter),
      ]);

      return reply.send({
        success: true,
        data: videos.map(formatVideo),
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // ─── Get Video Detail ───────────────────────────────────────────────
  // GET /api/videos/:id
  fastify.get('/videos/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      
      const video = await VideoMusicModel.findById(id)
        .populate('genre', 'name')
        .populate('artistId', 'name image')
        .lean();

      if (!video) {
        return reply.status(404).send({ success: false, error: 'Video not found' });
      }

      // Increment views
      VideoMusicModel.findByIdAndUpdate(id, { $inc: { views: 1 } }).exec();

      // Get related videos
      const related = await VideoMusicModel.find({
        status: 'published',
        _id: { $ne: video._id },
        $or: [
          ...(video.artist ? [{ artist: video.artist }] : []),
          ...(video.genre ? [{ genre: video.genre }] : []),
        ],
      })
        .sort({ views: -1 })
        .limit(10)
        .lean();

      return reply.send({
        success: true,
        data: {
          ...formatVideo(video),
          description: video.description,
          coverImage: video.coverImage,
          releaseDate: video.releaseDate,
          tags: video.tags,
          videoQualities: video.videoQualities,
          hlsUrl: video.hlsUrl,
          downloadAllowed: video.downloadAllowed,
          related: related.map(formatVideo),
        },
      });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // ─── Get All Artists ────────────────────────────────────────────────
  // GET /api/artists?page=1&limit=20&search=xxx
  fastify.get('/artists', async (request, reply) => {
    try {
      const query = request.query as any;
      const page = Math.max(1, Number(query.page || 1));
      const limit = Math.min(50, Math.max(1, Number(query.limit || 20)));
      
      const filter: any = { status: true };
      if (query.search) {
        filter.name = new RegExp(query.search, 'i');
      }

      const [artists, total] = await Promise.all([
        AudioArtistModel.find(filter)
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean(),
        AudioArtistModel.countDocuments(filter),
      ]);

      return reply.send({
        success: true,
        data: artists.map((a: any) => ({
          id: a._id,
          name: a.name,
          image: a.image,
          coverImage: a.coverImage,
          bio: a.bio,
          genre: a.genre,
          country: a.country,
        })),
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // ─── Get Artist Detail with Songs ───────────────────────────────────
  // GET /api/artists/:id
  fastify.get('/artists/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      
      const artist = await AudioArtistModel.findById(id).lean();
      if (!artist) {
        return reply.status(404).send({ success: false, error: 'Artist not found' });
      }

      // Songs that reference this artist by artistId OR by artist name string
      const songs = await AudioModel.find({
        status: 'published',
        $or: [{ artistId: id }, { artist: artist.name }],
      })
        .sort({ views: -1 })
        .lean();

      const albums = await AudioAlbumModel.find({ artistId: id, status: true })
        .sort({ createdAt: -1 })
        .lean();

      return reply.send({
        success: true,
        data: {
          id: artist._id,
          name: artist.name,
          image: artist.image,
          coverImage: artist.coverImage,
          bio: artist.bio,
          genre: artist.genre,
          country: artist.country,
          songs: songs.map(formatSong),
          albums: albums.map((a: any) => ({
            id: a._id,
            name: a.name,
            image: a.image,
            totalTracks: a.songs?.length || 0,
          })),
        },
      });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // ─── Get All Albums ─────────────────────────────────────────────────
  // GET /api/albums?page=1&limit=20&search=xxx
  fastify.get('/albums', async (request, reply) => {
    try {
      const query = request.query as any;
      const page = Math.max(1, Number(query.page || 1));
      const limit = Math.min(50, Math.max(1, Number(query.limit || 20)));
      
      const filter: any = { status: true };
      if (query.search) {
        filter.name = new RegExp(query.search, 'i');
      }

      const [albums, total] = await Promise.all([
        AudioAlbumModel.find(filter)
          .populate('artistId', 'name image')
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean(),
        AudioAlbumModel.countDocuments(filter),
      ]);

      return reply.send({
        success: true,
        data: albums.map((a: any) => ({
          id: a._id,
          name: a.name,
          image: a.image,
          coverImage: a.coverImage,
          artist: a.artist,
          artistId: a.artistId?._id || a.artistId,
          artistName: a.artistId?.name,
          description: a.description,
          genre: a.genre,
          releaseDate: a.releaseDate,
          totalTracks: a.songs?.length || 0,
        })),
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // ─── Get Album Detail with Songs ────────────────────────────────────
  // GET /api/albums/:id
  fastify.get('/albums/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      
      const album = await AudioAlbumModel.findById(id)
        .populate('artistId', 'name image bio')
        .lean();
        
      if (!album) {
        return reply.status(404).send({ success: false, error: 'Album not found' });
      }

      const trackIds = album.songs || [];
      const songs = await AudioModel.find({ _id: { $in: trackIds }, status: 'published' }).lean();

      return reply.send({
        success: true,
        data: {
          id: album._id,
          name: album.name,
          image: album.image,
          coverImage: album.coverImage,
          description: album.description,
          genre: album.genre,
          releaseDate: album.releaseDate,
          artist: {
            id: album.artistId?._id || album.artistId,
            name: album.artistId?.name,
            image: album.artistId?.image,
          },
          songs: songs.map(formatSong),
        },
      });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // ─── Search Songs/Videos/Artists/Albums ─────────────────────────────
  // GET /api/music/search?q=xxx&type=songs|videos|artists|albums|all
  fastify.get('/music/search', async (request, reply) => {
    try {
      const { q, type } = request.query as { q?: string; type?: string };
      
      if (!q) {
        return reply.status(400).send({ success: false, error: 'Query parameter q is required' });
      }

      const searchRegex = new RegExp(q, 'i');
      const limit = 20;

      const results: any = {};

      if (!type || type === 'all' || type === 'songs') {
        results.songs = await AudioModel.find({
          status: 'published',
          $or: [
            { title: searchRegex },
            { artist: searchRegex },
            { album: searchRegex },
          ],
        }).limit(limit).lean();
      }

      if (!type || type === 'all' || type === 'videos') {
        results.videos = await VideoMusicModel.find({
          status: 'published',
          $or: [
            { title: searchRegex },
            { artist: searchRegex },
            { album: searchRegex },
          ],
        }).limit(limit).lean();
      }

      if (!type || type === 'all' || type === 'artists') {
        results.artists = await AudioArtistModel.find({
          status: true,
          name: searchRegex,
        }).limit(limit).lean();
      }

      if (!type || type === 'all' || type === 'albums') {
        results.albums = await AudioAlbumModel.find({
          status: true,
          name: searchRegex,
        }).limit(limit).lean();
      }

      return reply.send({
        success: true,
        data: {
          songs: (results.songs || []).map(formatSong),
          videos: (results.videos || []).map(formatVideo),
          artists: (results.artists || []).map((a: any) => ({
            id: a._id,
            name: a.name,
            image: a.image,
          })),
          albums: (results.albums || []).map((a: any) => ({
            id: a._id,
            name: a.name,
            image: a.image,
            artist: a.artist,
          })),
        },
      });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // ─── Like Song ──────────────────────────────────────────────────────
  // POST /api/songs/:id/like
  fastify.post('/songs/:id/like', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const song = await AudioModel.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { returnDocument: 'after' })
        .select('likes').lean();
      
      if (!song) return reply.status(404).send({ success: false, error: 'Song not found' });
      return reply.send({ success: true, data: { likes: song.likes, isLiked: true } });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // ─── Like Video ─────────────────────────────────────────────────────
  // POST /api/videos/:id/like
  fastify.post('/videos/:id/like', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const video = await VideoMusicModel.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { returnDocument: 'after' })
        .select('likes').lean();
      
      if (!video) return reply.status(404).send({ success: false, error: 'Video not found' });
      return reply.send({ success: true, data: { likes: video.likes, isLiked: true } });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // ─── Share Song ─────────────────────────────────────────────────────
  // POST /api/songs/:id/share
  fastify.post('/songs/:id/share', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const song = await AudioModel.findByIdAndUpdate(id, { $inc: { shares: 1 } }, { returnDocument: 'after' })
        .select('shares').lean();
      return reply.send({ success: true, data: { shares: song?.shares ?? 1 } });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // ─── Share Video ────────────────────────────────────────────────────
  // POST /api/videos/:id/share
  fastify.post('/videos/:id/share', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const video = await VideoMusicModel.findByIdAndUpdate(id, { $inc: { shares: 1 } }, { returnDocument: 'after' })
        .select('shares').lean();
      return reply.send({ success: true, data: { shares: video?.shares ?? 1 } });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });
};

// ─── Helper Functions ─────────────────────────────────────────────────
function formatSong(song: any) {
  // genre can be a populated object { _id, name } or a raw ObjectId
  const genreObj = song.genre && typeof song.genre === 'object' && !Array.isArray(song.genre)
    ? song.genre
    : null;
  // artistId can be a populated object { _id, name, image } or a raw ObjectId
  const artistObj = song.artistId && typeof song.artistId === 'object' && song.artistId.name
    ? song.artistId
    : null;
  // albumId can be a populated object { _id, name, image } or a raw ObjectId
  const albumObj = song.albumId && typeof song.albumId === 'object' && song.albumId.name
    ? song.albumId
    : null;

  return {
    id: song._id?.toString() || song.id,
    title: song.title,
    artist: song.artist,
    artistId: artistObj?._id?.toString() || (song.artistId ? song.artistId.toString() : null),
    artistName: artistObj?.name || song.artist,
    artistImage: artistObj?.image || null,
    album: song.album,
    albumId: albumObj?._id?.toString() || (song.albumId ? song.albumId.toString() : null),
    albumName: albumObj?.name || song.album || null,
    genre: genreObj?.name || null,
    genreId: genreObj?._id?.toString() || (song.genre ? song.genre.toString() : null),
    thumbnail: song.thumbnail || null,
    coverImage: song.coverImage || null,
    duration: song.duration || 0,
    views: song.views || 0,
    likes: song.likes || 0,
    shares: song.shares || 0,
    trending: song.trending || false,
    featured: song.featured || false,
    isNew: song.isNewContent || false,
    isExclusive: song.isExclusive || false,
    downloadAllowed: song.downloadAllowed !== undefined ? song.downloadAllowed : true,
    audioUrl: song.audioQualities?.[0]?.url || song.audioUrl || null,
    hlsUrl: song.hlsUrl || null,
    planRequired: song.planRequired || 'free',
    createdAt: song.createdAt,
    updatedAt: song.updatedAt,
  };
}

function formatVideo(video: any) {
  return {
    id: video._id?.toString() || video.id,
    title: video.title,
    artist: video.artist,
    artistId: video.artistId?._id?.toString() || video.artistId,
    artistName: video.artistId?.name || video.artist,
    album: video.album,
    albumId: video.albumId?._id?.toString() || video.albumId,
    thumbnail: video.thumbnail,
    duration: video.duration,
    views: video.views || 0,
    likes: video.likes || 0,
    trending: video.trending || false,
    featured: video.featured || false,
    isNew: video.isNewContent || false,
    videoUrl: video.videoQualities?.[0]?.url || video.videoUrl,
    hlsUrl: video.hlsUrl,
    planRequired: video.planRequired || 'free',
    createdAt: video.createdAt,
  };
}

export default musicApiRoutes;
