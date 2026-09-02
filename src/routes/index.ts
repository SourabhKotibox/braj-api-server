import type { FastifyPluginAsync } from 'fastify';
import healthRoutes from './health';
import authRoutes from './auth';
import appAuthRoutes from './appAuth';
import usersRoutes from './users';
import languagesRoutes from './languages';
import promotionsRoutes from './promotions';
import bannersRoutes from './banners';
import settingsRoutes from './settings';
import genresRoutes from './genres';
import pagesRoutes from './pages';
import faqsRoutes from './faqs';
import actorsRoutes from './actors';
import directorsRoutes from './directors';
import notificationLogsRoutes from './notificationLogs';
import subscriptionPlansRoutes from './subscriptionPlans';
import planLimitsRoutes from './planLimits';
import subscriptionRoutes from './subscriptions';
import categoriesRoutes from './categories';
import notificationTemplatesRoutes from './notificationTemplates';
import mediaRoutes from './media';
import appSettingsRoutes from './appSettings';
import dashboardRoutes from './dashboard';
import movieRoutes from './movie';
import audioRoutes from './audio';
import audioArtistsRoutes from './audioArtists';
import audioAlbumsRoutes from './audioAlbums';
import mobileRoutes from './mobile';
import videoMusicRoutes from './videoMusic';
import relatedRoutes from './related';
import adminUsersRoutes from './adminUsers';
import sectionsRoutes from './sections';
import contentsRoutes from './contents';
import episodesRoutes from './episodes';
import countriesRoutes from './countries';
import crewsRoutes from './crews';
import likeRoutes from './like';
import watchRoutes from './watch';
import shareRoutes from './share';
import wishlistRoutes from './wishlist';
import appProfileRoutes from './appProfile';
import downloadRoutes from './download';
import webDownloadRoutes from './webDownload';
import watchProgressRoutes from './watchProgress';
import rewardRoutes from './rewardRoutes';
import appNotificationRoutes from './appNotificationRoutes';

import { getHomePage } from '../controllers/appHomeController';
import { getAppBanners } from '../controllers/appHomeController';
import { getExplore } from '../controllers/exploreController';
import { getSearchPage } from '../controllers/searchController';
import { getWebHome, getWebAllContent } from '../controllers/webHomeController';
import { getWebBrowse } from '../controllers/webBrowseController';
import { getWebDetail } from '../controllers/webDetailController';
import { getMovieDetail } from '../controllers/appMovieController';
import { getSeriesDetail } from '../controllers/appSeriesController';
import adRoutes from './ad';
import adminNotificationsRoutes from './adminNotifications';
import reviewRoutes from './review';
import viewsRoutes from './views';
import walletRoutes from './walletRoutes';

const router: FastifyPluginAsync = async (fastify) => {
  fastify.register(walletRoutes, { prefix: '/wallet' });
  fastify.register(viewsRoutes);
  fastify.register(reviewRoutes);
  fastify.register(adminNotificationsRoutes, { prefix: '/admin-notifications' });
  fastify.register(adRoutes);
  fastify.register(healthRoutes);
  fastify.register(authRoutes);
  fastify.register(appAuthRoutes);
  fastify.register(usersRoutes);
  fastify.register(languagesRoutes, { prefix: '/languages' });
  fastify.register(promotionsRoutes);
  fastify.register(bannersRoutes);
  fastify.register(settingsRoutes);
  fastify.register(genresRoutes, { prefix: '/genres' });
  fastify.register(pagesRoutes, { prefix: '/pages' });
  fastify.register(faqsRoutes, { prefix: '/faqs' });
  fastify.register(actorsRoutes, { prefix: '/actors' });
  fastify.register(directorsRoutes, { prefix: '/directors' });
  fastify.register(notificationLogsRoutes, { prefix: '/notification-logs' });
  fastify.register(subscriptionPlansRoutes, { prefix: '/subscription-plans' });
  fastify.register(planLimitsRoutes, { prefix: '/plan-limits' });
  fastify.register(subscriptionRoutes);
  fastify.register(categoriesRoutes, { prefix: '/categories' });
  fastify.register(notificationTemplatesRoutes, { prefix: '/notification-templates' });
  fastify.register(mediaRoutes, { prefix: '/media' });
  fastify.register(appSettingsRoutes, { prefix: '/app-settings' });
  fastify.register(dashboardRoutes);
  fastify.register(movieRoutes, { prefix: '/movies' });
  fastify.register(audioRoutes, { prefix: '/audio' });
  fastify.register(audioArtistsRoutes, { prefix: '/audio-artists' });
  fastify.register(audioAlbumsRoutes, { prefix: '/audio-albums' });
  fastify.register(mobileRoutes);
  fastify.register(videoMusicRoutes, { prefix: '/video-music' });
  fastify.register(adminUsersRoutes, { prefix: '/admin-users' });

   // Public audio/video routes (no auth required)
   fastify.get('/public/audio/related', async (request, reply) => {
     try {
       const { AudioModel } = await import('../models/Audio');
       const { id, limit } = request.query as { id: string; limit?: string };

       if (!id) {
         return reply.status(400).send({ success: false, error: 'id query parameter is required' });
       }

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

   fastify.get('/public/video-music/related', async (request, reply) => {
     try {
       const { VideoMusicModel } = await import('../models/VideoMusic');
       const { id, limit } = request.query as { id: string; limit?: string };

       if (!id) {
         return reply.status(400).send({ success: false, error: 'id query parameter is required' });
       }

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
   
   fastify.get('/public/audio', async (request, reply) => {
    try {
      const { AudioModel } = await import('../models/Audio');
      const query = request.query as any;
      const page = Math.max(1, Number(query.page || 1));
      const limit = Math.min(100, Math.max(1, Number(query.limit || 20)));
      const filter: any = { status: 'published' };
      if (query.search) {
        filter.$or = [
          { title: new RegExp(query.search, 'i') },
          { artist: new RegExp(query.search, 'i') },
        ];
      }
      if (query.featured === 'true') filter.featured = true;
      if (query.trending === 'true') filter.trending = true;
      if (query.genre) filter.genre = query.genre;
      if (query.category) filter.category = query.category;
      if (query.language) filter.language = query.language;
      if (query.artist) filter.artist = new RegExp(query.artist, 'i');
      if (query.album) filter.album = new RegExp(query.album, 'i');
      const [audios, total] = await Promise.all([
        AudioModel.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
        AudioModel.countDocuments(filter),
      ]);
      return reply.send({ success: true, data: audios.map((a: any) => ({ ...a, id: a._id?.toString() })), pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Get unique artists
  fastify.get('/public/audio/artists', async (request, reply) => {
    try {
      const { AudioModel } = await import('../models/Audio');
      const artists = await AudioModel.distinct('artist', { status: 'published' });
      return reply.send({ success: true, data: artists.filter(Boolean).sort() });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Get unique albums
  fastify.get('/public/audio/albums', async (request, reply) => {
    try {
      const { AudioModel } = await import('../models/Audio');
      const albums = await AudioModel.distinct('album', { status: 'published' });
      return reply.send({ success: true, data: albums.filter(Boolean).sort() });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Get audio by artist
  fastify.get('/public/audio/artist/:artist', async (request, reply) => {
    try {
      const { AudioModel } = await import('../models/Audio');
      const { artist } = request.params as { artist: string };
      const query = request.query as any;
      const page = Math.max(1, Number(query.page || 1));
      const limit = Math.min(100, Math.max(1, Number(query.limit || 20)));
      const filter: any = { status: 'published', artist: new RegExp(artist, 'i') };
      const [audios, total] = await Promise.all([
        AudioModel.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
        AudioModel.countDocuments(filter),
      ]);
      return reply.send({ success: true, data: audios.map((a: any) => ({ ...a, id: a._id?.toString() })), pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Get audio by album
  fastify.get('/public/audio/album/:album', async (request, reply) => {
    try {
      const { AudioModel } = await import('../models/Audio');
      const { album } = request.params as { album: string };
      const query = request.query as any;
      const page = Math.max(1, Number(query.page || 1));
      const limit = Math.min(100, Math.max(1, Number(query.limit || 20)));
      const filter: any = { status: 'published', album: new RegExp(album, 'i') };
      const [audios, total] = await Promise.all([
        AudioModel.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
        AudioModel.countDocuments(filter),
      ]);
      return reply.send({ success: true, data: audios.map((a: any) => ({ ...a, id: a._id?.toString() })), pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  fastify.get('/public/audio/:id', async (request, reply) => {
    try {
      const { AudioModel } = await import('../models/Audio');
      const { id } = request.params as { id: string };
      const audio = await AudioModel.findById(id).lean();
      if (!audio) return reply.status(404).send({ success: false, error: 'Not found' });
      return reply.send({ success: true, data: { ...audio, id: audio._id?.toString() } });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  fastify.get('/public/video-music', async (request, reply) => {
    try {
      const { VideoMusicModel } = await import('../models/VideoMusic');
      const query = request.query as any;
      const page = Math.max(1, Number(query.page || 1));
      const limit = Math.min(100, Math.max(1, Number(query.limit || 20)));
      const filter: any = { status: 'published' };
      if (query.search) {
        filter.$or = [
          { title: new RegExp(query.search, 'i') },
          { artist: new RegExp(query.search, 'i') },
        ];
      }
      if (query.featured === 'true') filter.featured = true;
      if (query.trending === 'true') filter.trending = true;
      if (query.genre) filter.genre = query.genre;
      if (query.category) filter.category = query.category;
      if (query.language) filter.language = query.language;
      if (query.artist) filter.artist = new RegExp(query.artist, 'i');
      if (query.album) filter.album = new RegExp(query.album, 'i');
      const [videos, total] = await Promise.all([
        VideoMusicModel.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
        VideoMusicModel.countDocuments(filter),
      ]);
      return reply.send({ success: true, data: videos.map((v: any) => ({ ...v, id: v._id?.toString() })), pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Get unique artists for video music
  fastify.get('/public/video-music/artists', async (request, reply) => {
    try {
      const { VideoMusicModel } = await import('../models/VideoMusic');
      const artists = await VideoMusicModel.distinct('artist', { status: 'published' });
      return reply.send({ success: true, data: artists.filter(Boolean).sort() });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Get unique albums for video music
  fastify.get('/public/video-music/albums', async (request, reply) => {
    try {
      const { VideoMusicModel } = await import('../models/VideoMusic');
      const albums = await VideoMusicModel.distinct('album', { status: 'published' });
      return reply.send({ success: true, data: albums.filter(Boolean).sort() });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Get video music by artist
  fastify.get('/public/video-music/artist/:artist', async (request, reply) => {
    try {
      const { VideoMusicModel } = await import('../models/VideoMusic');
      const { artist } = request.params as { artist: string };
      const query = request.query as any;
      const page = Math.max(1, Number(query.page || 1));
      const limit = Math.min(100, Math.max(1, Number(query.limit || 20)));
      const filter: any = { status: 'published', artist: new RegExp(artist, 'i') };
      const [videos, total] = await Promise.all([
        VideoMusicModel.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
        VideoMusicModel.countDocuments(filter),
      ]);
      return reply.send({ success: true, data: videos.map((v: any) => ({ ...v, id: v._id?.toString() })), pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Get video music by album
  fastify.get('/public/video-music/album/:album', async (request, reply) => {
    try {
      const { VideoMusicModel } = await import('../models/VideoMusic');
      const { album } = request.params as { album: string };
      const query = request.query as any;
      const page = Math.max(1, Number(query.page || 1));
      const limit = Math.min(100, Math.max(1, Number(query.limit || 20)));
      const filter: any = { status: 'published', album: new RegExp(album, 'i') };
      const [videos, total] = await Promise.all([
        VideoMusicModel.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
        VideoMusicModel.countDocuments(filter),
      ]);
      return reply.send({ success: true, data: videos.map((v: any) => ({ ...v, id: v._id?.toString() })), pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  fastify.get('/public/video-music/:id', async (request, reply) => {
    try {
      const { VideoMusicModel } = await import('../models/VideoMusic');
      const { id } = request.params as { id: string };
      const video = await VideoMusicModel.findById(id).lean();
      if (!video) return reply.status(404).send({ success: false, error: 'Not found' });
      return reply.send({ success: true, data: { ...video, id: video._id?.toString() } });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Audio normalization endpoint
  fastify.post('/audio/normalize', async (request, reply) => {
    try {
      const { audioUrl, targetLoudness, truePeak, loudnessRange } = request.body as any;
      if (!audioUrl) {
        return reply.status(400).send({ success: false, error: 'audioUrl is required' });
      }

      const { normalizeAudio } = await import('../lib/audioNormalization');
      const result = await normalizeAudio(audioUrl, {
        targetLoudness: targetLoudness ? Number(targetLoudness) : undefined,
        truePeak: truePeak ? Number(truePeak) : undefined,
        loudnessRange: loudnessRange ? Number(loudnessRange) : undefined,
      });

      return reply.send(result);
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Audio loudness analysis endpoint
  fastify.post('/audio/analyze', async (request, reply) => {
    try {
      const { audioUrl } = request.body as any;
      if (!audioUrl) {
        return reply.status(400).send({ success: false, error: 'audioUrl is required' });
      }

      const { analyzeAudioLoudness } = await import('../lib/audioNormalization');
      const loudnessInfo = await analyzeAudioLoudness(audioUrl);

      return reply.send({ success: true, data: loudnessInfo });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // ─── Public Like/Wishlist/Share/Download for Audio/Video Music ───────────────

  fastify.post('/public/audio/:id/like', async (request, reply) => {
    try {
      const { AudioModel } = await import('../models/Audio');
      const { id } = request.params as { id: string };
      const audio = await AudioModel.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { returnDocument: 'after' }).select('likes').lean();
      if (!audio) return reply.status(404).send({ success: false, error: 'Audio not found' });
      return reply.send({ success: true, data: { likes: audio.likes, isLiked: true } });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  fastify.post('/public/video-music/:id/like', async (request, reply) => {
    try {
      const { VideoMusicModel } = await import('../models/VideoMusic');
      const { id } = request.params as { id: string };
      const video = await VideoMusicModel.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { returnDocument: 'after' }).select('likes').lean();
      if (!video) return reply.status(404).send({ success: false, error: 'Video not found' });
      return reply.send({ success: true, data: { likes: video.likes, isLiked: true } });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  fastify.post('/public/audio/:id/share', async (request, reply) => {
    try {
      const { AudioModel } = await import('../models/Audio');
      const { id } = request.params as { id: string };
      const audio = await AudioModel.findByIdAndUpdate(id, { $inc: { shares: 1 } }, { returnDocument: 'after' }).select('shares').lean();
      return reply.send({ success: true, data: { shares: audio?.shares ?? 1 } });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  fastify.post('/public/video-music/:id/share', async (request, reply) => {
    try {
      const { VideoMusicModel } = await import('../models/VideoMusic');
      const { id } = request.params as { id: string };
      const video = await VideoMusicModel.findByIdAndUpdate(id, { $inc: { shares: 1 } }, { returnDocument: 'after' }).select('shares').lean();
      return reply.send({ success: true, data: { shares: video?.shares ?? 1 } });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Direct download endpoint (triggers file download)
  fastify.get('/public/download', async (request, reply) => {
    try {
      const { url, filename } = request.query as { url?: string; filename?: string };
      if (!url) return reply.status(400).send({ success: false, error: 'URL is required' });
      reply.header('Content-Disposition', `attachment; filename="${filename || 'download.mp3'}"`);
      reply.header('Content-Type', 'application/octet-stream');
      reply.redirect(url);
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  fastify.register(sectionsRoutes, { prefix: '/sections' });
  fastify.register(contentsRoutes, { prefix: '/contents' });
  fastify.register(episodesRoutes, { prefix: '/episodes' });
  fastify.register(countriesRoutes, { prefix: '/countries' });
  fastify.register(crewsRoutes, { prefix: '/crews' });

  // Like / Unlike route
  fastify.register(likeRoutes);

  // Watch page route (video player + episodes + lock/unlock)
  fastify.register(watchRoutes);

  // Smart Deep Link Share route
  fastify.register(shareRoutes);

  // Wishlist route
  fastify.register(wishlistRoutes, { prefix: '/app' });

  // App Profile / Settings route
  fastify.register(appProfileRoutes, { prefix: '/app' });

  // Download routes (POST /download, GET /downloads, DELETE /downloads/:id)
  fastify.register(downloadRoutes, { prefix: '/app' });

  // Web download routes — separate from app, no subscription gate
  fastify.register(webDownloadRoutes, { prefix: '/web' });

  // Watch progress routes (POST /watch/progress, DELETE /watch/progress/:contentId)
  fastify.register(watchProgressRoutes, { prefix: '/app' });

  // Rewards routes
  fastify.register(rewardRoutes, { prefix: '/app/rewards' });

  // App Notifications routes
  fastify.register(appNotificationRoutes, { prefix: '/app/notifications' });

  // Mobile movie detail page
  fastify.get('/app/movies/:id', getMovieDetail);

  // Mobile series detail page (includes seasons and episodes)
  fastify.get('/app/series/:id', getSeriesDetail);

  // Home page route for app (layout/sections only — no banners)
  fastify.get('/home', getHomePage);

  // App Banners — separate from home layout
  // ?tab=drama   → drama banners only
  // ?tab=movie   → movie banners only
  // ?tab=both    → all banners
  fastify.get('/app/banners', getAppBanners);
  
  // Explore page (infinite scroll)
  fastify.get('/explore', getExplore);

  // Search page (trending keywords + query results)
  fastify.get('/search', getSearchPage);

  // Web Homepage aggregated data
  fastify.get('/web-home', getWebHome);
  
  // Web all content for dynamic sections
  fastify.get('/web-all-content', getWebAllContent);
  
  // Web Browse paginated data
  fastify.get('/web-browse', getWebBrowse);
  
  // Web Detail page data
  fastify.get('/web-detail/:contentId', getWebDetail);

  // Public banners by page (for music, videos, movies, tvshows)
  fastify.get('/public/banners', async (request, reply) => {
    try {
      const { BannerModel } = await import('../models/Banner');
      const { page, limit } = request.query as { page?: string; limit?: string };
      const now = new Date();
      const pageNum = Math.max(1, Number(page || 1));
      const limitNum = Math.min(50, Math.max(1, Number(limit || 10)));

      const filter: any = {
        isActive: true,
        $and: [
          { $or: [{ startDate: { $exists: false } }, { startDate: { $lte: now } }] },
          { $or: [{ endDate: { $exists: false } }, { endDate: { $gte: now } }] },
        ],
      };

      // Filter by target page if specified
      if (page) {
        filter.targetPages = { $in: [page] };
      }

      const [banners, total] = await Promise.all([
        BannerModel.find(filter)
          .sort({ position: 1, createdAt: -1 })
          .skip((pageNum - 1) * limitNum)
          .limit(limitNum)
          .lean(),
        BannerModel.countDocuments(filter),
      ]);

      // Populate content based on contentModel
      const contentIds = banners.map(b => b.contentId).filter(Boolean);
      const [movies, contents, audios, videoMusics] = await Promise.all([
        import('../models/Movie').then(m => m.MovieModel.find({ _id: { $in: contentIds } }).lean()),
        import('../models/Content').then(m => m.ContentModel.find({ _id: { $in: contentIds } }).lean()),
        import('../models/Audio').then(m => m.AudioModel.find({ _id: { $in: contentIds } }).lean()),
        import('../models/VideoMusic').then(m => m.VideoMusicModel.find({ _id: { $in: contentIds } }).lean()),
      ]);

      const contentMap = new Map();
      for (const movie of movies) contentMap.set(movie._id.toString(), { ...movie, type: 'movie' });
      for (const content of contents) contentMap.set(content._id.toString(), { ...content, type: content.contentType || 'series' });
      for (const audio of audios) contentMap.set(audio._id.toString(), { ...audio, type: 'audio' });
      for (const vm of videoMusics) contentMap.set(vm._id.toString(), { ...vm, type: 'video-music' });

      const populatedBanners = banners.map(banner => ({
        id: banner._id.toString(),
        title: banner.title,
        subtitle: banner.subtitle,
        description: banner.description,
        imageUrl: banner.imageUrl,
        mobileImageUrl: banner.mobileImageUrl,
        ctaText: banner.ctaText,
        ctaLink: banner.ctaLink,
        position: banner.position,
        type: banner.type,
        contentType: banner.contentType,
        content: banner.contentId ? contentMap.get(banner.contentId.toString()) || null : null,
      }));

      return reply.send({
        success: true,
        data: populatedBanners,
        pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
      });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Public notifications (broadcast only — no private user data)
  fastify.get('/public/notifications', async (request, reply) => {
    try {
      const { NotificationLogModel } = await import('../models/NotificationLog');
      const notifications = await NotificationLogModel.find({ type: { $in: ['all', 'broadcast', 'announcement', 'promo'] } })
        .sort({ createdAt: -1 })
        .limit(10)
        .select('title text type createdAt')
        .lean();
      return reply.send({ success: true, data: notifications });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

};

export default router;
