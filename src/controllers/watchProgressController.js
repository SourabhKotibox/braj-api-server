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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearAllWatchHistory = exports.deleteWatchHistoryItem = exports.getWatchHistory = exports.clearWatchProgress = exports.getWatchProgressItem = exports.saveWatchProgress = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var UserWatchProgress_1 = require("../models/UserWatchProgress");
var Movie_1 = require("../models/Movie");
var Content_1 = require("../models/Content");
var Episode_1 = require("../models/Episode");
var logger_1 = require("../lib/logger");
var saveWatchProgress = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, body, contentId, episodeId, progressSeconds, durationSeconds, profileId, contentModelType, movieDoc, contentDoc, episodeDoc, filter, percent, existingProgress, progressDoc, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 9, , 10]);
                userId = (_a = request.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    return [2 /*return*/, reply.status(401).send({ success: false, message: 'Unauthorized.' })];
                }
                body = (request.body || {});
                contentId = body.contentId, episodeId = body.episodeId, progressSeconds = body.progressSeconds, durationSeconds = body.durationSeconds;
                profileId = request.headers['x-profile-id'];
                if (!contentId || progressSeconds === undefined || durationSeconds === undefined) {
                    return [2 /*return*/, reply.status(400).send({ success: false, message: 'contentId, progressSeconds, and durationSeconds are required.' })];
                }
                if (!mongoose_1.default.Types.ObjectId.isValid(contentId)) {
                    return [2 /*return*/, reply.status(400).send({ success: false, message: 'Invalid contentId.' })];
                }
                if (episodeId && !mongoose_1.default.Types.ObjectId.isValid(episodeId)) {
                    return [2 /*return*/, reply.status(400).send({ success: false, message: 'Invalid episodeId.' })];
                }
                contentModelType = void 0;
                return [4 /*yield*/, Movie_1.MovieModel.findById(contentId).lean()];
            case 1:
                movieDoc = _b.sent();
                if (!movieDoc) return [3 /*break*/, 2];
                contentModelType = 'Movie';
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, Content_1.ContentModel.findById(contentId).lean()];
            case 3:
                contentDoc = _b.sent();
                if (contentDoc) {
                    contentModelType = 'Content';
                }
                else {
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'Content or Movie not found.' })];
                }
                _b.label = 4;
            case 4:
                if (!episodeId) return [3 /*break*/, 6];
                return [4 /*yield*/, Episode_1.EpisodeModel.findOne({ _id: episodeId, contentId: contentId }).lean()];
            case 5:
                episodeDoc = _b.sent();
                if (!episodeDoc) {
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'Episode not found for this content.' })];
                }
                _b.label = 6;
            case 6:
                filter = {
                    userId: new mongoose_1.default.Types.ObjectId(userId),
                    contentId: new mongoose_1.default.Types.ObjectId(contentId),
                    episodeId: episodeId ? new mongoose_1.default.Types.ObjectId(episodeId) : null,
                    profileId: profileId || null,
                };
                percent = Math.min(100, Math.max(0, Math.round((progressSeconds / durationSeconds) * 100)));
                return [4 /*yield*/, UserWatchProgress_1.UserWatchProgressModel.findOne({
                        userId: new mongoose_1.default.Types.ObjectId(userId),
                        contentId: new mongoose_1.default.Types.ObjectId(contentId),
                        episodeId: episodeId ? new mongoose_1.default.Types.ObjectId(episodeId) : null,
                        profileId: profileId || null
                    })];
            case 7:
                existingProgress = _b.sent();
                return [4 /*yield*/, UserWatchProgress_1.UserWatchProgressModel.findOneAndUpdate(filter, {
                        contentModelType: contentModelType,
                        progressSeconds: progressSeconds,
                        durationSeconds: durationSeconds,
                        progressPercent: percent,
                        lastWatchedAt: new Date(),
                    }, { returnDocument: 'after', upsert: true })];
            case 8:
                progressDoc = _b.sent();
                return [2 /*return*/, reply.send({
                        success: true,
                        data: progressDoc,
                    })];
            case 9:
                error_1 = _b.sent();
                logger_1.logger.error({ error: error_1 }, 'Error saving watch progress');
                return [2 /*return*/, reply.status(500).send({
                        success: false,
                        message: 'Failed to save watch progress.',
                        error: error_1.message,
                    })];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.saveWatchProgress = saveWatchProgress;
var getWatchProgressItem = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, contentId, episodeId, profileId, filter, doc, error_2;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                userId = (_b = request.user) === null || _b === void 0 ? void 0 : _b.id;
                if (!userId) {
                    return [2 /*return*/, reply.status(401).send({ success: false, message: 'Unauthorized.' })];
                }
                _a = request.query, contentId = _a.contentId, episodeId = _a.episodeId, profileId = _a.profileId;
                if (!contentId || !mongoose_1.default.Types.ObjectId.isValid(contentId)) {
                    return [2 /*return*/, reply.status(400).send({ success: false, message: 'Valid contentId is required.' })];
                }
                filter = {
                    userId: new mongoose_1.default.Types.ObjectId(userId),
                    contentId: new mongoose_1.default.Types.ObjectId(contentId),
                    episodeId: episodeId && mongoose_1.default.Types.ObjectId.isValid(episodeId) ? new mongoose_1.default.Types.ObjectId(episodeId) : null,
                    profileId: profileId || null,
                };
                return [4 /*yield*/, UserWatchProgress_1.UserWatchProgressModel.findOne(filter).lean()];
            case 1:
                doc = _c.sent();
                return [2 /*return*/, reply.send({
                        success: true,
                        data: doc ? {
                            progressSeconds: doc.progressSeconds,
                            durationSeconds: doc.durationSeconds,
                            progressPercent: doc.progressPercent,
                        } : null,
                    })];
            case 2:
                error_2 = _c.sent();
                logger_1.logger.error({ error: error_2 }, 'Error fetching watch progress item');
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Failed to fetch watch progress.', error: error_2.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getWatchProgressItem = getWatchProgressItem;
var clearWatchProgress = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, contentId, query, filter, deleteResult, error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                userId = (_a = request.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    return [2 /*return*/, reply.status(401).send({ success: false, message: 'Unauthorized.' })];
                }
                contentId = request.params.contentId;
                query = request.query;
                if (!mongoose_1.default.Types.ObjectId.isValid(contentId)) {
                    return [2 /*return*/, reply.status(400).send({ success: false, message: 'Invalid contentId.' })];
                }
                filter = {
                    userId: new mongoose_1.default.Types.ObjectId(userId),
                    contentId: new mongoose_1.default.Types.ObjectId(contentId),
                };
                if (query.episodeId) {
                    if (!mongoose_1.default.Types.ObjectId.isValid(query.episodeId)) {
                        return [2 /*return*/, reply.status(400).send({ success: false, message: 'Invalid episodeId.' })];
                    }
                    filter.episodeId = new mongoose_1.default.Types.ObjectId(query.episodeId);
                }
                return [4 /*yield*/, UserWatchProgress_1.UserWatchProgressModel.deleteMany(filter)];
            case 1:
                deleteResult = _b.sent();
                return [2 /*return*/, reply.send({
                        success: true,
                        message: 'Watch progress cleared successfully.',
                        deletedCount: deleteResult.deletedCount,
                    })];
            case 2:
                error_3 = _b.sent();
                logger_1.logger.error({ error: error_3 }, 'Error clearing watch progress');
                return [2 /*return*/, reply.status(500).send({
                        success: false,
                        message: 'Failed to clear watch progress.',
                        error: error_3.message,
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.clearWatchProgress = clearWatchProgress;
var getWatchHistory = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, _b, page, _c, limit, profileId, skip, query, history_1, total, items, seen_1, deduped, error_4;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 3, , 4]);
                userId = (_d = request.user) === null || _d === void 0 ? void 0 : _d.id;
                if (!userId) {
                    return [2 /*return*/, reply.status(401).send({ success: false, message: 'Unauthorized.' })];
                }
                _a = request.query, _b = _a.page, page = _b === void 0 ? '1' : _b, _c = _a.limit, limit = _c === void 0 ? '20' : _c, profileId = _a.profileId;
                skip = (Number(page) - 1) * Number(limit);
                query = { userId: new mongoose_1.default.Types.ObjectId(userId) };
                if (profileId) {
                    query.profileId = profileId;
                }
                else {
                    query.profileId = null;
                }
                return [4 /*yield*/, UserWatchProgress_1.UserWatchProgressModel.find(query)
                        .sort({ lastWatchedAt: -1 })
                        .skip(skip)
                        .limit(Number(limit))
                        .populate('contentId', 'title thumbnail posterImage type badge duration planRequired status hlsUrl videoUrl') // for movies/shows
                        .populate('episodeId', 'title thumbnail episode season duration isFree hlsUrl sourceVideoUrl processingStatus')
                        .lean()];
            case 1:
                history_1 = _e.sent();
                return [4 /*yield*/, UserWatchProgress_1.UserWatchProgressModel.countDocuments(query)];
            case 2:
                total = _e.sent();
                items = history_1.map(function (h) {
                    var _a, _b, _c, _d, _e, _f, _g;
                    // Avoid breaking if content was deleted
                    if (!h.contentId)
                        return null;
                    // Determine planRequired
                    var planRequired = 'free';
                    if (h.episodeId) {
                        planRequired = h.episodeId.isFree ? 'free' : 'premium';
                    }
                    else if (h.contentId.planRequired) {
                        planRequired = h.contentId.planRequired;
                    }
                    // Determine isAvailable & status
                    var status = h.contentId.status || 'draft';
                    var isAvailable = status === 'published';
                    if (h.episodeId && h.episodeId.processingStatus !== 'ready') {
                        isAvailable = false;
                    }
                    // Determine hlsUrl / videoUrl
                    var hlsUrl = h.episodeId
                        ? (h.episodeId.hlsUrl || h.episodeId.sourceVideoUrl || '')
                        : (h.contentId.hlsUrl || h.contentId.videoUrl || '');
                    // Determine type
                    var type = 'movie';
                    if (h.contentModelType === 'Content') {
                        type = h.contentId.contentType || (h.contentId.type === 'series' ? 'series' : 'drama');
                    }
                    return {
                        id: h._id.toString(),
                        contentId: (_b = (_a = h.contentId) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString(),
                        episodeId: ((_d = (_c = h.episodeId) === null || _c === void 0 ? void 0 : _c._id) === null || _d === void 0 ? void 0 : _d.toString()) || null,
                        contentType: h.contentModelType.toLowerCase(),
                        type: type,
                        title: h.episodeId ? h.episodeId.title : h.contentId.title,
                        showTitle: h.episodeId ? h.contentId.title : null,
                        thumbnail: ((_e = h.episodeId) === null || _e === void 0 ? void 0 : _e.thumbnail) || h.contentId.thumbnail || h.contentId.posterImage,
                        season: ((_f = h.episodeId) === null || _f === void 0 ? void 0 : _f.season) || null,
                        episode: ((_g = h.episodeId) === null || _g === void 0 ? void 0 : _g.episode) || null,
                        progressPercent: h.progressPercent,
                        progressSeconds: h.progressSeconds,
                        durationSeconds: h.durationSeconds,
                        lastWatchedAt: h.lastWatchedAt,
                        badge: h.contentId.badge || null,
                        planRequired: planRequired,
                        isAvailable: isAvailable,
                        status: status,
                        hlsUrl: hlsUrl,
                    };
                }).filter(Boolean);
                seen_1 = new Set();
                deduped = items.filter(function (item) {
                    var key = item.contentId;
                    if (seen_1.has(key))
                        return false;
                    seen_1.add(key);
                    return true;
                });
                return [2 /*return*/, reply.send({
                        success: true,
                        data: {
                            items: deduped,
                            pagination: {
                                page: Number(page),
                                limit: Number(limit),
                                total: total,
                                pages: Math.ceil(total / Number(limit))
                            }
                        }
                    })];
            case 3:
                error_4 = _e.sent();
                logger_1.logger.error({ error: error_4 }, 'Error fetching watch history');
                return [2 /*return*/, reply.status(500).send({
                        success: false,
                        message: 'Failed to fetch watch history.',
                        error: error_4.message,
                    })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getWatchHistory = getWatchHistory;
var deleteWatchHistoryItem = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, id, targetId, deleteResult, error_5;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                userId = (_a = request.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    return [2 /*return*/, reply.status(401).send({ success: false, message: 'Unauthorized.' })];
                }
                id = request.params.id;
                if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                    return [2 /*return*/, reply.status(400).send({ success: false, message: 'Invalid ID format.' })];
                }
                targetId = new mongoose_1.default.Types.ObjectId(id);
                return [4 /*yield*/, UserWatchProgress_1.UserWatchProgressModel.deleteOne({
                        _id: targetId,
                        userId: new mongoose_1.default.Types.ObjectId(userId)
                    })];
            case 1:
                deleteResult = _b.sent();
                if (!(deleteResult.deletedCount === 0)) return [3 /*break*/, 3];
                return [4 /*yield*/, UserWatchProgress_1.UserWatchProgressModel.deleteOne({
                        contentId: targetId,
                        userId: new mongoose_1.default.Types.ObjectId(userId)
                    })];
            case 2:
                deleteResult = _b.sent();
                _b.label = 3;
            case 3:
                if (deleteResult.deletedCount === 0) {
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'Watch history item not found or unauthorized.' })];
                }
                return [2 /*return*/, reply.send({
                        success: true,
                        message: 'Watch history item deleted successfully.'
                    })];
            case 4:
                error_5 = _b.sent();
                logger_1.logger.error({ error: error_5 }, 'Error deleting watch history item');
                return [2 /*return*/, reply.status(500).send({
                        success: false,
                        message: 'Failed to delete watch history item.',
                        error: error_5.message,
                    })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.deleteWatchHistoryItem = deleteWatchHistoryItem;
var clearAllWatchHistory = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, deleteResult, error_6;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                userId = (_a = request.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    return [2 /*return*/, reply.status(401).send({ success: false, message: 'Unauthorized.' })];
                }
                return [4 /*yield*/, UserWatchProgress_1.UserWatchProgressModel.deleteMany({
                        userId: new mongoose_1.default.Types.ObjectId(userId)
                    })];
            case 1:
                deleteResult = _b.sent();
                return [2 /*return*/, reply.send({
                        success: true,
                        message: 'All watch history cleared successfully.',
                        deletedCount: deleteResult.deletedCount
                    })];
            case 2:
                error_6 = _b.sent();
                logger_1.logger.error({ error: error_6 }, 'Error clearing all watch history');
                return [2 /*return*/, reply.status(500).send({
                        success: false,
                        message: 'Failed to clear all watch history.',
                        error: error_6.message,
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.clearAllWatchHistory = clearAllWatchHistory;
