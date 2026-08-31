import type { FastifyPluginAsync } from 'fastify';
import {
  getAllAudios,
  getAudioById,
  createAudio,
  updateAudio,
  deleteAudio,
  toggleAudioFeatured,
  toggleAudioTrending,
} from '../controllers/audioController';
import { requirePermission } from '../middlewares/rbac';

const audioRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', { onRequest: [requirePermission('audio', 'canView')] }, getAllAudios);
  fastify.post('/', { onRequest: [requirePermission('audio', 'canCreate')] }, createAudio);
  fastify.get('/:id', { onRequest: [requirePermission('audio', 'canView')] }, getAudioById);
  fastify.put('/:id', { onRequest: [requirePermission('audio', 'canEdit')] }, updateAudio);
  fastify.delete('/:id', { onRequest: [requirePermission('audio', 'canDelete')] }, deleteAudio);
  fastify.patch('/:id/featured', { onRequest: [requirePermission('audio', 'canEdit')] }, toggleAudioFeatured);
  fastify.patch('/:id/trending', { onRequest: [requirePermission('audio', 'canEdit')] }, toggleAudioTrending);
};

export default audioRoutes;
