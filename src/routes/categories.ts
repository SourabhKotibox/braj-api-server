import { requirePermission } from '../middlewares/rbac';
import type { FastifyPluginAsync } from 'fastify';
import {
  listCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  bulkDeleteCategories,
} from '../controllers/categoryController';

const categories: FastifyPluginAsync = async (fastify) => {
  // Get all categories - PUBLIC (used by web and mobile to filter content)
  fastify.get('/', listCategories);
  // Get single category - PUBLIC
  fastify.get('/item/:categoryId', getCategoryById);
  // Create category
  fastify.post('/', { onRequest: [requirePermission('categories', 'canCreate')] }, createCategory);
  // Update category
  fastify.put('/item/:categoryId', { onRequest: [requirePermission('categories', 'canEdit')] }, updateCategory);
  // Delete category
  fastify.delete('/item/:categoryId', { onRequest: [requirePermission('categories', 'canDelete')] }, deleteCategory);
  // Bulk delete categories
  fastify.post('/bulk-delete', { onRequest: [requirePermission('categories', 'canCreate')] }, bulkDeleteCategories);
};

export default categories;
