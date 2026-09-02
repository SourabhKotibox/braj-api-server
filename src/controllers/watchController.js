"use strict";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWatchData = exports.QUALITY_PLAN_GATE = exports.QUALITY_LABELS = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var Content_1 = require("../models/Content");
var Movie_1 = require("../models/Movie");
var Episode_1 = require("../models/Episode");
var UserLike_1 = require("../models/UserLike");
var UserWishlist_1 = require("../models/UserWishlist");
var UserDownload_1 = require("../models/UserDownload");
var User_1 = require("../models/User");
var UserWatchProgress_1 = require("../models/UserWatchProgress");
var UnlockedEpisode_1 = require("../models/UnlockedEpisode");
require("../models/Actor");
require("../models/Director");
var logger_1 = require("../lib/logger");
var s3_1 = require("../lib/s3");
// Plan hierarchy
var PLAN_LEVELS = {
    free: 0,
    basic: 1,
    standard: 2,
    premium: 3,
};
var config_1 = require("../lib/config");
var getOptionalUser = function (request) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, server, decoded, user, profileId, isActive, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                authHeader = request.headers.authorization;
                if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer ')))
                    return [2 /*return*/, null];
                server = request.server;
                decoded = server.jwt.verify(authHeader.slice(7));
                if (!(decoded === null || decoded === void 0 ? void 0 : decoded.id))
                    return [2 /*return*/, null];
                return [4 /*yield*/, User_1.UserModel.findById(decoded.id).select('subscriptionPlan subscriptionStatus subscriptionExpiry').lean()];
            case 1:
                user = _b.sent();
                if (!user)
                    return [2 /*return*/, null];
                profileId = request.headers['x-profile-id'];
                isActive = user.subscriptionStatus === 'active' && (!user.subscriptionExpiry || user.subscriptionExpiry > new Date());
                return [2 /*return*/, { userId: decoded.id, userPlan: isActive ? (user.subscriptionPlan || 'free') : 'free', profileId: profileId }];
            case 2:
                _a = _b.sent();
                return [2 /*return*/, null];
            case 3: return [2 /*return*/];
        }
    });
}); };
var canAccessItem = function (isFree, isLocked, contentPlanRequired, userPlan) {
    var _a, _b;
    if (isFree)
        return true;
    if (isLocked) {
        // If the episode is locked, the user must have at least a 'basic' plan (level 1), 
        // or higher if the content itself requires a higher plan
        var requiredLevel = Math.max((_a = PLAN_LEVELS[contentPlanRequired]) !== null && _a !== void 0 ? _a : 0, 1);
        return ((_b = PLAN_LEVELS[userPlan]) !== null && _b !== void 0 ? _b : 0) >= requiredLevel;
    }
    return true;
};
// Helper to convert relative URLs to absolute URLs
var toAbsoluteUrl = function (request, url, s3Active, s3BaseUrl) {
    if (!url)
        return null;
    if (url.startsWith('http://') || url.startsWith('https://'))
        return url;
    var isLocalHls = url.startsWith('hls/') || url.startsWith('/uploads/hls/') || url.includes('/hls/');
    if (s3Active && !isLocalHls) {
        var cleanKey = url;
        if (cleanKey.startsWith('/'))
            cleanKey = cleanKey.slice(1);
        if (cleanKey.startsWith('uploads/'))
            cleanKey = cleanKey.replace('uploads/', '');
        if (cleanKey.startsWith('/uploads/'))
            cleanKey = cleanKey.replace('/uploads/', '');
        return "".concat(s3BaseUrl, "/").concat(cleanKey);
    }
    var relPath = url;
    if (!relPath.startsWith('/uploads/')) {
        relPath = relPath.startsWith('uploads/') ? "/".concat(relPath) : "/uploads/".concat(relPath.startsWith('/') ? relPath.slice(1) : relPath);
    }
    var baseUrl = "".concat(request.protocol, "://").concat(request.hostname);
    return "".concat(baseUrl).concat(relPath);
};
// ─────────────────────────────────────────────────────────────────────────────
// Build the quality list returned to Flutter/Web players.
// "Auto" uses master.m3u8 so ExoPlayer/MediaKit does ABR automatically.
// Each named quality links directly to its sub-playlist.
// ─────────────────────────────────────────────────────────────────────────────
// Quality label map — used by both series/episode and movie watch endpoints
exports.QUALITY_LABELS = {
    '144p': '144p',
    '240p': '240p',
    '360p': '360p',
    '480p': '480p SD',
    '720p': '720p HD',
    '1080p': '1080p Full HD',
    '1440p': '2K',
    '2160p': '4K Ultra HD',
};
// Defines the minimum plan required to stream each quality (for future subscription gating)
exports.QUALITY_PLAN_GATE = {
    '144p': 'free',
    '240p': 'free',
    '360p': 'free',
    '480p': 'free',
    '720p': 'basic',
    '1080p': 'standard',
    '1440p': 'premium',
    '2160p': 'premium',
};
var QUALITY_ORDER = ['144p', '240p', '360p', '480p', '720p', '1080p', '1440p', '2160p'];
var buildNamedQualities = function (request, hlsUrl, qualities, s3Active, s3BaseUrl, userPlan) {
    if (qualities === void 0) { qualities = []; }
    if (userPlan === void 0) { userPlan = 'free'; }
    var autoUrl = toAbsoluteUrl(request, hlsUrl, s3Active, s3BaseUrl);
    var result = [
        {
            key: 'auto',
            label: 'Auto',
            description: 'Adjusts automatically based on your connection speed',
            url: autoUrl,
            requiresPlan: 'free',
            isLocked: false,
        },
    ];
    // Sort stored qualities in ascending order and add each one
    var sortedQualities = __spreadArray([], qualities, true).sort(function (a, b) { return QUALITY_ORDER.indexOf(a.quality) - QUALITY_ORDER.indexOf(b.quality); });
    for (var _i = 0, sortedQualities_1 = sortedQualities; _i < sortedQualities_1.length; _i++) {
        var q = sortedQualities_1[_i];
        if (!q.quality || !q.url)
            continue;
        var absoluteUrl = toAbsoluteUrl(request, q.url, s3Active, s3BaseUrl);
        if (!absoluteUrl)
            continue;
        var requiredPlan = exports.QUALITY_PLAN_GATE[q.quality] || 'free';
        // isLocked: currently always false — flip to real check when subscriptions go live:
        // const isLocked = PLAN_LEVELS[userPlan] < PLAN_LEVELS[requiredPlan];
        var isLocked = false;
        result.push({
            key: q.quality,
            label: exports.QUALITY_LABELS[q.quality] || q.quality,
            description: q.quality === '144p' ? 'Very low quality — for slow connections' :
                q.quality === '240p' ? 'Low quality — saves data' :
                    q.quality === '360p' ? 'Low quality' :
                        q.quality === '480p' ? 'Standard definition' :
                            q.quality === '720p' ? 'High definition' :
                                q.quality === '1080p' ? 'Full HD — recommended' :
                                    q.quality === '1440p' ? '2K — requires fast connection' :
                                        q.quality === '2160p' ? '4K Ultra HD — requires very fast connection' :
                                            "Stream at ".concat(exports.QUALITY_LABELS[q.quality] || q.quality),
            url: absoluteUrl,
            requiresPlan: requiredPlan,
            isLocked: isLocked,
        });
    }
    return result;
};
var getWatchData = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var contentId, query, userInfo, userId, userPlan_1, profileId, userObjectId, requestedSeason_1, requestedEpisode_1, lastProgress, epDoc, content, isMovieType, autoDetectAndSyncQualities, syncErr_1, contentPlan_1, isLikedByUser, isWishlisted, isDownloaded, likedEpisodeIdSet_1, _a, likeDoc, wishlistDoc, downloadDoc, s3Active_1, s3BaseUrl_1, s3Url, cast, crew, relatedContents, relatedFilter, related, related, currentEpisode, seasons, totalSeasons, totalEpisodes, episodeMeta, isAccessible, watchProgress, progressDoc, hours, minutes, durationStr, genresText, allEpisodes, unlockedEpisodeIdSet_1, episodeIds, episodeLikes, unlockedEps, seasonMap_1, genresText, mapEpisode_1, currentEpisodeRaw, autoDetectAndSyncQualities, synced, syncErr_2, watchProgress, progressDoc, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 37, , 38]);
                contentId = request.params.contentId;
                query = request.query;
                if (!mongoose_1.default.Types.ObjectId.isValid(contentId)) {
                    return [2 /*return*/, reply.status(400).send({ success: false, message: 'Invalid contentId.' })];
                }
                return [4 /*yield*/, getOptionalUser(request)];
            case 1:
                userInfo = _b.sent();
                userId = (userInfo === null || userInfo === void 0 ? void 0 : userInfo.userId) || null;
                userPlan_1 = (userInfo === null || userInfo === void 0 ? void 0 : userInfo.userPlan) || 'free';
                profileId = (userInfo === null || userInfo === void 0 ? void 0 : userInfo.profileId) || null;
                userObjectId = userId ? new mongoose_1.default.Types.ObjectId(userId) : null;
                requestedSeason_1 = query.season ? Math.max(1, Number(query.season)) : null;
                requestedEpisode_1 = query.episode ? Math.max(1, Number(query.episode)) : null;
                if (!(userObjectId && (requestedSeason_1 === null || requestedEpisode_1 === null))) return [3 /*break*/, 3];
                return [4 /*yield*/, UserWatchProgress_1.UserWatchProgressModel.findOne({ userId: userObjectId, contentId: contentId, profileId: profileId })
                        .sort({ lastWatchedAt: -1 })
                        .populate('episodeId')
                        .lean()];
            case 2:
                lastProgress = _b.sent();
                if (lastProgress && lastProgress.episodeId) {
                    epDoc = lastProgress.episodeId;
                    if (requestedSeason_1 === null)
                        requestedSeason_1 = epDoc.season;
                    if (requestedEpisode_1 === null)
                        requestedEpisode_1 = epDoc.episode;
                }
                _b.label = 3;
            case 3:
                // Default to Season 1, Episode 1 if still not determined
                if (requestedSeason_1 === null)
                    requestedSeason_1 = 1;
                if (requestedEpisode_1 === null)
                    requestedEpisode_1 = 1;
                return [4 /*yield*/, Content_1.ContentModel.findById(contentId).populate('genres', 'name').lean()];
            case 4:
                content = _b.sent();
                isMovieType = false;
                if (!!content) return [3 /*break*/, 11];
                _b.label = 5;
            case 5:
                _b.trys.push([5, 8, , 9]);
                return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../services/videoProcessor')); })];
            case 6:
                autoDetectAndSyncQualities = (_b.sent()).autoDetectAndSyncQualities;
                return [4 /*yield*/, autoDetectAndSyncQualities(contentId, 'movie')];
            case 7:
                _b.sent();
                return [3 /*break*/, 9];
            case 8:
                syncErr_1 = _b.sent();
                logger_1.logger.warn({ syncErr: syncErr_1, contentId: contentId }, 'Failed to auto-detect and sync qualities for movie in getWatchData');
                return [3 /*break*/, 9];
            case 9: return [4 /*yield*/, Movie_1.MovieModel.findById(contentId)
                    .populate('genres', 'name')
                    .populate('cast.actor', 'name image')
                    .populate('crew.director', 'name image')
                    .lean()];
            case 10:
                content = _b.sent();
                if (!content || content.status !== 'published') {
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'Content not found.' })];
                }
                isMovieType = true;
                return [3 /*break*/, 12];
            case 11:
                if (content.status !== 'published') {
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'Content not found.' })];
                }
                _b.label = 12;
            case 12:
                contentPlan_1 = content.planRequired || 'free';
                isLikedByUser = false;
                isWishlisted = false;
                isDownloaded = false;
                likedEpisodeIdSet_1 = new Set();
                if (!userObjectId) return [3 /*break*/, 14];
                return [4 /*yield*/, Promise.all([
                        UserLike_1.UserLikeModel.findOne({ userId: userObjectId, contentId: content._id, episodeId: null }).lean(),
                        UserWishlist_1.UserWishlistModel.findOne({ userId: userObjectId, contentId: content._id }).lean(),
                        UserDownload_1.UserDownloadModel.findOne({ userId: userObjectId, contentId: content._id }).lean(),
                    ])];
            case 13:
                _a = _b.sent(), likeDoc = _a[0], wishlistDoc = _a[1], downloadDoc = _a[2];
                isLikedByUser = !!likeDoc;
                isWishlisted = !!wishlistDoc;
                isDownloaded = !!downloadDoc;
                _b.label = 14;
            case 14: return [4 /*yield*/, (0, s3_1.isS3Configured)()];
            case 15:
                s3Active_1 = _b.sent();
                s3BaseUrl_1 = '';
                if (!s3Active_1) return [3 /*break*/, 17];
                return [4 /*yield*/, (0, s3_1.getS3PublicUrl)('')];
            case 16:
                s3Url = _b.sent();
                s3BaseUrl_1 = s3Url.endsWith('/') ? s3Url.slice(0, -1) : s3Url;
                _b.label = 17;
            case 17:
                cast = [];
                crew = [];
                if (isMovieType) {
                    cast = (content.cast || []).map(function (c) {
                        var _a, _b, _c, _d;
                        return ({
                            id: ((_b = (_a = c.actor) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString()) || null,
                            name: ((_c = c.actor) === null || _c === void 0 ? void 0 : _c.name) || 'Unknown',
                            image: toAbsoluteUrl(request, (_d = c.actor) === null || _d === void 0 ? void 0 : _d.image, s3Active_1, s3BaseUrl_1) || null,
                            role: c.role || 'Actor',
                            character: c.character || null,
                        });
                    });
                    crew = (content.crew || []).map(function (c) {
                        var _a, _b, _c, _d;
                        return ({
                            id: ((_b = (_a = c.director) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString()) || null,
                            name: ((_c = c.director) === null || _c === void 0 ? void 0 : _c.name) || 'Unknown',
                            image: toAbsoluteUrl(request, (_d = c.director) === null || _d === void 0 ? void 0 : _d.image, s3Active_1, s3BaseUrl_1) || null,
                            role: c.role || 'Director',
                        });
                    });
                }
                else {
                    cast = (content.cast || []).map(function (c) { return ({ name: c.name, image: toAbsoluteUrl(request, c.photo, s3Active_1, s3BaseUrl_1) || null, role: c.role || 'Actor', character: c.character || null }); });
                    crew = (content.crew || []).map(function (c) { return ({ name: c.name, image: null, role: c.role || 'Crew' }); });
                }
                relatedContents = [];
                if (!(content.genres && content.genres.length > 0)) return [3 /*break*/, 21];
                relatedFilter = {
                    _id: { $ne: content._id },
                    status: 'published',
                    genres: { $in: content.genres }
                };
                if (!isMovieType) return [3 /*break*/, 19];
                return [4 /*yield*/, Movie_1.MovieModel.find(relatedFilter).select('title thumbnail duration type').limit(5).lean()];
            case 18:
                related = _b.sent();
                relatedContents = related.map(function (r) { return ({ id: r._id.toString(), title: r.title, thumbnail: toAbsoluteUrl(request, r.thumbnail, s3Active_1, s3BaseUrl_1), duration: r.duration, type: 'movie' }); });
                return [3 /*break*/, 21];
            case 19: return [4 /*yield*/, Content_1.ContentModel.find(relatedFilter).select('title thumbnail type contentType').limit(5).lean()];
            case 20:
                related = _b.sent();
                relatedContents = related.map(function (r) { return ({ id: r._id.toString(), title: r.title, thumbnail: toAbsoluteUrl(request, r.thumbnail, s3Active_1, s3BaseUrl_1), type: r.contentType || 'series' }); });
                _b.label = 21;
            case 21:
                currentEpisode = null;
                seasons = [];
                totalSeasons = 0;
                totalEpisodes = 0;
                episodeMeta = '';
                if (!isMovieType) return [3 /*break*/, 24];
                isAccessible = canAccessItem(contentPlan_1 === 'free', contentPlan_1 !== 'free', contentPlan_1, userPlan_1);
                watchProgress = null;
                if (!userObjectId) return [3 /*break*/, 23];
                return [4 /*yield*/, UserWatchProgress_1.UserWatchProgressModel.findOne({ userId: userObjectId, contentId: content._id, episodeId: null, profileId: profileId }).lean()];
            case 22:
                progressDoc = _b.sent();
                if (progressDoc) {
                    watchProgress = {
                        progressSeconds: progressDoc.progressSeconds,
                        durationSeconds: progressDoc.durationSeconds,
                        progressPercent: progressDoc.progressPercent,
                        lastWatchedAt: progressDoc.lastWatchedAt,
                    };
                }
                _b.label = 23;
            case 23:
                currentEpisode = {
                    id: content._id.toString(),
                    title: content.title,
                    duration: content.duration || null,
                    isFree: contentPlan_1 === 'free',
                    isLocked: !isAccessible,
                    hlsUrl: isAccessible ? toAbsoluteUrl(request, content.hlsUrl, s3Active_1, s3BaseUrl_1) : null,
                    trailerUrl: toAbsoluteUrl(request, content.trailerUrl, s3Active_1, s3BaseUrl_1),
                    videoSettings: isAccessible ? buildNamedQualities(request, content.hlsUrl, content.videoQualities, s3Active_1, s3BaseUrl_1) : null,
                    watchProgress: watchProgress,
                };
                hours = content.duration ? Math.floor(content.duration / 3600) : 0;
                minutes = content.duration ? Math.floor((content.duration % 3600) / 60) : 0;
                durationStr = hours > 0 ? "".concat(hours, "h ").concat(minutes, "m") : "".concat(minutes, "m");
                genresText = (content.genres || []).map(function (g) { return g.name || g; }).join(', ');
                episodeMeta = "HD \u2022 ".concat(genresText, " \u2022 ").concat(durationStr);
                totalSeasons = 0;
                totalEpisodes = 1;
                return [3 /*break*/, 36];
            case 24: return [4 /*yield*/, Episode_1.EpisodeModel.find({ contentId: content._id }).sort({ season: 1, episode: 1 }).lean()];
            case 25:
                allEpisodes = _b.sent();
                unlockedEpisodeIdSet_1 = new Set();
                if (!(userObjectId && allEpisodes.length > 0)) return [3 /*break*/, 28];
                episodeIds = allEpisodes.map(function (ep) { return ep._id; });
                return [4 /*yield*/, UserLike_1.UserLikeModel.find({
                        userId: userObjectId,
                        contentId: content._id,
                        episodeId: { $in: episodeIds },
                    }).select('episodeId').lean()];
            case 26:
                episodeLikes = _b.sent();
                episodeLikes.forEach(function (l) {
                    if (l.episodeId)
                        likedEpisodeIdSet_1.add(l.episodeId.toString());
                });
                return [4 /*yield*/, UnlockedEpisode_1.UnlockedEpisodeModel.find({
                        userId: userObjectId,
                        episodeId: { $in: episodeIds },
                    }).select('episodeId').lean()];
            case 27:
                unlockedEps = _b.sent();
                unlockedEps.forEach(function (u) {
                    if (u.episodeId)
                        unlockedEpisodeIdSet_1.add(u.episodeId.toString());
                });
                _b.label = 28;
            case 28:
                seasonMap_1 = new Map();
                allEpisodes.forEach(function (ep) {
                    if (!seasonMap_1.has(ep.season))
                        seasonMap_1.set(ep.season, []);
                    seasonMap_1.get(ep.season).push(ep);
                });
                totalEpisodes = allEpisodes.length;
                totalSeasons = seasonMap_1.size;
                genresText = (content.genres || []).map(function (g) { return g.name || g; }).join(', ');
                episodeMeta = "".concat(requestedEpisode_1, " of ").concat(totalEpisodes, " Episodes \u2022 Season ").concat(requestedSeason_1, " \u2022 ").concat(genresText);
                mapEpisode_1 = function (ep) {
                    var accessible = canAccessItem(ep.isFree, ep.isLocked || contentPlan_1 !== 'free', contentPlan_1, userPlan_1);
                    // Subscribers also bypass locked status for episode unlocking
                    if (userPlan_1 !== 'free')
                        accessible = true;
                    if (unlockedEpisodeIdSet_1.has(ep._id.toString()))
                        accessible = true;
                    return {
                        id: ep._id.toString(),
                        season: ep.season,
                        episodeNumber: ep.episode,
                        title: ep.title,
                        duration: ep.duration || null,
                        isFree: ep.isFree,
                        isLocked: !accessible,
                        isLockedForUser: !accessible,
                        coinsRequired: ep.coinsRequired || 0,
                        hlsUrl: accessible ? toAbsoluteUrl(request, ep.hlsUrl, s3Active_1, s3BaseUrl_1) : null,
                        trailerUrl: toAbsoluteUrl(request, ep.trailerUrl, s3Active_1, s3BaseUrl_1),
                        likeCount: ep.likes || 0,
                        isLikedByUser: likedEpisodeIdSet_1.has(ep._id.toString()),
                    };
                };
                seasons = Array.from(seasonMap_1.entries()).map(function (_a) {
                    var seasonNum = _a[0], episodes = _a[1];
                    return ({
                        seasonNumber: seasonNum,
                        totalEpisodes: episodes.length,
                        episodes: episodes.map(mapEpisode_1),
                    });
                });
                currentEpisodeRaw = allEpisodes.find(function (ep) { return ep.season === requestedSeason_1 && ep.episode === requestedEpisode_1; }) || allEpisodes[0];
                if (!currentEpisodeRaw) return [3 /*break*/, 36];
                _b.label = 29;
            case 29:
                _b.trys.push([29, 32, , 33]);
                return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../services/videoProcessor')); })];
            case 30:
                autoDetectAndSyncQualities = (_b.sent()).autoDetectAndSyncQualities;
                return [4 /*yield*/, autoDetectAndSyncQualities(currentEpisodeRaw._id, 'episode')];
            case 31:
                synced = _b.sent();
                if (synced) {
                    currentEpisodeRaw = synced;
                }
                return [3 /*break*/, 33];
            case 32:
                syncErr_2 = _b.sent();
                logger_1.logger.warn({ syncErr: syncErr_2, episodeId: currentEpisodeRaw._id }, 'Failed to auto-detect and sync qualities for episode in getWatchData');
                return [3 /*break*/, 33];
            case 33:
                currentEpisode = mapEpisode_1(currentEpisodeRaw);
                if (!currentEpisode.isLocked) {
                    currentEpisode.videoSettings = buildNamedQualities(request, currentEpisodeRaw.hlsUrl, currentEpisodeRaw.videoQualities || [], s3Active_1, s3BaseUrl_1);
                }
                else {
                    currentEpisode.videoSettings = null;
                }
                watchProgress = null;
                if (!userObjectId) return [3 /*break*/, 35];
                return [4 /*yield*/, UserWatchProgress_1.UserWatchProgressModel.findOne({
                        userId: userObjectId,
                        contentId: content._id,
                        episodeId: currentEpisodeRaw._id,
                        profileId: profileId
                    }).lean()];
            case 34:
                progressDoc = _b.sent();
                if (progressDoc) {
                    watchProgress = {
                        progressSeconds: progressDoc.progressSeconds,
                        durationSeconds: progressDoc.durationSeconds,
                        progressPercent: progressDoc.progressPercent,
                        lastWatchedAt: progressDoc.lastWatchedAt,
                    };
                }
                _b.label = 35;
            case 35:
                currentEpisode.watchProgress = watchProgress;
                _b.label = 36;
            case 36: 
            // ── 9. Final Output ───────────────────────────────────────────────────────
            return [2 /*return*/, reply.send({
                    success: true,
                    data: {
                        content: {
                            id: content._id.toString(),
                            title: content.title,
                            description: content.description || null,
                            shortDescription: content.shortDescription || null,
                            thumbnail: toAbsoluteUrl(request, content.thumbnail, s3Active_1, s3BaseUrl_1) || null,
                            bannerImage: toAbsoluteUrl(request, content.bannerImage, s3Active_1, s3BaseUrl_1) || null,
                            genres: content.genres || [],
                            genresText: (content.genres || []).join(' & '),
                            languages: content.languages || [],
                            type: isMovieType ? 'movie' : (content.contentType || 'drama'),
                            totalSeasons: totalSeasons,
                            totalEpisodes: totalEpisodes,
                            episodeMeta: episodeMeta,
                            year: content.year || null,
                            rating: content.rating || null,
                            ageRating: content.ageRating || 0,
                            planRequired: contentPlan_1,
                            isExclusive: content.isExclusive || false,
                            views: content.views || 0,
                            likeCount: content.likes || 0,
                            isLikedByUser: isLikedByUser,
                            isWishlisted: isWishlisted,
                            isDownloaded: isDownloaded,
                            shareUrl: (0, config_1.buildShareUrl)(content._id.toString()),
                            cast: cast,
                            crew: crew,
                            related: relatedContents,
                        },
                        currentEpisode: currentEpisode,
                        seasons: seasons,
                        playbackSpeeds: [
                            { value: 0.75, label: '0.75x' },
                            { value: 1.0, label: 'Normal' },
                            { value: 1.25, label: '1.25x' },
                            { value: 1.5, label: '1.5x' },
                            { value: 1.75, label: '1.75x' },
                            { value: 2.0, label: '2.0x' }
                        ],
                        userAccess: {
                            isLoggedIn: !!userId,
                            userPlan: userPlan_1,
                            canAccessCurrentEpisode: currentEpisode ? !currentEpisode.isLocked : false,
                        },
                    },
                })];
            case 37:
                error_1 = _b.sent();
                logger_1.logger.error(error_1, 'Error fetching watch data');
                return [2 /*return*/, reply.status(500).send({
                        success: false,
                        message: 'Failed to fetch watch data.',
                        error: error_1.message,
                    })];
            case 38: return [2 /*return*/];
        }
    });
}); };
exports.getWatchData = getWatchData;
