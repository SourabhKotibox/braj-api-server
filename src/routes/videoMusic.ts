import type { FastifyPluginAsync } from 'fastify';
import {
  getAllVideoMusics,
  getVideoMusicById,
  createVideoMusic,
  updateVideoMusic,
  deleteVideoMusic,
  toggleVideoMusicFeatured,
  toggleVideoMusicTrending,
} from '../controllers/videoMusicController';
import { requirePermission } from '../middlewares/rbac';

const videoMusicRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', { onRequest: [requirePermission('videoMusic', 'canView')] }, getAllVideoMusics);
  fastify.post('/', { onRequest: [requirePermission('videoMusic', 'canCreate')] }, createVideoMusic);
  fastify.get('/:id', { onRequest: [requirePermission('videoMusic', 'canView')] }, getVideoMusicById);
  fastify.put('/:id', { onRequest: [requirePermission('videoMusic', 'canEdit')] }, updateVideoMusic);
  fastify.delete('/:id', { onRequest: [requirePermission('videoMusic', 'canDelete')] }, deleteVideoMusic);
  fastify.patch('/:id/featured', { onRequest: [requirePermission('videoMusic', 'canEdit')] }, toggleVideoMusicFeatured);
  fastify.patch('/:id/trending', { onRequest: [requirePermission('videoMusic', 'canEdit')] }, toggleVideoMusicTrending);
};

export default videoMusicRoutes;
