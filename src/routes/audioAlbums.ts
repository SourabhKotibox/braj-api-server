import { requirePermission } from '../middlewares/rbac';
import type { FastifyPluginAsync } from 'fastify';
import {
  listAudioAlbums,
  getAudioAlbumById,
  createAudioAlbum,
  updateAudioAlbum,
  deleteAudioAlbum,
  bulkDeleteAudioAlbums,
} from '../controllers/audioAlbumController';

const audioAlbumsRoutes: FastifyPluginAsync = async (fastify, opts) => {
  fastify.get('/', { onRequest: [requirePermission('audio', 'canView')] }, listAudioAlbums);
  fastify.get('/item/:albumId', { onRequest: [requirePermission('audio', 'canView')] }, getAudioAlbumById);
  fastify.post('/', { onRequest: [requirePermission('audio', 'canCreate')] }, createAudioAlbum);
  fastify.put('/item/:albumId', { onRequest: [requirePermission('audio', 'canEdit')] }, updateAudioAlbum);
  fastify.delete('/item/:albumId', { onRequest: [requirePermission('audio', 'canDelete')] }, deleteAudioAlbum);
  fastify.post('/bulk-delete', { onRequest: [requirePermission('audio', 'canDelete')] }, bulkDeleteAudioAlbums);
};

export default audioAlbumsRoutes;
