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
exports.getSeriesDetail = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var Content_1 = require("../models/Content");
var Episode_1 = require("../models/Episode");
var User_1 = require("../models/User");
var UserLike_1 = require("../models/UserLike");
var UserWishlist_1 = require("../models/UserWishlist");
var logger_1 = require("../lib/logger");
var config_1 = require("../lib/config");
// Helper to convert relative URLs to absolute URLs
var toAbsoluteUrl = function (request, url) {
    if (!url)
        return null;
    if (url.startsWith('http://') || url.startsWith('https://'))
        return url;
    var relPath = url;
    if (relPath.startsWith('hls/')) {
        relPath = "/uploads/".concat(relPath);
    }
    if (!relPath.startsWith('/uploads/')) {
        relPath = relPath.startsWith('uploads/') ? "/".concat(relPath) : "/uploads/".concat(relPath.startsWith('/') ? relPath.slice(1) : relPath);
    }
    var host = request.headers.host || request.hostname;
    var baseUrl = "".concat(request.protocol, "://").concat(host);
    return "".concat(baseUrl).concat(relPath);
};
// Helper: try to extract userId and plan from JWT without throwing
var getOptionalUser = function (request) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, server, decoded, user, isActive, _a;
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
                    return [2 /*return*/, { userId: decoded.id, userPlan: 'free' }];
                isActive = user.subscriptionStatus === 'active' && (!user.subscriptionExpiry || user.subscriptionExpiry > new Date());
                return [2 /*return*/, { userId: decoded.id, userPlan: isActive ? (user.subscriptionPlan || 'free') : 'free' }];
            case 2:
                _a = _b.sent();
                return [2 /*return*/, null];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getSeriesDetail = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, userInfo, userId, userPlan, series, isLikedByUser, isWishlisted, wishlisted, userObjectId, _a, likeDoc, wishlistDoc, related, genreIds, relatedSeries, cast, crew, genreNames, languageNames, allEpisodes, seasonsMap_1, _i, allEpisodes_1, ep, hours, minutes, durationStr, seasons, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 8, , 9]);
                id = request.params.id;
                if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                    return [2 /*return*/, reply.status(400).send({ success: false, message: 'Invalid series ID.' })];
                }
                return [4 /*yield*/, getOptionalUser(request)];
            case 1:
                userInfo = _b.sent();
                userId = (userInfo === null || userInfo === void 0 ? void 0 : userInfo.userId) || null;
                userPlan = (userInfo === null || userInfo === void 0 ? void 0 : userInfo.userPlan) || 'free';
                return [4 /*yield*/, Content_1.ContentModel.findById(id)
                        .populate('cast.actor', 'name image designation')
                        .populate('crew.director', 'name image designation')
                        .populate('genres', 'name')
                        .populate('languages', 'name')
                        .lean()];
            case 2:
                series = _b.sent();
                if (!series || series.status !== 'published' || series.type !== 'series') {
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'Series not found.' })];
                }
                isLikedByUser = false;
                isWishlisted = false;
                wishlisted = false;
                if (!userId) return [3 /*break*/, 4];
                userObjectId = new mongoose_1.default.Types.ObjectId(userId);
                return [4 /*yield*/, Promise.all([
                        UserLike_1.UserLikeModel.findOne({ userId: userObjectId, contentId: series._id, episodeId: null }).lean(),
                        UserWishlist_1.UserWishlistModel.findOne({ userId: userObjectId, contentId: series._id }).lean(),
                    ])];
            case 3:
                _a = _b.sent(), likeDoc = _a[0], wishlistDoc = _a[1];
                isLikedByUser = !!likeDoc;
                isWishlisted = !!wishlistDoc;
                wishlisted = !!wishlistDoc;
                _b.label = 4;
            case 4:
                related = [];
                if (!(series.genres && series.genres.length > 0)) return [3 /*break*/, 6];
                genreIds = series.genres.map(function (g) { return g._id || g; });
                return [4 /*yield*/, Content_1.ContentModel.find({
                        _id: { $ne: series._id },
                        type: 'series',
                        status: 'published',
                        genres: { $in: genreIds },
                    })
                        .select('title thumbnail bannerImage duration year rating genres contentType')
                        .populate('genres', 'name')
                        .limit(10)
                        .lean()];
            case 5:
                relatedSeries = _b.sent();
                related = relatedSeries.map(function (r) { return ({
                    id: r._id.toString(),
                    title: r.title,
                    thumbnail: toAbsoluteUrl(request, r.thumbnail) || null,
                    bannerImage: toAbsoluteUrl(request, r.bannerImage) || null,
                    duration: r.duration || null,
                    year: r.year || null,
                    rating: r.rating || null,
                    genres: (r.genres || []).map(function (g) { return (g === null || g === void 0 ? void 0 : g.name) || g; }),
                    type: 'series',
                    contentType: r.contentType,
                }); });
                _b.label = 6;
            case 6:
                cast = (series.cast || []).map(function (c) {
                    var _a, _b, _c, _d, _e;
                    return ({
                        id: ((_b = (_a = c.actor) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString()) || null,
                        name: ((_c = c.actor) === null || _c === void 0 ? void 0 : _c.name) || 'Unknown',
                        image: toAbsoluteUrl(request, (_d = c.actor) === null || _d === void 0 ? void 0 : _d.image) || null,
                        designation: ((_e = c.actor) === null || _e === void 0 ? void 0 : _e.designation) || null,
                        role: c.role || 'Actor',
                        character: c.character || null,
                    });
                });
                crew = (series.crew || []).map(function (c) {
                    var _a, _b, _c, _d, _e;
                    return ({
                        id: ((_b = (_a = c.director) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString()) || null,
                        name: ((_c = c.director) === null || _c === void 0 ? void 0 : _c.name) || 'Unknown',
                        image: toAbsoluteUrl(request, (_d = c.director) === null || _d === void 0 ? void 0 : _d.image) || null,
                        designation: ((_e = c.director) === null || _e === void 0 ? void 0 : _e.designation) || null,
                        role: c.role || 'Director',
                    });
                });
                genreNames = series.genres.map(function (g) { return (g === null || g === void 0 ? void 0 : g.name) || g; });
                languageNames = series.languages.map(function (l) { return (l === null || l === void 0 ? void 0 : l.name) || l; });
                return [4 /*yield*/, Episode_1.EpisodeModel.find({
                        contentId: series._id,
                        processingStatus: 'ready'
                    }).sort({ season: 1, episode: 1 }).lean()];
            case 7:
                allEpisodes = _b.sent();
                seasonsMap_1 = new Map();
                for (_i = 0, allEpisodes_1 = allEpisodes; _i < allEpisodes_1.length; _i++) {
                    ep = allEpisodes_1[_i];
                    if (!seasonsMap_1.has(ep.season)) {
                        seasonsMap_1.set(ep.season, []);
                    }
                    hours = ep.duration ? Math.floor(ep.duration / 3600) : 0;
                    minutes = ep.duration ? Math.floor((ep.duration % 3600) / 60) : 0;
                    durationStr = ep.duration ? (hours > 0 ? "".concat(hours, "h ").concat(minutes, "m") : "".concat(minutes, "m")) : null;
                    seasonsMap_1.get(ep.season).push({
                        id: ep._id.toString(),
                        season: ep.season,
                        episode: ep.episode,
                        title: ep.title,
                        description: ep.description || null,
                        thumbnail: toAbsoluteUrl(request, ep.thumbnail || series.thumbnail) || null,
                        duration: ep.duration || null,
                        durationFormatted: durationStr,
                        isFree: ep.isFree,
                        videoUrl: toAbsoluteUrl(request, ep.hlsUrl) || null,
                    });
                }
                seasons = Array.from(seasonsMap_1.keys()).map(function (s) { return ({
                    seasonNumber: s,
                    episodes: seasonsMap_1.get(s),
                }); });
                return [2 /*return*/, reply.send({
                        success: true,
                        data: {
                            id: series._id.toString(),
                            title: series.title,
                            originalTitle: series.originalTitle || null,
                            description: series.description || null,
                            shortDescription: series.shortDescription || null,
                            thumbnail: toAbsoluteUrl(request, series.thumbnail) || null,
                            bannerImage: toAbsoluteUrl(request, series.bannerImage) || null,
                            posterImage: toAbsoluteUrl(request, series.posterImage) || null,
                            trailerUrl: toAbsoluteUrl(request, series.trailerUrl) || null,
                            type: 'series',
                            contentType: series.contentType,
                            isLocked: series.planRequired !== 'free' && userPlan === 'free',
                            genres: genreNames,
                            genresText: genreNames.join(' & '),
                            languages: languageNames,
                            year: series.year || null,
                            rating: series.rating || null,
                            ageRating: series.ageRating || 0,
                            imdbRating: series.imdbRating || null,
                            planRequired: series.planRequired || 'free',
                            contentPlan: series.planRequired || 'free',
                            episodeCount: allEpisodes.length,
                            isExclusive: series.isExclusive || false,
                            featured: series.featured || false,
                            trending: series.trending || false,
                            releaseDate: series.releaseDate || null,
                            country: series.country || null,
                            studio: series.studio || null,
                            views: series.views || 0,
                            likeCount: series.likes || 0,
                            shares: series.shares || 0,
                            isLikedByUser: isLikedByUser,
                            isWishlisted: isWishlisted,
                            wishlisted: wishlisted,
                            shareUrl: (0, config_1.buildShareUrl)(series._id.toString()),
                            cast: cast,
                            crew: crew,
                            related: related,
                            seasons: seasons,
                        },
                    })];
            case 8:
                error_1 = _b.sent();
                logger_1.logger.error({ error: error_1 }, 'Error getting series detail');
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Failed to fetch series detail.', error: error_1.message })];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.getSeriesDetail = getSeriesDetail;
