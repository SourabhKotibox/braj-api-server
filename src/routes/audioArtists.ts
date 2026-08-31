import { requirePermission } from '../middlewares/rbac';
import type { FastifyPluginAsync } from 'fastify';
import {
  listAudioArtists,
  getAudioArtistById,
  createAudioArtist,
  updateAudioArtist,
  deleteAudioArtist,
  bulkDeleteAudioArtists,
} from '../controllers/audioArtistController';

const audioArtistsRoutes: FastifyPluginAsync = async (fastify, opts) => {
  fastify.get('/', { onRequest: [requirePermission('audio', 'canView')] }, listAudioArtists);
  fastify.get('/item/:artistId', { onRequest: [requirePermission('audio', 'canView')] }, getAudioArtistById);
  fastify.post('/', { onRequest: [requirePermission('audio', 'canCreate')] }, createAudioArtist);
  fastify.put('/item/:artistId', { onRequest: [requirePermission('audio', 'canEdit')] }, updateAudioArtist);
  fastify.delete('/item/:artistId', { onRequest: [requirePermission('audio', 'canDelete')] }, deleteAudioArtist);
  fastify.post('/bulk-delete', { onRequest: [requirePermission('audio', 'canDelete')] }, bulkDeleteAudioArtists);
};

export default audioArtistsRoutes;
