import type { FastifyPluginAsync } from 'fastify';
import {
  getAllContestVideos,
  getContestVideoById,
  createContestVideo,
  updateContestVideo,
  deleteContestVideo,
  toggleContestVideoFeatured,
  toggleContestVideoTrending,
} from '../controllers/contestVideoController';
import { requirePermission } from '../middlewares/rbac';

const contestVideoRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', { onRequest: [requirePermission('contests', 'canView')] }, getAllContestVideos);
  fastify.post('/', { onRequest: [requirePermission('contests', 'canCreate')] }, createContestVideo);
  fastify.get('/:id', { onRequest: [requirePermission('contests', 'canView')] }, getContestVideoById);
  fastify.put('/:id', { onRequest: [requirePermission('contests', 'canEdit')] }, updateContestVideo);
  fastify.delete('/:id', { onRequest: [requirePermission('contests', 'canDelete')] }, deleteContestVideo);
  fastify.patch('/:id/featured', { onRequest: [requirePermission('contests', 'canEdit')] }, toggleContestVideoFeatured);
  fastify.patch('/:id/trending', { onRequest: [requirePermission('contests', 'canEdit')] }, toggleContestVideoTrending);
};

export default contestVideoRoutes;
