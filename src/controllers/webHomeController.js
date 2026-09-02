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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebAllContent = exports.getWebHome = void 0;
var Movie_1 = require("../models/Movie");
var Content_1 = require("../models/Content");
var Episode_1 = require("../models/Episode");
var Genre_1 = require("../models/Genre");
var Banner_1 = require("../models/Banner");
var logger_1 = require("../lib/logger");
// Standardized mapping for website ContentItem
var mapContentItem = function (item, type, isHero) {
    var _a, _b;
    if (isHero === void 0) { isHero = false; }
    var badge;
    if (item.featured && item.trending)
        badge = 'EXCLUSIVE';
    else if (item.trending)
        badge = 'TRENDING';
    else if (item.featured)
        badge = 'TOP';
    else if (item.isNewContent)
        badge = 'NEW';
    else if (item.views > 1000)
        badge = 'HOT';
    return {
        id: item._id.toString(),
        title: item.title,
        poster: item.posterImage || item.thumbnail || '',
        backdrop: item.bannerImage || item.thumbnail || '',
        type: type,
        contentType: type === 'movie' ? 'movie' : (item.contentType || 'series'),
        year: ((_a = item.year) === null || _a === void 0 ? void 0 : _a.toString()) || new Date(item.createdAt).getFullYear().toString(),
        duration: item.duration ? "".concat(item.duration, "m") : '120m',
        imdbRating: ((_b = item.imdbRating) === null || _b === void 0 ? void 0 : _b.toString()) || (item.rating || '8.0'),
        ageRating: item.ageRating ? "".concat(item.ageRating, "+") : 'U/A 13+',
        description: item.shortDescription || item.description || '',
        language: item.languages && item.languages.length > 0 ? 'Multi' : 'EN',
        badge: badge,
        genres: (item.genres || []).map(function (g) { return (g === null || g === void 0 ? void 0 : g.name) || g; }),
        seasons: type === 'show' ? item.seasons || 1 : undefined,
    };
};
// Standardized mapping for ShortDrama
var mapShortDrama = function (item, totalEpisodes, freeEpisodes) {
    var _a, _b;
    var badge;
    if (item.featured && item.trending)
        badge = 'EXCLUSIVE';
    else if (item.trending)
        badge = 'TRENDING';
    else if (item.featured)
        badge = 'TOP';
    else if (item.isNewContent)
        badge = 'NEW';
    else if (item.views > 1000)
        badge = 'HOT';
    return {
        id: item._id.toString(),
        title: item.title,
        poster: item.posterImage || item.thumbnail || '',
        backdrop: item.bannerImage || item.thumbnail || '',
        rating: ((_a = item.imdbRating) === null || _a === void 0 ? void 0 : _a.toString()) || (item.rating || '8.5'),
        totalEpisodes: totalEpisodes,
        freeEpisodes: freeEpisodes,
        language: item.languages && item.languages.length > 0 ? 'Multi' : 'EN',
        badge: badge,
        contentType: 'drama',
        description: item.shortDescription || item.description || '',
        year: ((_b = item.year) === null || _b === void 0 ? void 0 : _b.toString()) || new Date(item.createdAt).getFullYear().toString(),
        releaseDate: item.createdAt,
        genres: (item.genres || []).map(function (g) { return (g === null || g === void 0 ? void 0 : g.name) || g; }),
    };
};
var homeCacheData = null;
var homeCacheTime = 0;
var CACHE_TTL = 30000; // 30 seconds
var getWebHome = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var now, selectFields, _a, actionGenre, dramaGenre, queries, results, heroContent, trendingRaw, newReleasesRaw, topRatedRaw, featuredDramasRaw, tvShowsRaw, newDramasRaw, actionMoviesRaw, dramaShowsRaw, allShortDramas, shortDramaIds, episodeStatsMap_1, episodeStats, trendingNow, newReleases, topRated, tvShows, actionMovies, dramaShows, featuredDramas, newDramas, responseData, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                now = Date.now();
                if (homeCacheData && (now - homeCacheTime) < CACHE_TTL) {
                    return [2 /*return*/, reply.send(homeCacheData)];
                }
                selectFields = 'title description shortDescription thumbnail bannerImage posterImage year rating ageRating duration imdbRating createdAt featured trending isNewContent views genres languages seasons contentType';
                return [4 /*yield*/, Promise.all([
                        Genre_1.GenreModel.findOne({ name: { $regex: /action/i } }).select('_id').lean(),
                        Genre_1.GenreModel.findOne({ name: { $regex: /drama/i } }).select('_id').lean()
                    ])];
            case 1:
                _a = _b.sent(), actionGenre = _a[0], dramaGenre = _a[1];
                queries = [
                    // 0: Hero Banners from BannerModel (active, target platform: web)
                    (function () { return __awaiter(void 0, void 0, void 0, function () {
                        var bannersRaw, contentIds, _a, movies, contents, contentMap, _i, movies_1, movie, _b, contents_1, content;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, Banner_1.BannerModel.find({
                                        isActive: true,
                                        targetPlatforms: 'web'
                                    }).sort({ position: 1, createdAt: -1 }).limit(10).lean()];
                                case 1:
                                    bannersRaw = _c.sent();
                                    contentIds = bannersRaw.map(function (b) { return b.contentId; }).filter(Boolean);
                                    return [4 /*yield*/, Promise.all([
                                            Movie_1.MovieModel.find({ _id: { $in: contentIds } }).populate('genres', 'name').lean(),
                                            Content_1.ContentModel.find({ _id: { $in: contentIds } }).populate('genres', 'name').lean(),
                                        ])];
                                case 2:
                                    _a = _c.sent(), movies = _a[0], contents = _a[1];
                                    contentMap = new Map();
                                    for (_i = 0, movies_1 = movies; _i < movies_1.length; _i++) {
                                        movie = movies_1[_i];
                                        contentMap.set(movie._id.toString(), __assign(__assign({}, movie), { type: 'movie' }));
                                    }
                                    for (_b = 0, contents_1 = contents; _b < contents_1.length; _b++) {
                                        content = contents_1[_b];
                                        contentMap.set(content._id.toString(), __assign(__assign({}, content), { type: 'series' }));
                                    }
                                    return [2 /*return*/, bannersRaw.map(function (banner) {
                                            var _a, _b, _c, _d;
                                            var content = banner.contentId ? contentMap.get(banner.contentId.toString()) : null;
                                            if (content) {
                                                // Determine the actual content type
                                                var isMovie = content.type === 'movie';
                                                var isDrama = !isMovie && content.contentType === 'drama';
                                                var type = isMovie ? 'movie' : 'show';
                                                var actualContentType = isMovie ? 'movie' : (content.contentType || 'series');
                                                return {
                                                    id: content._id.toString(),
                                                    title: banner.title || content.title,
                                                    poster: banner.imageUrl || content.posterImage || content.thumbnail || '',
                                                    backdrop: banner.imageUrl || content.bannerImage || content.thumbnail || '',
                                                    type: type,
                                                    contentType: actualContentType,
                                                    year: ((_a = content.year) === null || _a === void 0 ? void 0 : _a.toString()) || new Date(content.createdAt).getFullYear().toString(),
                                                    duration: content.duration ? "".concat(content.duration, "m") : '120m',
                                                    imdbRating: ((_b = content.imdbRating) === null || _b === void 0 ? void 0 : _b.toString()) || (content.rating || '8.0'),
                                                    ageRating: content.ageRating ? "".concat(content.ageRating, "+") : 'U/A 13+',
                                                    description: banner.description || content.shortDescription || content.description || '',
                                                    language: content.languages && content.languages.length > 0 ? 'Multi' : 'EN',
                                                    badge: ((_c = banner.type) === null || _c === void 0 ? void 0 : _c.toUpperCase()) || 'EXCLUSIVE',
                                                    genres: (content.genres || []).map(function (g) { return (g === null || g === void 0 ? void 0 : g.name) || g; }),
                                                    seasons: type === 'show' && !isDrama ? content.seasons || 1 : undefined,
                                                };
                                            }
                                            else {
                                                // Banner without linked content — use banner's own contentType
                                                var bannerContentType = banner.contentType || 'both';
                                                return {
                                                    id: banner._id.toString(),
                                                    title: banner.title,
                                                    poster: banner.imageUrl || '',
                                                    backdrop: banner.imageUrl || '',
                                                    type: bannerContentType === 'movie' ? 'movie' : 'show',
                                                    contentType: bannerContentType,
                                                    year: new Date(banner.createdAt).getFullYear().toString(),
                                                    duration: '120m',
                                                    imdbRating: '8.0',
                                                    ageRating: 'U/A 13+',
                                                    description: banner.description || '',
                                                    language: 'EN',
                                                    badge: ((_d = banner.type) === null || _d === void 0 ? void 0 : _d.toUpperCase()) || 'PROMO',
                                                    genres: [],
                                                    seasons: undefined,
                                                    ctaLink: banner.ctaLink,
                                                    ctaText: banner.ctaText,
                                                };
                                            }
                                        })];
                            }
                        });
                    }); })(),
                    // 1: Trending Now (Mix)
                    Promise.all([
                        Movie_1.MovieModel.find({ status: 'published', trending: true }).sort({ views: -1, createdAt: -1 }).select(selectFields).limit(5).populate('genres', 'name').lean(),
                        Content_1.ContentModel.find({ status: 'published', trending: true }).sort({ views: -1, createdAt: -1 }).select(selectFields).limit(5).populate('genres', 'name').lean()
                    ]),
                    // 2: New Releases (Mix)
                    Promise.all([
                        Movie_1.MovieModel.find({ status: 'published', isNewContent: true }).sort({ createdAt: -1 }).select(selectFields).limit(5).populate('genres', 'name').lean(),
                        Content_1.ContentModel.find({ status: 'published', isNewContent: true }).sort({ createdAt: -1 }).select(selectFields).limit(5).populate('genres', 'name').lean()
                    ]),
                    // 3: Top Rated Movies
                    Movie_1.MovieModel.find({ status: 'published' }).sort({ imdbRating: -1, views: -1 }).select(selectFields).limit(10).populate('genres', 'name').lean(),
                    // 4: Featured Dramas (Short Dramas)
                    Content_1.ContentModel.find({ status: 'published', type: 'series', contentType: 'drama', featured: true }).sort({ createdAt: -1 }).select(selectFields).limit(10).populate('genres', 'name').lean(),
                    // 5: TV Shows
                    Content_1.ContentModel.find({ status: 'published', type: 'series', contentType: 'series' }).sort({ views: -1 }).select(selectFields).limit(10).populate('genres', 'name').lean(),
                    // 6: New Dramas (Short Dramas)
                    Content_1.ContentModel.find({ status: 'published', type: 'series', contentType: 'drama', isNewContent: true }).sort({ createdAt: -1 }).select(selectFields).limit(10).populate('genres', 'name').lean(),
                    // 7: Action Movies
                    actionGenre
                        ? Movie_1.MovieModel.find({ status: 'published', genres: actionGenre._id }).sort({ views: -1 }).select(selectFields).limit(10).populate('genres', 'name').lean()
                        : Promise.resolve([]),
                    // 8: Drama Shows
                    dramaGenre
                        ? Content_1.ContentModel.find({ status: 'published', type: 'series', contentType: 'series', genres: dramaGenre._id }).sort({ views: -1 }).select(selectFields).limit(10).populate('genres', 'name').lean()
                        : Promise.resolve([])
                ];
                return [4 /*yield*/, Promise.all(queries)];
            case 2:
                results = _b.sent();
                heroContent = results[0];
                trendingRaw = __spreadArray(__spreadArray([], results[1][0], true), results[1][1], true).sort(function (a, b) { return (b.views || 0) - (a.views || 0); });
                newReleasesRaw = __spreadArray(__spreadArray([], results[2][0], true), results[2][1], true).sort(function (a, b) { return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); });
                topRatedRaw = results[3];
                featuredDramasRaw = results[4];
                tvShowsRaw = results[5];
                newDramasRaw = results[6];
                actionMoviesRaw = results[7];
                dramaShowsRaw = results[8];
                allShortDramas = __spreadArray(__spreadArray([], featuredDramasRaw, true), newDramasRaw, true);
                shortDramaIds = allShortDramas.map(function (d) { return d._id; });
                episodeStatsMap_1 = new Map();
                if (!(shortDramaIds.length > 0)) return [3 /*break*/, 4];
                return [4 /*yield*/, Episode_1.EpisodeModel.aggregate([
                        { $match: { contentId: { $in: shortDramaIds }, processingStatus: 'ready' } },
                        {
                            $group: {
                                _id: '$contentId',
                                total: { $sum: 1 },
                                free: { $sum: { $cond: [{ $eq: ['$isFree', true] }, 1, 0] } }
                            }
                        }
                    ])];
            case 3:
                episodeStats = _b.sent();
                episodeStats.forEach(function (s) { return episodeStatsMap_1.set(s._id.toString(), { total: s.total, free: s.free }); });
                _b.label = 4;
            case 4:
                trendingNow = trendingRaw.map(function (m) { return mapContentItem(m, m.type === 'series' ? 'show' : 'movie'); });
                newReleases = newReleasesRaw.map(function (m) { return mapContentItem(m, m.type === 'series' ? 'show' : 'movie'); });
                topRated = topRatedRaw.map(function (m) { return mapContentItem(m, 'movie'); });
                tvShows = tvShowsRaw.map(function (m) { return mapContentItem(m, 'show'); });
                actionMovies = actionMoviesRaw.map(function (m) { return mapContentItem(m, 'movie'); });
                dramaShows = dramaShowsRaw.map(function (m) { return mapContentItem(m, 'show'); });
                featuredDramas = featuredDramasRaw.map(function (m) {
                    var stats = episodeStatsMap_1.get(m._id.toString()) || { total: 0, free: 0 };
                    return mapShortDrama(m, stats.total, stats.free);
                });
                newDramas = newDramasRaw.map(function (m) {
                    var stats = episodeStatsMap_1.get(m._id.toString()) || { total: 0, free: 0 };
                    return mapShortDrama(m, stats.total, stats.free);
                });
                responseData = {
                    success: true,
                    data: {
                        heroContent: heroContent,
                        trendingNow: trendingNow,
                        newReleases: newReleases,
                        topRated: topRated,
                        featuredDramas: featuredDramas,
                        tvShows: tvShows,
                        newDramas: newDramas,
                        actionMovies: actionMovies,
                        dramaShows: dramaShows,
                    }
                };
                homeCacheData = responseData;
                homeCacheTime = Date.now();
                return [2 /*return*/, reply.send(responseData)];
            case 5:
                error_1 = _b.sent();
                logger_1.logger.error({ error: error_1 }, 'Error fetching web home API data');
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error', error: error_1.message })];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.getWebHome = getWebHome;
var getWebAllContent = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, movies, dramas, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Promise.all([
                        Movie_1.MovieModel.find({ status: 'published' }).lean(),
                        Content_1.ContentModel.find({ status: 'published' }).lean()
                    ])];
            case 1:
                _a = _b.sent(), movies = _a[0], dramas = _a[1];
                return [2 /*return*/, reply.send({ success: true, data: { movies: movies, dramas: dramas } })];
            case 2:
                error_2 = _b.sent();
                logger_1.logger.error({ error: error_2 }, 'Error fetching web all content API data');
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error', error: error_2.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getWebAllContent = getWebAllContent;
