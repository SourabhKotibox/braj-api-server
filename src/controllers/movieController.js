"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.getMovieProcessingStatus = exports.toggleTrending = exports.toggleFeatured = exports.updateMovieStatus = exports.deleteMovie = exports.getPendingApprovals = exports.rejectMovie = exports.approveMovie = exports.updateMovie = exports.createMovie = exports.getMovieById = exports.getAllMovies = void 0;
var Movie_1 = require("../models/Movie");
var Section_1 = require("../models/Section");
var logger_1 = require("../lib/logger");
var email_1 = require("../lib/email");
var syncSections = function (contentIdStr, sections) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Section_1.SectionModel.updateMany({ manualContentIds: contentIdStr }, { $pull: { manualContentIds: contentIdStr } })];
            case 1:
                _a.sent();
                if (!(sections && Array.isArray(sections) && sections.length > 0)) return [3 /*break*/, 3];
                return [4 /*yield*/, Section_1.SectionModel.updateMany({ _id: { $in: sections } }, { $addToSet: { manualContentIds: contentIdStr } })];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
// Get all movies with pagination and filtering
var getAllMovies = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var query, page, limit, skip, filter, _a, movies, total, moviesWithId, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                query = request.query;
                page = Math.max(1, Number(query.page || 1));
                limit = Math.min(100, Math.max(1, Number(query.limit || 20)));
                skip = (page - 1) * limit;
                filter = {};
                if (query.status)
                    filter.status = query.status;
                if (query.featured === 'true')
                    filter.featured = true;
                if (query.trending === 'true')
                    filter.trending = true;
                if (query.year)
                    filter.year = Number(query.year);
                if (query.genre)
                    filter.genres = query.genre;
                if (query.category)
                    filter.categories = query.category;
                if (query.language)
                    filter.languages = query.language;
                if (query.search) {
                    filter.$or = [
                        { title: new RegExp(query.search, 'i') },
                        { description: new RegExp(query.search, 'i') },
                        { tags: new RegExp(query.search, 'i') },
                    ];
                }
                return [4 /*yield*/, Promise.all([
                        Movie_1.MovieModel.find(filter)
                            .populate('genres', 'name image')
                            .populate('categories', 'name thumbnail')
                            .populate('languages', 'name')
                            .populate('subtitleLanguages', 'name')
                            .populate('audioLanguages', 'name')
                            .populate('cast.actor', 'name image')
                            .populate('crew.director', 'name')
                            .populate('subtitles.language', 'name code')
                            .sort({ createdAt: -1 })
                            .skip(skip)
                            .limit(limit)
                            .lean(),
                        Movie_1.MovieModel.countDocuments(filter),
                    ])];
            case 1:
                _a = _b.sent(), movies = _a[0], total = _a[1];
                moviesWithId = movies.map(function (movie) {
                    var _a;
                    return (__assign(__assign({}, movie), { id: (_a = movie._id) === null || _a === void 0 ? void 0 : _a.toString() }));
                });
                return [2 /*return*/, reply.send({
                        success: true,
                        data: moviesWithId,
                        pagination: {
                            page: page,
                            limit: limit,
                            total: total,
                            pages: Math.ceil(total / limit),
                        },
                    })];
            case 2:
                error_1 = _b.sent();
                logger_1.logger.error({ error: error_1 }, 'Error getting all movies');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_1.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllMovies = getAllMovies;
// Get single movie by ID
var getMovieById = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, autoDetectAndSyncQualities, syncErr_1, movie, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                id = request.params.id;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../services/videoProcessor')); })];
            case 2:
                autoDetectAndSyncQualities = (_b.sent()).autoDetectAndSyncQualities;
                return [4 /*yield*/, autoDetectAndSyncQualities(id, 'movie')];
            case 3:
                _b.sent();
                return [3 /*break*/, 5];
            case 4:
                syncErr_1 = _b.sent();
                logger_1.logger.warn({ syncErr: syncErr_1, id: id }, 'Failed to auto-detect and sync qualities for movie');
                return [3 /*break*/, 5];
            case 5: return [4 /*yield*/, Movie_1.MovieModel.findById(id)
                    .populate('genres', 'name image')
                    .populate('categories', 'name thumbnail bannerImage')
                    .populate('languages', 'name')
                    .populate('subtitleLanguages', 'name')
                    .populate('audioLanguages', 'name')
                    .populate('cast.actor', 'name image designation')
                    .populate('crew.director', 'name designation')
                    .populate('subtitles.language', 'name code')
                    .lean()];
            case 6:
                movie = _b.sent();
                if (!movie) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Movie not found' })];
                }
                return [2 /*return*/, reply.send({
                        success: true,
                        data: __assign(__assign({}, movie), { id: (_a = movie._id) === null || _a === void 0 ? void 0 : _a.toString() }),
                    })];
            case 7:
                error_2 = _b.sent();
                logger_1.logger.error({ error: error_2 }, 'Error getting movie by ID');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_2.message })];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.getMovieById = getMovieById;
// Create new movie
var createMovie = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var body_1, isLocalPath, isRawLocalVideo, movie_1, NotificationModel, notifErr_1, error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 8, , 9]);
                body_1 = request.body;
                isLocalPath = body_1.hlsUrl && !body_1.hlsUrl.startsWith('http://') && !body_1.hlsUrl.startsWith('https://');
                isRawLocalVideo = isLocalPath && !body_1.hlsUrl.endsWith('.m3u8');
                if (isRawLocalVideo) {
                    body_1.processingStatus = 'queued';
                }
                else {
                    body_1.processingStatus = 'ready';
                }
                return [4 /*yield*/, Movie_1.MovieModel.create(body_1)];
            case 1:
                movie_1 = _b.sent();
                return [4 /*yield*/, syncSections(movie_1._id.toString(), body_1.sections)];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                _b.trys.push([3, 6, , 7]);
                return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../models/Notification')); })];
            case 4:
                NotificationModel = (_b.sent()).NotificationModel;
                return [4 /*yield*/, NotificationModel.create({
                        title: 'New Movie Added! 🍿',
                        body: "Watch ".concat(movie_1.title, " now on the app!"),
                        type: 'content_release',
                        targetAudience: 'all',
                        contentId: movie_1._id,
                        status: 'sent',
                        metrics: { targetCount: 0, sentCount: 1, openedCount: 0, clickedCount: 0 },
                        sentAt: new Date(),
                        priority: 'high'
                    })];
            case 5:
                _b.sent();
                return [3 /*break*/, 7];
            case 6:
                notifErr_1 = _b.sent();
                logger_1.logger.error({ notifErr: notifErr_1 }, 'Error sending new movie notification');
                return [3 /*break*/, 7];
            case 7:
                if (isRawLocalVideo) {
                    Promise.resolve().then(function () { return __importStar(require('../services/videoProcessor')); }).then(function (_a) {
                        var processMovieInBackground = _a.processMovieInBackground;
                        processMovieInBackground(movie_1._id, body_1.hlsUrl);
                    });
                }
                return [2 /*return*/, reply.status(201).send({
                        success: true,
                        data: __assign(__assign({}, movie_1.toObject()), { id: (_a = movie_1._id) === null || _a === void 0 ? void 0 : _a.toString() }),
                    })];
            case 8:
                error_3 = _b.sent();
                logger_1.logger.error({ error: error_3 }, 'Error creating movie');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_3.message })];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.createMovie = createMovie;
// Update movie
var updateMovie = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, body_2, existingMovie, isLocalPath, isRawLocalVideo, movie_2, autoDetectAndSyncQualities, syncErr_2, updatedMovie, error_4;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 11, , 12]);
                id = request.params.id;
                body_2 = request.body;
                return [4 /*yield*/, Movie_1.MovieModel.findById(id).lean()];
            case 1:
                existingMovie = _b.sent();
                if (!existingMovie) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Movie not found' })];
                }
                isLocalPath = body_2.hlsUrl && !body_2.hlsUrl.startsWith('http://') && !body_2.hlsUrl.startsWith('https://');
                isRawLocalVideo = isLocalPath && !body_2.hlsUrl.endsWith('.m3u8') && body_2.hlsUrl !== existingMovie.hlsUrl;
                if (isRawLocalVideo) {
                    body_2.processingStatus = 'queued';
                }
                else if (body_2.hlsUrl) {
                    body_2.processingStatus = 'ready';
                }
                return [4 /*yield*/, Movie_1.MovieModel.findByIdAndUpdate(id, { $set: body_2 }, { returnDocument: 'after', runValidators: true })];
            case 2:
                movie_2 = _b.sent();
                if (!movie_2) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Movie not found' })];
                }
                if (!(body_2.sections !== undefined)) return [3 /*break*/, 4];
                return [4 /*yield*/, syncSections(id, body_2.sections)];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4:
                if (isRawLocalVideo) {
                    Promise.resolve().then(function () { return __importStar(require('../services/videoProcessor')); }).then(function (_a) {
                        var processMovieInBackground = _a.processMovieInBackground;
                        processMovieInBackground(movie_2._id, body_2.hlsUrl);
                    });
                }
                _b.label = 5;
            case 5:
                _b.trys.push([5, 8, , 9]);
                return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../services/videoProcessor')); })];
            case 6:
                autoDetectAndSyncQualities = (_b.sent()).autoDetectAndSyncQualities;
                return [4 /*yield*/, autoDetectAndSyncQualities(id, 'movie')];
            case 7:
                _b.sent();
                return [3 /*break*/, 9];
            case 8:
                syncErr_2 = _b.sent();
                logger_1.logger.warn({ syncErr: syncErr_2, id: id }, 'Failed to auto-detect and sync qualities during movie update');
                return [3 /*break*/, 9];
            case 9: return [4 /*yield*/, Movie_1.MovieModel.findById(id)
                    .populate('genres', 'name image')
                    .populate('categories', 'name thumbnail')
                    .populate('languages', 'name')
                    .populate('subtitleLanguages', 'name')
                    .populate('audioLanguages', 'name')
                    .populate('cast.actor', 'name image')
                    .populate('crew.director', 'name')
                    .populate('subtitles.language', 'name code')
                    .lean()];
            case 10:
                updatedMovie = _b.sent();
                return [2 /*return*/, reply.send({
                        success: true,
                        data: __assign(__assign({}, updatedMovie), { id: (_a = updatedMovie === null || updatedMovie === void 0 ? void 0 : updatedMovie._id) === null || _a === void 0 ? void 0 : _a.toString() }),
                    })];
            case 11:
                error_4 = _b.sent();
                logger_1.logger.error({ error: error_4 }, 'Error updating movie');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_4.message })];
            case 12: return [2 /*return*/];
        }
    });
}); };
exports.updateMovie = updateMovie;
// Approve movie
var approveMovie = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, currentUser, movie, creator, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                id = request.params.id;
                currentUser = request.user;
                return [4 /*yield*/, Movie_1.MovieModel.findByIdAndUpdate(id, {
                        status: 'published',
                        approvedBy: currentUser === null || currentUser === void 0 ? void 0 : currentUser.id,
                        approvedAt: new Date(),
                        rejectionReason: undefined,
                    }, { returnDocument: 'after' }).populate('createdBy', 'name email')];
            case 1:
                movie = _a.sent();
                if (!movie) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Movie not found' })];
                }
                if (!movie.createdBy) return [3 /*break*/, 3];
                creator = movie.createdBy;
                if (!creator.email) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, email_1.sendApprovalEmail)(creator.email, creator.name || 'User', 'Movie', movie.title)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/, reply.send({ success: true, data: movie })];
            case 4:
                error_5 = _a.sent();
                logger_1.logger.error({ error: error_5 }, 'Error approving movie');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_5.message })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.approveMovie = approveMovie;
// Reject movie
var rejectMovie = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, reason, currentUser, movie, creator, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                id = request.params.id;
                reason = request.body.reason;
                currentUser = request.user;
                return [4 /*yield*/, Movie_1.MovieModel.findByIdAndUpdate(id, {
                        status: 'rejected',
                        rejectedBy: currentUser === null || currentUser === void 0 ? void 0 : currentUser.id,
                        rejectedAt: new Date(),
                        rejectionReason: reason,
                    }, { returnDocument: 'after' }).populate('createdBy', 'name email')];
            case 1:
                movie = _a.sent();
                if (!movie) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Movie not found' })];
                }
                if (!movie.createdBy) return [3 /*break*/, 3];
                creator = movie.createdBy;
                if (!creator.email) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, email_1.sendRejectionEmail)(creator.email, creator.name || 'User', 'Movie', movie.title, reason || 'No reason provided')];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/, reply.send({ success: true, data: movie })];
            case 4:
                error_6 = _a.sent();
                logger_1.logger.error({ error: error_6 }, 'Error rejecting movie');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_6.message })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.rejectMovie = rejectMovie;
// Get pending approvals
var getPendingApprovals = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var query, page, limit, skip, filter, _a, movies, total, error_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                query = request.query;
                page = Math.max(1, Number(query.page || 1));
                limit = Math.min(100, Math.max(1, Number(query.limit || 20)));
                skip = (page - 1) * limit;
                filter = { status: 'moderation' };
                return [4 /*yield*/, Promise.all([
                        Movie_1.MovieModel.find(filter)
                            .populate('createdBy', 'name email')
                            .sort({ createdAt: -1 })
                            .skip(skip)
                            .limit(limit)
                            .lean(),
                        Movie_1.MovieModel.countDocuments(filter),
                    ])];
            case 1:
                _a = _b.sent(), movies = _a[0], total = _a[1];
                return [2 /*return*/, reply.send({
                        success: true,
                        data: movies,
                        pagination: { page: page, limit: limit, total: total, pages: Math.ceil(total / limit) },
                    })];
            case 2:
                error_7 = _b.sent();
                logger_1.logger.error({ error: error_7 }, 'Error getting pending approvals');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_7.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getPendingApprovals = getPendingApprovals;
// Get movie by ID
var deleteMovie = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, movie, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id = request.params.id;
                return [4 /*yield*/, Movie_1.MovieModel.findByIdAndDelete(id)];
            case 1:
                movie = _a.sent();
                if (!movie) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Movie not found' })];
                }
                return [4 /*yield*/, syncSections(id, [])];
            case 2:
                _a.sent();
                return [2 /*return*/, reply.send({ success: true, message: 'Movie deleted successfully' })];
            case 3:
                error_8 = _a.sent();
                logger_1.logger.error({ error: error_8 }, 'Error deleting movie');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_8.message })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteMovie = deleteMovie;
// Update movie status
var updateMovieStatus = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, status_1, rejectionReason, updateData, movie, error_9;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                id = request.params.id;
                _a = request.body, status_1 = _a.status, rejectionReason = _a.rejectionReason;
                updateData = { status: status_1 };
                if (rejectionReason && status_1 === 'rejected') {
                    updateData.rejectionReason = rejectionReason;
                }
                return [4 /*yield*/, Movie_1.MovieModel.findByIdAndUpdate(id, { $set: updateData }, { returnDocument: 'after', runValidators: true }).lean()];
            case 1:
                movie = _c.sent();
                if (!movie) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Movie not found' })];
                }
                return [2 /*return*/, reply.send({
                        success: true,
                        data: __assign(__assign({}, movie), { id: (_b = movie._id) === null || _b === void 0 ? void 0 : _b.toString() }),
                    })];
            case 2:
                error_9 = _c.sent();
                logger_1.logger.error({ error: error_9 }, 'Error updating movie status');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_9.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateMovieStatus = updateMovieStatus;
// Toggle featured status
var toggleFeatured = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, movie, updatedMovie, error_10;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                id = request.params.id;
                return [4 /*yield*/, Movie_1.MovieModel.findById(id).lean()];
            case 1:
                movie = _b.sent();
                if (!movie) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Movie not found' })];
                }
                return [4 /*yield*/, Movie_1.MovieModel.findByIdAndUpdate(id, { $set: { featured: !movie.featured } }, { returnDocument: 'after' }).lean()];
            case 2:
                updatedMovie = _b.sent();
                return [2 /*return*/, reply.send({
                        success: true,
                        data: __assign(__assign({}, updatedMovie), { id: (_a = updatedMovie._id) === null || _a === void 0 ? void 0 : _a.toString() }),
                    })];
            case 3:
                error_10 = _b.sent();
                logger_1.logger.error({ error: error_10 }, 'Error toggling featured status');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_10.message })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.toggleFeatured = toggleFeatured;
// Toggle trending status
var toggleTrending = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, movie, updatedMovie, error_11;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                id = request.params.id;
                return [4 /*yield*/, Movie_1.MovieModel.findById(id).lean()];
            case 1:
                movie = _b.sent();
                if (!movie) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Movie not found' })];
                }
                return [4 /*yield*/, Movie_1.MovieModel.findByIdAndUpdate(id, { $set: { trending: !movie.trending } }, { returnDocument: 'after' }).lean()];
            case 2:
                updatedMovie = _b.sent();
                return [2 /*return*/, reply.send({
                        success: true,
                        data: __assign(__assign({}, updatedMovie), { id: (_a = updatedMovie._id) === null || _a === void 0 ? void 0 : _a.toString() }),
                    })];
            case 3:
                error_11 = _b.sent();
                logger_1.logger.error({ error: error_11 }, 'Error toggling trending status');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_11.message })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.toggleTrending = toggleTrending;
// Get movie HLS processing status — lightweight polling endpoint for admin panel
var getMovieProcessingStatus = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, movie, qualities, error_12;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                id = request.params.id;
                return [4 /*yield*/, Movie_1.MovieModel.findById(id)
                        .select('processingStatus processingError hlsUrl hlsS3Prefix videoQualities status title')
                        .lean()];
            case 1:
                movie = _b.sent();
                if (!movie) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Movie not found' })];
                }
                qualities = (movie.videoQualities || []).map(function (q) { return ({
                    quality: q.quality,
                    url: q.url,
                    size: q.size,
                }); });
                return [2 /*return*/, reply.send({
                        success: true,
                        data: {
                            id: (_a = movie._id) === null || _a === void 0 ? void 0 : _a.toString(),
                            title: movie.title,
                            status: movie.status,
                            processingStatus: movie.processingStatus || 'queued',
                            processingError: movie.processingError || null,
                            hlsUrl: movie.hlsUrl || null,
                            hlsS3Prefix: movie.hlsS3Prefix || null,
                            availableQualities: qualities,
                            qualityCount: qualities.length,
                            isReady: movie.processingStatus === 'ready',
                            isFailed: movie.processingStatus === 'failed',
                        },
                    })];
            case 2:
                error_12 = _b.sent();
                logger_1.logger.error({ error: error_12 }, 'Error getting movie processing status');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_12.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getMovieProcessingStatus = getMovieProcessingStatus;
