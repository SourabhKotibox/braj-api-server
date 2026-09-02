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
exports.getSeasons = exports.toggleEpisodeLock = exports.deleteEpisode = exports.updateEpisode = exports.createEpisode = exports.getEpisodeById = exports.getAllEpisodes = void 0;
var Episode_1 = require("../models/Episode");
var Content_1 = require("../models/Content");
var mongoose_1 = require("mongoose");
var logger_1 = require("../lib/logger");
var getAllEpisodes = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var query, page, limit, skip, filter, contentIds, _a, episodes, total, data, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                query = request.query;
                page = Math.max(1, Number(query.page || 1));
                limit = Math.min(100, Math.max(1, Number(query.limit || 20)));
                skip = (page - 1) * limit;
                filter = {};
                if (!query.contentId) return [3 /*break*/, 1];
                filter.contentId = query.contentId;
                return [3 /*break*/, 3];
            case 1:
                if (!query.contentType) return [3 /*break*/, 3];
                return [4 /*yield*/, Content_1.ContentModel.find({ contentType: query.contentType })
                        .select('_id')
                        .lean()
                        .then(function (contents) { return contents.map(function (c) { return c._id; }); })];
            case 2:
                contentIds = _b.sent();
                filter.contentId = { $in: contentIds };
                _b.label = 3;
            case 3:
                if (query.season)
                    filter.season = Number(query.season);
                if (query.search) {
                    filter.$or = [
                        { title: new RegExp(query.search, 'i') },
                        { description: new RegExp(query.search, 'i') },
                    ];
                }
                return [4 /*yield*/, Promise.all([
                        Episode_1.EpisodeModel.find(filter)
                            .populate('contentId', 'title thumbnail contentType type')
                            .populate('subtitleLanguages', 'name code')
                            .populate('audioLanguages', 'name code')
                            .populate('subtitles.language', 'name code')
                            .sort({ createdAt: -1 })
                            .skip(skip)
                            .limit(limit)
                            .lean(),
                        Episode_1.EpisodeModel.countDocuments(filter),
                    ])];
            case 4:
                _a = _b.sent(), episodes = _a[0], total = _a[1];
                data = episodes.map(function (e) {
                    var _a, _b, _c;
                    return (__assign(__assign({}, e), { id: (_a = e._id) === null || _a === void 0 ? void 0 : _a.toString(), showName: ((_b = e.contentId) === null || _b === void 0 ? void 0 : _b.title) || '', showThumbnail: ((_c = e.contentId) === null || _c === void 0 ? void 0 : _c.thumbnail) || '' }));
                });
                return [2 /*return*/, reply.send({
                        success: true,
                        data: data,
                        pagination: { page: page, limit: limit, total: total, pages: Math.ceil(total / limit) },
                    })];
            case 5:
                error_1 = _b.sent();
                logger_1.logger.error({ error: error_1 }, 'Error getting all episodes');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_1.message })];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.getAllEpisodes = getAllEpisodes;
var getEpisodeById = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, autoDetectAndSyncQualities, syncErr_1, episode, error_2;
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
                return [4 /*yield*/, autoDetectAndSyncQualities(id, 'episode')];
            case 3:
                _b.sent();
                return [3 /*break*/, 5];
            case 4:
                syncErr_1 = _b.sent();
                logger_1.logger.warn({ syncErr: syncErr_1, id: id }, 'Failed to auto-detect and sync qualities for episode');
                return [3 /*break*/, 5];
            case 5: return [4 /*yield*/, Episode_1.EpisodeModel.findById(id)
                    .populate('contentId', 'title thumbnail contentType type')
                    .populate('subtitleLanguages', 'name code')
                    .populate('audioLanguages', 'name code')
                    .populate('subtitles.language', 'name code')
                    .lean()];
            case 6:
                episode = _b.sent();
                if (!episode) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Episode not found' })];
                }
                return [2 /*return*/, reply.send({
                        success: true,
                        data: __assign(__assign({}, episode), { id: (_a = episode._id) === null || _a === void 0 ? void 0 : _a.toString() }),
                    })];
            case 7:
                error_2 = _b.sent();
                logger_1.logger.error({ error: error_2 }, 'Error getting episode by ID');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_2.message })];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.getEpisodeById = getEpisodeById;
var createEpisode = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var body, isLocalPath, isRawLocalVideo, episode_1, error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                body = request.body;
                isLocalPath = body.sourceVideoUrl && !body.sourceVideoUrl.startsWith('http://') && !body.sourceVideoUrl.startsWith('https://');
                isRawLocalVideo = isLocalPath && !body.sourceVideoUrl.endsWith('.m3u8');
                if (isRawLocalVideo) {
                    body.processingStatus = 'queued';
                }
                else {
                    body.processingStatus = 'ready';
                }
                return [4 /*yield*/, Episode_1.EpisodeModel.create(body)];
            case 1:
                episode_1 = _b.sent();
                if (isRawLocalVideo && episode_1.sourceVideoUrl) {
                    Promise.resolve().then(function () { return __importStar(require('../services/videoProcessor')); }).then(function (_a) {
                        var processEpisodesInBackground = _a.processEpisodesInBackground;
                        processEpisodesInBackground([episode_1._id], episode_1.sourceVideoUrl);
                    });
                }
                return [2 /*return*/, reply.status(201).send({
                        success: true,
                        data: __assign(__assign({}, episode_1.toObject()), { id: (_a = episode_1._id) === null || _a === void 0 ? void 0 : _a.toString() }),
                    })];
            case 2:
                error_3 = _b.sent();
                logger_1.logger.error({ error: error_3 }, 'Error creating episode');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_3.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createEpisode = createEpisode;
var updateEpisode = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id_1, body, existingEpisode, isLocalPath, isRawLocalVideo, episode_2, autoDetectAndSyncQualities, syncErr_2, updatedEpisode, error_4;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 9, , 10]);
                id_1 = request.params.id;
                body = request.body;
                return [4 /*yield*/, Episode_1.EpisodeModel.findById(id_1).lean()];
            case 1:
                existingEpisode = _b.sent();
                if (!existingEpisode) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Episode not found' })];
                }
                isLocalPath = body.sourceVideoUrl && !body.sourceVideoUrl.startsWith('http://') && !body.sourceVideoUrl.startsWith('https://');
                isRawLocalVideo = isLocalPath && !body.sourceVideoUrl.endsWith('.m3u8') && body.sourceVideoUrl !== existingEpisode.sourceVideoUrl;
                if (isRawLocalVideo) {
                    body.processingStatus = 'queued';
                }
                else if (body.sourceVideoUrl || body.hlsUrl) {
                    body.processingStatus = 'ready';
                }
                return [4 /*yield*/, Episode_1.EpisodeModel.findByIdAndUpdate(id_1, { $set: body }, { returnDocument: 'after', runValidators: true }).lean()];
            case 2:
                episode_2 = _b.sent();
                if (!episode_2) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Episode not found' })];
                }
                if (isRawLocalVideo && episode_2.sourceVideoUrl) {
                    Promise.resolve().then(function () { return __importStar(require('../services/videoProcessor')); }).then(function (_a) {
                        var processEpisodesInBackground = _a.processEpisodesInBackground;
                        processEpisodesInBackground([new mongoose_1.Types.ObjectId(id_1)], episode_2.sourceVideoUrl);
                    });
                }
                _b.label = 3;
            case 3:
                _b.trys.push([3, 6, , 7]);
                return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../services/videoProcessor')); })];
            case 4:
                autoDetectAndSyncQualities = (_b.sent()).autoDetectAndSyncQualities;
                return [4 /*yield*/, autoDetectAndSyncQualities(id_1, 'episode')];
            case 5:
                _b.sent();
                return [3 /*break*/, 7];
            case 6:
                syncErr_2 = _b.sent();
                logger_1.logger.warn({ syncErr: syncErr_2, id: id_1 }, 'Failed to auto-detect and sync qualities during episode update');
                return [3 /*break*/, 7];
            case 7: return [4 /*yield*/, Episode_1.EpisodeModel.findById(id_1).lean()];
            case 8:
                updatedEpisode = _b.sent();
                return [2 /*return*/, reply.send({
                        success: true,
                        data: __assign(__assign({}, updatedEpisode), { id: (_a = updatedEpisode === null || updatedEpisode === void 0 ? void 0 : updatedEpisode._id) === null || _a === void 0 ? void 0 : _a.toString() }),
                    })];
            case 9:
                error_4 = _b.sent();
                logger_1.logger.error({ error: error_4 }, 'Error updating episode');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_4.message })];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.updateEpisode = updateEpisode;
var deleteEpisode = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, episode, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = request.params.id;
                return [4 /*yield*/, Episode_1.EpisodeModel.findByIdAndDelete(id)];
            case 1:
                episode = _a.sent();
                if (!episode) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Episode not found' })];
                }
                return [2 /*return*/, reply.send({ success: true, message: 'Episode deleted successfully' })];
            case 2:
                error_5 = _a.sent();
                logger_1.logger.error({ error: error_5 }, 'Error deleting episode');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_5.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteEpisode = deleteEpisode;
var toggleEpisodeLock = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, isLocked, episode, error_6;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                id = request.params.id;
                isLocked = request.body.isLocked;
                return [4 /*yield*/, Episode_1.EpisodeModel.findByIdAndUpdate(id, { $set: { isLocked: isLocked } }, { returnDocument: 'after' }).lean()];
            case 1:
                episode = _b.sent();
                if (!episode) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Episode not found' })];
                }
                return [2 /*return*/, reply.send({ success: true, data: __assign(__assign({}, episode), { id: (_a = episode._id) === null || _a === void 0 ? void 0 : _a.toString() }) })];
            case 2:
                error_6 = _b.sent();
                logger_1.logger.error({ error: error_6 }, 'Error toggling episode lock');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_6.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.toggleEpisodeLock = toggleEpisodeLock;
var getSeasons = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var query, matchFilter, contentIds, seasons, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                query = request.query;
                matchFilter = {};
                if (query.contentId) {
                    matchFilter.contentId = new mongoose_1.Types.ObjectId(query.contentId);
                }
                if (!query.contentType) return [3 /*break*/, 2];
                return [4 /*yield*/, Content_1.ContentModel.find({ contentType: query.contentType })
                        .select('_id')
                        .lean()
                        .then(function (contents) { return contents.map(function (c) { return c._id; }); })];
            case 1:
                contentIds = _a.sent();
                matchFilter.contentId = { $in: contentIds };
                _a.label = 2;
            case 2: return [4 /*yield*/, Episode_1.EpisodeModel.aggregate([
                    { $match: matchFilter },
                    {
                        $group: {
                            _id: { contentId: '$contentId', season: '$season' },
                            episodeCount: { $sum: 1 },
                        },
                    },
                    {
                        $lookup: {
                            from: 'contents',
                            localField: '_id.contentId',
                            foreignField: '_id',
                            as: 'content',
                        },
                    },
                    { $unwind: '$content' },
                    {
                        $project: {
                            _id: 0,
                            seasonId: {
                                $concat: [{ $toString: '$_id.contentId' }, '-', { $toString: '$_id.season' }],
                            },
                            contentId: '$_id.contentId',
                            season: '$_id.season',
                            episodeCount: 1,
                            showName: '$content.title',
                            thumbnail: '$content.thumbnail',
                            status: '$content.status',
                        },
                    },
                    { $sort: { showName: 1, season: 1 } },
                ])];
            case 3:
                seasons = _a.sent();
                return [2 /*return*/, reply.send({
                        success: true,
                        data: seasons,
                        total: seasons.length,
                    })];
            case 4:
                error_7 = _a.sent();
                logger_1.logger.error({ error: error_7 }, 'Error getting seasons');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_7.message })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getSeasons = getSeasons;
