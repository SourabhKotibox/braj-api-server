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
exports.getSearchPage = exports.getRecommendations = void 0;
var Movie_1 = require("../models/Movie");
var Content_1 = require("../models/Content");
var Episode_1 = require("../models/Episode");
var User_1 = require("../models/User");
var Language_1 = require("../models/Language");
var Genre_1 = require("../models/Genre");
var logger_1 = require("../lib/logger");
// Helper: try to extract userId from JWT (optional auth)
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
// Unified item mapper
var mapSearchItem = function (item, type, episodeCount) {
    if (episodeCount === void 0) { episodeCount = 0; }
    return ({
        id: item._id.toString(),
        title: item.title,
        description: item.description,
        shortDescription: item.shortDescription,
        thumbnail: item.thumbnail,
        bannerImage: item.bannerImage,
        posterImage: item.posterImage || item.thumbnail || null,
        type: type,
        episodeCount: episodeCount,
        contentPlan: item.planRequired || 'free',
        views: item.views || 0,
        rating: item.rating,
        year: item.year,
        duration: item.duration,
        status: item.status,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
    });
};
var getRecommendations = function (preferredLanguage) { return __awaiter(void 0, void 0, void 0, function () {
    var targetLanguageId, langDoc, movieFilter, recMovies, dramaFilter, recDramas, dramaIds, episodeCounts, episodeCountMap, recommendationsList;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                targetLanguageId = null;
                if (!preferredLanguage) return [3 /*break*/, 2];
                return [4 /*yield*/, Language_1.LanguageModel.findOne({ name: new RegExp("^".concat(preferredLanguage, "$"), 'i') }).lean()];
            case 1:
                langDoc = _a.sent();
                if (langDoc) {
                    targetLanguageId = langDoc._id;
                }
                _a.label = 2;
            case 2:
                movieFilter = { status: 'published' };
                if (targetLanguageId)
                    movieFilter.languages = targetLanguageId;
                return [4 /*yield*/, Movie_1.MovieModel.find(movieFilter)
                        .sort({ views: -1, createdAt: -1 })
                        .limit(6)
                        .lean()];
            case 3:
                recMovies = _a.sent();
                dramaFilter = { status: 'published', type: 'series' };
                if (targetLanguageId)
                    dramaFilter.languages = targetLanguageId;
                return [4 /*yield*/, Content_1.ContentModel.find(dramaFilter)
                        .sort({ views: -1, createdAt: -1 })
                        .limit(6)
                        .lean()];
            case 4:
                recDramas = _a.sent();
                dramaIds = recDramas.map(function (d) { return d._id; });
                return [4 /*yield*/, Episode_1.EpisodeModel.aggregate([
                        { $match: { contentId: { $in: dramaIds } } },
                        { $group: { _id: '$contentId', count: { $sum: 1 } } }
                    ])];
            case 5:
                episodeCounts = _a.sent();
                episodeCountMap = new Map();
                episodeCounts.forEach(function (e) { return episodeCountMap.set(e._id.toString(), e.count); });
                recommendationsList = __spreadArray(__spreadArray([], recMovies.map(function (m) { return mapSearchItem(m, 'movie', 0); }), true), recDramas.map(function (d) { return mapSearchItem(d, d.contentType === 'drama' ? 'drama' : 'series', episodeCountMap.get(d._id.toString()) || 0); }), true);
                // Sort recommendations by views to make them look uniform
                recommendationsList.sort(function (a, b) { return b.views - a.views; });
                return [2 /*return*/, recommendationsList.slice(0, 12)];
        }
    });
}); };
exports.getRecommendations = getRecommendations;
var getSearchPage = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var query, searchTerm, userId, preferredLanguage, user, targetLanguageId_1, langDoc, popularMovies, popularDramas, trendingSearchesSet_1, trendingSearches, recommendations, targetLanguageId, langDoc, regex, matchedGenres, genreIds, isMovieSearch, isDramaSearch, isSeriesSearch, movieQueryOptions, contentQueryOptions, _a, matchedMovies, matchedContents, matchedDramaIds, searchEpisodeCounts, searchEpisodeCountMap_1, results, recommendations, error_1;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 16, , 17]);
                query = request.query;
                searchTerm = ((_b = query.q) === null || _b === void 0 ? void 0 : _b.trim()) || '';
                userId = getOptionalUserId(request);
                preferredLanguage = 'Hindi';
                if (!userId) return [3 /*break*/, 2];
                return [4 /*yield*/, User_1.UserModel.findById(userId).select('preferredLanguage languageSelectionSkipped').lean()];
            case 1:
                user = _c.sent();
                if (user) {
                    if (user.preferredLanguage) {
                        preferredLanguage = user.preferredLanguage;
                    }
                    else if (user.languageSelectionSkipped) {
                        preferredLanguage = 'Hindi';
                    }
                }
                _c.label = 2;
            case 2:
                if (!!searchTerm) return [3 /*break*/, 8];
                targetLanguageId_1 = null;
                if (!preferredLanguage) return [3 /*break*/, 4];
                return [4 /*yield*/, Language_1.LanguageModel.findOne({ name: new RegExp("^".concat(preferredLanguage, "$"), 'i') }).lean()];
            case 3:
                langDoc = _c.sent();
                if (langDoc) {
                    targetLanguageId_1 = langDoc._id;
                }
                _c.label = 4;
            case 4: return [4 /*yield*/, Movie_1.MovieModel.find({ status: 'published' })
                    .sort({ views: -1, likes: -1 })
                    .limit(4)
                    .select('title')
                    .lean()];
            case 5:
                popularMovies = _c.sent();
                return [4 /*yield*/, Content_1.ContentModel.find({ status: 'published', type: 'series', contentType: 'drama' })
                        .sort({ views: -1, likes: -1 })
                        .limit(4)
                        .select('title')
                        .lean()];
            case 6:
                popularDramas = _c.sent();
                trendingSearchesSet_1 = new Set();
                popularMovies.forEach(function (m) { return trendingSearchesSet_1.add(m.title); });
                popularDramas.forEach(function (d) { return trendingSearchesSet_1.add(d.title); });
                trendingSearches = Array.from(trendingSearchesSet_1).slice(0, 6);
                return [4 /*yield*/, (0, exports.getRecommendations)(preferredLanguage)];
            case 7:
                recommendations = _c.sent();
                return [2 /*return*/, reply.send({
                        success: true,
                        data: {
                            isQueryEmpty: true,
                            trendingSearches: trendingSearches,
                            recommendations: recommendations,
                        }
                    })];
            case 8:
                targetLanguageId = null;
                if (!preferredLanguage) return [3 /*break*/, 10];
                return [4 /*yield*/, Language_1.LanguageModel.findOne({ name: new RegExp("^".concat(preferredLanguage, "$"), 'i') }).lean()];
            case 9:
                langDoc = _c.sent();
                if (langDoc) {
                    targetLanguageId = langDoc._id;
                }
                _c.label = 10;
            case 10:
                regex = new RegExp(searchTerm, 'i');
                return [4 /*yield*/, Genre_1.GenreModel.find({ name: regex }).select('_id').lean()];
            case 11:
                matchedGenres = _c.sent();
                genreIds = matchedGenres.map(function (g) { return g._id; });
                isMovieSearch = /movie/i.test(searchTerm);
                isDramaSearch = /drama/i.test(searchTerm);
                isSeriesSearch = /series|tv show|show/i.test(searchTerm);
                movieQueryOptions = [
                    { title: regex },
                    { originalTitle: regex },
                    { description: regex },
                    { shortDescription: regex },
                    { tags: regex }
                ];
                if (genreIds.length > 0)
                    movieQueryOptions.push({ genres: { $in: genreIds } });
                contentQueryOptions = [
                    { title: regex },
                    { originalTitle: regex },
                    { description: regex },
                    { shortDescription: regex },
                    { tags: regex }
                ];
                if (genreIds.length > 0)
                    contentQueryOptions.push({ genres: { $in: genreIds } });
                // If explicit type is searched, we don't need text match if they just typed the type.
                // We add an empty filter that matches anything if it's that type.
                if (isMovieSearch)
                    movieQueryOptions.push({}); // Match any movie
                if (isDramaSearch)
                    contentQueryOptions.push({ contentType: 'drama' });
                if (isSeriesSearch)
                    contentQueryOptions.push({ contentType: 'series' });
                return [4 /*yield*/, Promise.all([
                        // Search movies
                        Movie_1.MovieModel.find(__assign(__assign({ status: 'published' }, (targetLanguageId ? { languages: targetLanguageId } : {})), { $or: movieQueryOptions }))
                            .limit(20)
                            .lean(),
                        // Search dramas and TV shows
                        Content_1.ContentModel.find(__assign(__assign({ status: 'published', type: 'series' }, (targetLanguageId ? { languages: targetLanguageId } : {})), { $or: contentQueryOptions }))
                            .limit(20)
                            .lean()
                    ])];
            case 12:
                _a = _c.sent(), matchedMovies = _a[0], matchedContents = _a[1];
                matchedDramaIds = matchedContents.map(function (d) { return d._id; });
                return [4 /*yield*/, Episode_1.EpisodeModel.aggregate([
                        { $match: { contentId: { $in: matchedDramaIds } } },
                        { $group: { _id: '$contentId', count: { $sum: 1 } } }
                    ])];
            case 13:
                searchEpisodeCounts = _c.sent();
                searchEpisodeCountMap_1 = new Map();
                searchEpisodeCounts.forEach(function (e) { return searchEpisodeCountMap_1.set(e._id.toString(), e.count); });
                results = __spreadArray(__spreadArray([], matchedMovies.map(function (m) { return mapSearchItem(m, 'movie', 0); }), true), matchedContents.map(function (c) { return mapSearchItem(c, c.contentType === 'drama' ? 'drama' : 'series', searchEpisodeCountMap_1.get(c._id.toString()) || 0); }), true);
                // Sort search results by views/popularity
                results.sort(function (a, b) { return b.views - a.views; });
                if (!(results.length === 0)) return [3 /*break*/, 15];
                return [4 /*yield*/, (0, exports.getRecommendations)(preferredLanguage)];
            case 14:
                recommendations = _c.sent();
                return [2 /*return*/, reply.send({
                        success: true,
                        data: {
                            isQueryEmpty: false,
                            results: [],
                            message: 'No match found',
                            recommendations: recommendations
                        }
                    })];
            case 15: return [2 /*return*/, reply.send({
                    success: true,
                    data: {
                        isQueryEmpty: false,
                        results: results
                    }
                })];
            case 16:
                error_1 = _c.sent();
                logger_1.logger.error({ error: error_1 }, 'Error during search operation');
                return [2 /*return*/, reply.status(500).send({
                        success: false,
                        message: 'Failed to process search request',
                        error: error_1.message
                    })];
            case 17: return [2 /*return*/];
        }
    });
}); };
exports.getSearchPage = getSearchPage;
