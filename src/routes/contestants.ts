import type { FastifyPluginAsync } from 'fastify';
import {
  getAllContestants,
  getContestantById,
  createContestant,
  updateContestant,
  deleteContestant,
} from '../controllers/contestantController';
import { requirePermission } from '../middlewares/rbac';

const contestantRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', { onRequest: [requirePermission('contests', 'canView')] }, getAllContestants);
  fastify.post('/', { onRequest: [requirePermission('contests', 'canCreate')] }, createContestant);
  fastify.get('/:id', { onRequest: [requirePermission('contests', 'canView')] }, getContestantById);
  fastify.put('/:id', { onRequest: [requirePermission('contests', 'canEdit')] }, updateContestant);
  fastify.delete('/:id', { onRequest: [requirePermission('contests', 'canDelete')] }, deleteContestant);
};

export default contestantRoutes;
