import type { FastifyPluginAsync } from 'fastify';
import { requirePermission } from '../middlewares/rbac';
import { getSettings, updateSettings, uploadSettingsLogos, getEmailStatus, testEmail, getStorageStatus } from '../controllers/settingsController';

const settingsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/settings', getSettings);
  fastify.put('/settings', { onRequest: [requirePermission('settings', 'canEdit')] }, updateSettings);
  fastify.post('/settings/upload-logos', { onRequest: [requirePermission('settings', 'canEdit')] }, uploadSettingsLogos);
  fastify.get('/settings/email-status', { onRequest: [requirePermission('settings', 'canView')] }, getEmailStatus);
  fastify.get('/settings/storage-status', { onRequest: [requirePermission('settings', 'canView')] }, getStorageStatus);
  fastify.post('/settings/test-email', { onRequest: [requirePermission('settings', 'canEdit')] }, testEmail);
};

export default settingsRoutes;
