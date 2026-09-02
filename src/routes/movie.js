"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var movieController_1 = require("../controllers/movieController");
var rbac_1 = require("../middlewares/rbac");
var movie = function (fastify) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        // Get all movies with pagination and filtering
        fastify.get('/', { onRequest: [(0, rbac_1.requirePermission)('movies', 'canView')] }, movieController_1.getAllMovies);
        // Get pending approvals (MUST be registered before /:id)
        fastify.get('/pending-approvals', { onRequest: [(0, rbac_1.requirePermission)('movies', 'canView')] }, movieController_1.getPendingApprovals);
        // Create new movie
        fastify.post('/', { onRequest: [(0, rbac_1.requirePermission)('movies', 'canCreate')] }, movieController_1.createMovie);
        // Approve movie
        fastify.post('/item/:id/approve', { onRequest: [(0, rbac_1.requirePermission)('movies', 'canEdit')] }, movieController_1.approveMovie);
        // Reject movie
        fastify.post('/item/:id/reject', { onRequest: [(0, rbac_1.requirePermission)('movies', 'canEdit')] }, movieController_1.rejectMovie);
        // Get single movie by ID
        fastify.get('/:id', { onRequest: [(0, rbac_1.requirePermission)('movies', 'canView')] }, movieController_1.getMovieById);
        // Update movie by ID
        fastify.put('/:id', { onRequest: [(0, rbac_1.requirePermission)('movies', 'canEdit')] }, movieController_1.updateMovie);
        // Delete movie by ID
        fastify.delete('/:id', { onRequest: [(0, rbac_1.requirePermission)('movies', 'canDelete')] }, movieController_1.deleteMovie);
        // Update movie status
        fastify.patch('/:id/status', { onRequest: [(0, rbac_1.requirePermission)('movies', 'canEdit')] }, movieController_1.updateMovieStatus);
        // Toggle featured status
        fastify.patch('/:id/featured', { onRequest: [(0, rbac_1.requirePermission)('movies', 'canEdit')] }, movieController_1.toggleFeatured);
        // Toggle trending status
        fastify.patch('/:id/trending', { onRequest: [(0, rbac_1.requirePermission)('movies', 'canEdit')] }, movieController_1.toggleTrending);
        // Poll HLS processing status — used by admin panel progress indicator
        fastify.get('/:id/processing-status', movieController_1.getMovieProcessingStatus);
        return [2 /*return*/];
    });
}); };
exports.default = movie;
