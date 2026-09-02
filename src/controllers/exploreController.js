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
exports.getExplore = void 0;
var Content_1 = require("../models/Content");
var Movie_1 = require("../models/Movie");
var Episode_1 = require("../models/Episode");
var UserLike_1 = require("../models/UserLike");
var User_1 = require("../models/User");
var Language_1 = require("../models/Language");
var logger_1 = require("../lib/logger");
// Base URL for share links (set FRONTEND_URL in .env)
var FRONTEND_URL = (process.env.FRONTEND_URL || 'https://aapki-website.com').replace(/\/$/, '');
// How many extra items to fetch per page to survive deduplication filtering
var FETCH_MULTIPLIER = 4;
// Helper: try to extract userId from JWT (optional auth — no error if missing/invalid)
var getOptionalUserId = function (request) {
    try {
        var authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer '))
            return null;
        var token = authHeader.slice(7);
        var server = request.server;
        var decoded = server.jwt.verify(token);
        return (decoded === null || decoded === void 0 ? void 0 : decoded.id) || null;
    }
    catch (_a) {
        return null;
    }
};
var config_1 = require("../lib/config");
// Helper to convert relative URLs to absolute URLs
var toAbsoluteUrl = function (request, url) {
    if (!url)
        return null;
    if (url.startsWith('http://') || url.startsWith('https://'))
        return url;
    var relPath = url;
    if (!relPath.startsWith('/uploads/')) {
        relPath = relPath.startsWith('uploads/') ? "/".concat(relPath) : "/uploads/".concat(relPath.startsWith('/') ? relPath.slice(1) : relPath);
    }
    var baseUrl = "".concat(request.protocol, "://").concat(request.hostname);
    return "".concat(baseUrl).concat(relPath);
};
// Helper function to map content items for the explore / short-drama reel feed
var mapContentItem = function (request, item, type, episodeCount, firstEpisode, likeCount, isLikedByUser) {
    var _a, _b;
    if (episodeCount === void 0) { episodeCount = 0; }
    if (likeCount === void 0) { likeCount = 0; }
    if (isLikedByUser === void 0) { isLikedByUser = false; }
    return ({
        id: item._id.toString(),
        title: item.title,
        description: item.description,
        shortDescription: item.shortDescription,
        thumbnail: toAbsoluteUrl(request, item.thumbnail),
        bannerImage: toAbsoluteUrl(request, item.bannerImage),
        type: type,
        episodeCount: episodeCount,
        genres: (item.genres || []).map(function (g) { return g.name || g; }),
        genresText: (item.genres || []).map(function (g) { return g.name || g; }).join(' & '),
        languages: (item.languages || []).map(function (l) { return l.name || l; }),
        views: item.views || 0,
        likeCount: likeCount,
        isLikedByUser: isLikedByUser,
        shares: item.shares || 0,
        shareUrl: (0, config_1.buildShareUrl)(item._id.toString()),
        featured: item.featured,
        trending: item.trending,
        isNewContent: item.isNewContent,
        rating: item.rating,
        year: item.year,
        duration: item.duration,
        status: item.status,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        // Preview — ONLY episode 1 (short-drama reel style, no full list)
        videoUrl: toAbsoluteUrl(request, (firstEpisode === null || firstEpisode === void 0 ? void 0 : firstEpisode.hlsUrl) || item.hlsUrl) || null,
        trailerUrl: toAbsoluteUrl(request, (firstEpisode === null || firstEpisode === void 0 ? void 0 : firstEpisode.trailerUrl) || item.trailerUrl) || null,
        firstEpisodeId: ((_a = firstEpisode === null || firstEpisode === void 0 ? void 0 : firstEpisode._id) === null || _a === void 0 ? void 0 : _a.toString()) || null,
        firstEpisodeTitle: (firstEpisode === null || firstEpisode === void 0 ? void 0 : firstEpisode.title) || null,
        firstEpisodeThumbnail: toAbsoluteUrl(request, (firstEpisode === null || firstEpisode === void 0 ? void 0 : firstEpisode.thumbnail) || item.thumbnail) || null,
        firstEpisodeDuration: (firstEpisode === null || firstEpisode === void 0 ? void 0 : firstEpisode.duration) || null,
        firstEpisodeIsFree: (_b = firstEpisode === null || firstEpisode === void 0 ? void 0 : firstEpisode.isFree) !== null && _b !== void 0 ? _b : null,
        contentPlan: item.plan || 'free',
    });
};
// Get explore page data (infinite scroll, short-drama reel style)
var getExplore = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var query, offset, limit, sort, contentType_1, seenIds, userId, sortBy, filter, mongoose_1, seenObjectIds, preferredLanguage, user, targetLanguageId, mongoose, langDoc, fetchLimit, rawContents, langFilter, langFilter, rawContentIds, firstEpisodeMap_1, episodeCountMap_1, firstEpisodes, episodeCounts, seenThumbnails, seenVideoUrls, uniqueContents, _i, rawContents_1, content, cid, firstEpisode, thumbnail, videoUrl, uniqueIds, likedContentIdSet_1, userLikes, items, nextOffset, hasMore, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 17, , 18]);
                query = request.query;
                offset = Math.max(0, Number(query.offset || 0));
                limit = Math.min(10, Math.max(1, Number(query.limit || 5)));
                sort = query.sort || 'new';
                contentType_1 = query.contentType || 'drama';
                seenIds = query.seenIds
                    ? query.seenIds.split(',').map(function (id) { return id.trim(); }).filter(Boolean)
                    : [];
                userId = getOptionalUserId(request);
                sortBy = {};
                filter = { status: 'published' };
                if (contentType_1 === 'drama') {
                    filter.contentType = 'drama';
                    // Ensure only new, trending, and featured (hot) short dramas are shown
                    filter.$or = [
                        { isNewContent: true },
                        { trending: true },
                        { featured: true }
                    ];
                }
                if (!(seenIds.length > 0)) return [3 /*break*/, 2];
                return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('mongoose')); })];
            case 1:
                mongoose_1 = _a.sent();
                seenObjectIds = seenIds
                    .filter(function (id) { return mongoose_1.default.Types.ObjectId.isValid(id); })
                    .map(function (id) { return new mongoose_1.default.Types.ObjectId(id); });
                if (seenObjectIds.length > 0) {
                    filter._id = { $nin: seenObjectIds };
                }
                _a.label = 2;
            case 2:
                switch (sort) {
                    case 'new':
                        sortBy = { createdAt: -1 };
                        break;
                    case 'trending':
                        sortBy = { trending: -1, views: -1 };
                        break;
                    case 'views':
                        sortBy = { views: -1 };
                        break;
                    case 'featured':
                        sortBy = { featured: -1, views: -1 };
                        filter = __assign(__assign({}, filter), { featured: true });
                        break;
                    default: sortBy = { createdAt: -1 };
                }
                preferredLanguage = 'Hindi';
                if (!userId) return [3 /*break*/, 4];
                return [4 /*yield*/, User_1.UserModel.findById(userId).select('preferredLanguage languageSelectionSkipped').lean()];
            case 3:
                user = _a.sent();
                if (user) {
                    if (user.preferredLanguage) {
                        preferredLanguage = user.preferredLanguage;
                    }
                    else if (user.languageSelectionSkipped) {
                        preferredLanguage = 'Hindi';
                    }
                }
                _a.label = 4;
            case 4:
                targetLanguageId = null;
                if (!preferredLanguage) return [3 /*break*/, 7];
                return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('mongoose')); })];
            case 5:
                mongoose = _a.sent();
                return [4 /*yield*/, Language_1.LanguageModel.findOne({ name: new RegExp("^".concat(preferredLanguage, "$"), 'i') }).lean()];
            case 6:
                langDoc = _a.sent();
                if (langDoc) {
                    targetLanguageId = langDoc._id;
                }
                _a.label = 7;
            case 7:
                fetchLimit = limit * FETCH_MULTIPLIER;
                rawContents = [];
                if (!(contentType_1 === 'movie')) return [3 /*break*/, 9];
                langFilter = __assign({}, filter);
                if (targetLanguageId) {
                    langFilter.languages = targetLanguageId;
                }
                return [4 /*yield*/, Movie_1.MovieModel.find(langFilter)
                        .sort(sortBy)
                        .skip(offset)
                        .limit(fetchLimit)
                        .populate('languages', 'name')
                        .populate('genres', 'name')
                        .lean()];
            case 8:
                rawContents = _a.sent();
                return [3 /*break*/, 11];
            case 9:
                langFilter = __assign({}, filter);
                if (targetLanguageId) {
                    langFilter.languages = targetLanguageId;
                }
                return [4 /*yield*/, Content_1.ContentModel.find(langFilter)
                        .sort(sortBy)
                        .skip(offset)
                        .limit(fetchLimit)
                        .populate('languages', 'name')
                        .populate('genres', 'name')
                        .lean()];
            case 10:
                rawContents = _a.sent();
                _a.label = 11;
            case 11:
                logger_1.logger.info({ contentType: contentType_1, offset: offset, limit: limit, fetchLimit: fetchLimit, raw: rawContents.length }, 'Explore API raw fetch');
                rawContentIds = rawContents.map(function (c) { return c._id; });
                firstEpisodeMap_1 = new Map();
                episodeCountMap_1 = new Map();
                if (!(contentType_1 === 'drama' && rawContentIds.length > 0)) return [3 /*break*/, 14];
                return [4 /*yield*/, Episode_1.EpisodeModel.aggregate([
                        {
                            $match: {
                                contentId: { $in: rawContentIds },
                                season: 1,
                                episode: 1,
                                processingStatus: 'ready',
                            },
                        },
                        { $sort: { season: 1, episode: 1 } },
                    ])];
            case 12:
                firstEpisodes = _a.sent();
                firstEpisodes.forEach(function (e) {
                    firstEpisodeMap_1.set(e.contentId.toString(), e);
                });
                return [4 /*yield*/, Episode_1.EpisodeModel.aggregate([
                        { $match: { contentId: { $in: rawContentIds } } },
                        { $group: { _id: '$contentId', count: { $sum: 1 } } },
                    ])];
            case 13:
                episodeCounts = _a.sent();
                episodeCounts.forEach(function (e) {
                    episodeCountMap_1.set(e._id.toString(), e.count);
                });
                _a.label = 14;
            case 14:
                seenThumbnails = new Set();
                seenVideoUrls = new Set();
                uniqueContents = [];
                for (_i = 0, rawContents_1 = rawContents; _i < rawContents_1.length; _i++) {
                    content = rawContents_1[_i];
                    cid = content._id.toString();
                    firstEpisode = firstEpisodeMap_1.get(cid);
                    thumbnail = content.thumbnail || '';
                    videoUrl = (firstEpisode === null || firstEpisode === void 0 ? void 0 : firstEpisode.hlsUrl) || content.hlsUrl || '';
                    // Skip if we have no video to show for dramas
                    if (contentType_1 === 'drama' && !videoUrl)
                        continue;
                    // Skip if thumbnail is duplicate
                    // if (thumbnail && seenThumbnails.has(thumbnail)) continue;
                    // Skip if video URL is duplicate
                    // if (videoUrl && seenVideoUrls.has(videoUrl)) continue;
                    // Mark as seen
                    if (thumbnail)
                        seenThumbnails.add(thumbnail);
                    if (videoUrl)
                        seenVideoUrls.add(videoUrl);
                    uniqueContents.push(content);
                    // Stop once we have enough unique items
                    if (uniqueContents.length >= limit)
                        break;
                }
                uniqueIds = uniqueContents.map(function (c) { return c._id; });
                likedContentIdSet_1 = new Set();
                if (!(userId && uniqueIds.length > 0)) return [3 /*break*/, 16];
                return [4 /*yield*/, UserLike_1.UserLikeModel.find({
                        userId: userId,
                        contentId: { $in: uniqueIds },
                    })
                        .select('contentId')
                        .lean()];
            case 15:
                userLikes = _a.sent();
                userLikes.forEach(function (l) { return likedContentIdSet_1.add(l.contentId.toString()); });
                _a.label = 16;
            case 16:
                items = uniqueContents.map(function (content) {
                    var cid = content._id.toString();
                    var likeCount = content.likes || 0;
                    var isLikedByUser = likedContentIdSet_1.has(cid);
                    if (contentType_1 === 'movie') {
                        return mapContentItem(request, content, 'movie', 0, undefined, likeCount, isLikedByUser);
                    }
                    else {
                        var episodeCount = episodeCountMap_1.get(cid) || 0;
                        var firstEpisode = firstEpisodeMap_1.get(cid);
                        return mapContentItem(request, content, content.type || 'series', episodeCount, firstEpisode, likeCount, isLikedByUser);
                    }
                });
                nextOffset = offset + rawContents.length;
                hasMore = rawContents.length === fetchLimit;
                reply.send({
                    success: true,
                    data: {
                        items: items,
                        // Tell the client which IDs were shown (use these as seenIds next call)
                        returnedIds: items.map(function (i) { return i.id; }),
                        nextOffset: nextOffset,
                        hasMore: hasMore,
                    },
                });
                return [3 /*break*/, 18];
            case 17:
                error_1 = _a.sent();
                logger_1.logger.error(error_1, 'Error fetching explore data');
                reply.status(500).send({
                    success: false,
                    message: 'Failed to fetch explore data',
                    error: error_1.message,
                });
                return [3 /*break*/, 18];
            case 18: return [2 /*return*/];
        }
    });
}); };
exports.getExplore = getExplore;
