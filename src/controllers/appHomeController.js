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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppBanners = exports.getHomePage = void 0;
var Banner_1 = require("../models/Banner");
var Movie_1 = require("../models/Movie");
var Content_1 = require("../models/Content");
var Episode_1 = require("../models/Episode");
var Section_1 = require("../models/Section");
var UserLike_1 = require("../models/UserLike");
var User_1 = require("../models/User");
var Language_1 = require("../models/Language");
var UserWatchProgress_1 = require("../models/UserWatchProgress");
var AppSetting_1 = require("../models/AppSetting");
var logger_1 = require("../lib/logger");
var mongoose_1 = __importDefault(require("mongoose"));
// Base URL for the backend API (used for smart share links)
var config_1 = require("../lib/config");
// ── URL Resolver ─────────────────────────────────────────────────────────────
// Converts any stored path/key to a proper full URL:
// - Already full URL (https://...) → returned as-is
// - Local relative path → full server URL
var buildUrlResolver = function (request) {
    return function (url) {
        if (!url)
            return null;
        if (url.startsWith('http://') || url.startsWith('https://'))
            return url;
        var relPath = url;
        if (!relPath.startsWith('/uploads/')) {
            relPath = relPath.startsWith('uploads/') ? "/".concat(relPath) : "/uploads/".concat(relPath.startsWith('/') ? relPath.slice(1) : relPath);
        }
        var host = request.headers.host || request.hostname;
        return "".concat(request.protocol, "://").concat(host).concat(relPath);
    };
};
// Helper: try to extract userId from JWT (optional auth — no error if missing/invalid)
var getAuthData = function (request) {
    var userId = null;
    var profileId = request.headers['x-profile-id'] || null;
    var userPlan = 'free';
    try {
        var authHeader = request.headers.authorization;
        if (authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer ')) {
            var server = request.server;
            var decoded = server.jwt.verify(authHeader.slice(7));
            userId = (decoded === null || decoded === void 0 ? void 0 : decoded.id) || null;
            userPlan = (decoded === null || decoded === void 0 ? void 0 : decoded.plan) || 'free';
        }
    }
    catch (_a) { }
    return { userId: userId, profileId: profileId, userPlan: userPlan };
};
// Helper function to map content items — resolveUrl converts all image/video paths to full URLs
var mapContentItem = function (item, type, resolveUrl, episodeCount, firstEpisode, likeCount, isLikedByUser) {
    var _a, _b;
    if (episodeCount === void 0) { episodeCount = 0; }
    if (likeCount === void 0) { likeCount = 0; }
    if (isLikedByUser === void 0) { isLikedByUser = false; }
    return ({
        id: item._id.toString(),
        title: item.title,
        description: item.description,
        shortDescription: item.shortDescription,
        thumbnail: resolveUrl(item.thumbnail),
        bannerImage: resolveUrl(item.bannerImage),
        posterImage: resolveUrl(item.posterImage),
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
        // Preview video info — only first episode (short-drama reel style)
        videoUrl: resolveUrl((firstEpisode === null || firstEpisode === void 0 ? void 0 : firstEpisode.hlsUrl) || item.hlsUrl || null),
        trailerUrl: resolveUrl((firstEpisode === null || firstEpisode === void 0 ? void 0 : firstEpisode.trailerUrl) || item.trailerUrl || null),
        firstEpisodeId: ((_a = firstEpisode === null || firstEpisode === void 0 ? void 0 : firstEpisode._id) === null || _a === void 0 ? void 0 : _a.toString()) || null,
        firstEpisodeTitle: (firstEpisode === null || firstEpisode === void 0 ? void 0 : firstEpisode.title) || null,
        firstEpisodeThumbnail: resolveUrl((firstEpisode === null || firstEpisode === void 0 ? void 0 : firstEpisode.thumbnail) || item.thumbnail || null),
        firstEpisodeDuration: (firstEpisode === null || firstEpisode === void 0 ? void 0 : firstEpisode.duration) || null,
        firstEpisodeIsFree: (_b = firstEpisode === null || firstEpisode === void 0 ? void 0 : firstEpisode.isFree) !== null && _b !== void 0 ? _b : null,
        contentPlan: item.planRequired || item.plan || 'free',
    });
};
var populateBannersContent = function (banners) { return __awaiter(void 0, void 0, void 0, function () {
    var contentIds, _a, movies, contents, contentMap, _i, movies_1, movie, _b, contents_1, content, _c, banners_1, banner;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                contentIds = banners.map(function (b) { return b.contentId; }).filter(Boolean);
                if (contentIds.length === 0)
                    return [2 /*return*/, banners];
                return [4 /*yield*/, Promise.all([
                        Movie_1.MovieModel.find({ _id: { $in: contentIds } })
                            .populate('languages', 'name')
                            .populate('genres', 'name')
                            .lean(),
                        Content_1.ContentModel.find({ _id: { $in: contentIds } })
                            .populate('languages', 'name')
                            .populate('genres', 'name')
                            .lean(),
                    ])];
            case 1:
                _a = _d.sent(), movies = _a[0], contents = _a[1];
                contentMap = new Map();
                for (_i = 0, movies_1 = movies; _i < movies_1.length; _i++) {
                    movie = movies_1[_i];
                    contentMap.set(movie._id.toString(), __assign(__assign({}, movie), { type: 'movie' }));
                }
                for (_b = 0, contents_1 = contents; _b < contents_1.length; _b++) {
                    content = contents_1[_b];
                    contentMap.set(content._id.toString(), __assign(__assign({}, content), { type: content.type || 'series' }));
                }
                // Assign populated content back to banner
                for (_c = 0, banners_1 = banners; _c < banners_1.length; _c++) {
                    banner = banners_1[_c];
                    if (banner.contentId) {
                        banner.contentId = contentMap.get(banner.contentId.toString()) || null;
                    }
                }
                return [2 /*return*/, banners];
        }
    });
}); };
// Helper function to map banner — resolveUrl converts all image paths to full URLs
var mapBanner = function (banner, resolveUrl, episodeCount, firstEpisode, likeCount, isLikedByUser) {
    var _a, _b;
    if (episodeCount === void 0) { episodeCount = 0; }
    if (likeCount === void 0) { likeCount = 0; }
    if (isLikedByUser === void 0) { isLikedByUser = false; }
    var content = banner.contentId;
    var thumbnail = resolveUrl((content === null || content === void 0 ? void 0 : content.thumbnail) || banner.imageUrl);
    return {
        id: banner._id.toString(),
        title: banner.title,
        subtitle: banner.subtitle,
        description: banner.description,
        thumbnail: thumbnail,
        imageUrl: resolveUrl(banner.imageUrl),
        mobileImageUrl: resolveUrl(banner.mobileImageUrl),
        ctaText: banner.ctaText,
        ctaLink: banner.ctaLink,
        contentId: (_b = (_a = banner.contentId) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString(),
        content: content ? mapContentItem(content, content.contentType === 'drama' ? 'drama' : (content.type || banner.contentType || 'series'), resolveUrl, episodeCount, firstEpisode, likeCount, isLikedByUser) : undefined,
        type: banner.type,
        contentType: banner.contentType,
        position: banner.position,
        isActive: banner.isActive,
        targetPlatforms: banner.targetPlatforms || [],
        startDate: banner.startDate,
        endDate: banner.endDate,
    };
};
// Helper function: Fallback sections (only if no sections in DB)
var getFallbackSections = function (tab) {
    var fallbacks = {
        drama: [
            { key: 'top-10-story-tv', title: 'Top 10 on Story TV', category: 'Top 10', sortBy: { views: -1 }, limit: 10, layout: 'horizontal' },
            { key: 'just-launched', title: 'Just Launched', category: 'Recently Added', filter: { isNewContent: true }, sortBy: { createdAt: -1 }, limit: 10, layout: 'horizontal' },
            { key: 'trending-dramas', title: 'Trending Dramas', category: 'Trending', filter: { trending: true }, sortBy: { views: -1 }, limit: 10, layout: 'vertical' },
            { key: 'featured-dramas', title: 'Featured Dramas', category: 'Featured', filter: { featured: true }, sortBy: { createdAt: -1 }, limit: 10, layout: 'grid-2' },
        ],
        movie: [
            { key: 'featured', title: 'Featured', category: 'Featured', filter: { featured: true }, sortBy: { createdAt: -1 }, limit: 10, layout: 'horizontal' },
            { key: 'top-movies', title: 'Top Movies', category: 'Top Rated', sortBy: { views: -1 }, limit: 10, layout: 'vertical' },
        ],
    };
    return fallbacks[tab];
};
// Get home page data — sections/layout only (banners are separate via GET /api/app/banners)
var getHomePage = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var query, platform, tab_1, limit, _a, userId, profileId, resolveUrl_1, preferredLanguage, user, targetLanguageId_1, langDoc, dbSections, sectionsToFetch, sectionPromises, sectionsWithContent, watchProgressList, queryParams, rawProgressList, seenContentIds, _i, rawProgressList_1, progress, cid, validSections, allContentIdsSet_1, allContentIds, firstEpisodeMap_1, episodeCountMap_1, firstEpisodes, episodeCounts, likedContentIdSet_1, userLikes, mappedSections, continueWatchingShows, contentIds, items, itemsMap_1, _b, watchProgressList_1, progress, item, cid, likeCount, isLikedByUser, mapped, episodeCount, firstEpisode, appSetting, tabName, tabConfig, error_1;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 20, , 21]);
                query = request.query;
                platform = query.platform || 'mobile';
                tab_1 = query.tab || 'drama';
                limit = Math.min(20, Math.max(1, Number(query.limit || 10)));
                _a = getAuthData(request), userId = _a.userId, profileId = _a.profileId;
                resolveUrl_1 = buildUrlResolver(request);
                preferredLanguage = 'Hindi';
                if (!userId) return [3 /*break*/, 2];
                return [4 /*yield*/, User_1.UserModel.findById(userId).select('preferredLanguage languageSelectionSkipped').lean()];
            case 1:
                user = _d.sent();
                if (user) {
                    if (user.preferredLanguage) {
                        preferredLanguage = user.preferredLanguage;
                    }
                    else if (user.languageSelectionSkipped) {
                        preferredLanguage = 'Hindi';
                    }
                }
                _d.label = 2;
            case 2:
                targetLanguageId_1 = null;
                if (!preferredLanguage) return [3 /*break*/, 4];
                return [4 /*yield*/, Language_1.LanguageModel.findOne({ name: new RegExp("^".concat(preferredLanguage, "$"), 'i') }).lean()];
            case 3:
                langDoc = _d.sent();
                if (langDoc) {
                    targetLanguageId_1 = langDoc._id;
                }
                _d.label = 4;
            case 4: return [4 /*yield*/, Section_1.SectionModel.find({
                    contentType: { $in: [tab_1, 'mixed'] }, isActive: true
                })
                    .select('key title category contentType sortBy limit position isActive layout showViewAll itemType filter contentSelection manualContentIds')
                    .sort({ position: 1 })
                    .lean()];
            case 5:
                dbSections = _d.sent();
                sectionsToFetch = dbSections.length > 0 ? dbSections : getFallbackSections(tab_1);
                sectionPromises = sectionsToFetch.map(function (section) { return __awaiter(void 0, void 0, void 0, function () {
                    var content, manualIds, hasManual, buildFilter, baseFilter, filter, baseMovieFilter, baseSeriesFilter, filterMovie, filterSeries, movies, series, combined, sortKey_1, sortDir_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                content = [];
                                manualIds = section.manualContentIds || [];
                                hasManual = manualIds.length > 0;
                                buildFilter = function (base) {
                                    var sectionFilter = __assign({}, (section.filter || {}));
                                    // Handle custom mediaType filter for dynamic content
                                    if (sectionFilter.mediaType) {
                                        var isSeriesBase = base.type === 'series';
                                        if (sectionFilter.mediaType === 'movie' && isSeriesBase)
                                            return null;
                                        if (sectionFilter.mediaType === 'series' && !isSeriesBase)
                                            return null;
                                        delete sectionFilter.mediaType;
                                    }
                                    var manualBase = { status: 'published' };
                                    if (section.contentSelection === 'manual') {
                                        return hasManual ? __assign(__assign({}, manualBase), { _id: { $in: manualIds } }) : null;
                                    }
                                    else if (section.contentSelection === 'mixed' && hasManual) {
                                        return {
                                            $or: [
                                                __assign(__assign({}, base), sectionFilter),
                                                __assign(__assign({}, manualBase), { _id: { $in: manualIds } })
                                            ]
                                        };
                                    }
                                    else {
                                        return __assign(__assign({}, base), sectionFilter);
                                    }
                                };
                                if (!(tab_1 === 'drama')) return [3 /*break*/, 3];
                                baseFilter = { type: 'series', status: 'published', contentType: 'drama' };
                                if (targetLanguageId_1) {
                                    baseFilter.languages = targetLanguageId_1;
                                }
                                filter = buildFilter(baseFilter);
                                if (!filter) return [3 /*break*/, 2];
                                return [4 /*yield*/, Content_1.ContentModel.find(filter)
                                        .sort(section.sortBy)
                                        .limit(section.limit)
                                        .populate('languages', 'name')
                                        .populate('genres', 'name')
                                        .lean()];
                            case 1:
                                content = _a.sent();
                                _a.label = 2;
                            case 2: return [3 /*break*/, 8];
                            case 3:
                                baseMovieFilter = { status: 'published' };
                                baseSeriesFilter = { type: 'series', status: 'published', contentType: 'series' };
                                if (targetLanguageId_1) {
                                    baseMovieFilter.languages = targetLanguageId_1;
                                    baseSeriesFilter.languages = targetLanguageId_1;
                                }
                                filterMovie = buildFilter(baseMovieFilter);
                                filterSeries = buildFilter(baseSeriesFilter);
                                movies = [];
                                series = [];
                                if (!filterMovie) return [3 /*break*/, 5];
                                return [4 /*yield*/, Movie_1.MovieModel.find(filterMovie)
                                        .sort(section.sortBy)
                                        .limit(section.limit)
                                        .populate('languages', 'name')
                                        .populate('genres', 'name')
                                        .lean()];
                            case 4:
                                movies = _a.sent();
                                _a.label = 5;
                            case 5:
                                if (!filterSeries) return [3 /*break*/, 7];
                                return [4 /*yield*/, Content_1.ContentModel.find(filterSeries)
                                        .sort(section.sortBy)
                                        .limit(section.limit)
                                        .populate('languages', 'name')
                                        .populate('genres', 'name')
                                        .lean()];
                            case 6:
                                series = _a.sent();
                                _a.label = 7;
                            case 7:
                                combined = __spreadArray(__spreadArray([], movies, true), series, true);
                                sortKey_1 = Object.keys(section.sortBy || {})[0] || 'createdAt';
                                sortDir_1 = section.sortBy[sortKey_1] === 1 ? 1 : -1;
                                combined.sort(function (a, b) {
                                    var valA = a[sortKey_1] || 0;
                                    var valB = b[sortKey_1] || 0;
                                    if (valA < valB)
                                        return -1 * sortDir_1;
                                    if (valA > valB)
                                        return 1 * sortDir_1;
                                    return 0;
                                });
                                content = combined.slice(0, section.limit);
                                _a.label = 8;
                            case 8:
                                if (content.length === 0) {
                                    return [2 /*return*/, null];
                                }
                                return [2 /*return*/, __assign(__assign({}, section), { content: content })];
                        }
                    });
                }); });
                return [4 /*yield*/, Promise.all(sectionPromises)];
            case 6:
                sectionsWithContent = _d.sent();
                watchProgressList = [];
                if (!userId) return [3 /*break*/, 8];
                queryParams = {
                    userId: userId,
                    contentModelType: tab_1 === 'movie' ? 'Movie' : 'Content',
                };
                if (profileId) {
                    queryParams.profileId = profileId;
                }
                return [4 /*yield*/, UserWatchProgress_1.UserWatchProgressModel.find(queryParams)
                        .sort({ lastWatchedAt: -1 })
                        .limit(50) // Fetch more to allow for deduplication
                        .populate('episodeId')
                        .lean()];
            case 7:
                rawProgressList = _d.sent();
                seenContentIds = new Set();
                for (_i = 0, rawProgressList_1 = rawProgressList; _i < rawProgressList_1.length; _i++) {
                    progress = rawProgressList_1[_i];
                    if (!progress.contentId)
                        continue;
                    cid = progress.contentId.toString();
                    if (!seenContentIds.has(cid)) {
                        watchProgressList.push(progress);
                        seenContentIds.add(cid);
                    }
                    if (watchProgressList.length >= 10)
                        break;
                }
                _d.label = 8;
            case 8:
                validSections = sectionsWithContent.filter(function (s) { return s !== null; });
                allContentIdsSet_1 = new Set();
                validSections.forEach(function (s) { return s.content.forEach(function (c) { return allContentIdsSet_1.add(c._id.toString()); }); });
                watchProgressList.forEach(function (p) { if (p.contentId)
                    allContentIdsSet_1.add(p.contentId.toString()); });
                allContentIds = Array.from(allContentIdsSet_1).map(function (id) { return new mongoose_1.default.Types.ObjectId(id); });
                firstEpisodeMap_1 = new Map();
                episodeCountMap_1 = new Map();
                if (!(tab_1 === 'drama' && allContentIds.length > 0)) return [3 /*break*/, 11];
                return [4 /*yield*/, Episode_1.EpisodeModel.aggregate([
                        {
                            $match: {
                                contentId: { $in: allContentIds },
                                season: 1,
                                episode: 1,
                                processingStatus: 'ready',
                            },
                        },
                        { $sort: { season: 1, episode: 1 } },
                    ])];
            case 9:
                firstEpisodes = _d.sent();
                firstEpisodes.forEach(function (e) { return firstEpisodeMap_1.set(e.contentId.toString(), e); });
                return [4 /*yield*/, Episode_1.EpisodeModel.aggregate([
                        { $match: { contentId: { $in: allContentIds } } },
                        { $group: { _id: '$contentId', count: { $sum: 1 } } },
                    ])];
            case 10:
                episodeCounts = _d.sent();
                episodeCounts.forEach(function (e) { return episodeCountMap_1.set(e._id.toString(), e.count); });
                _d.label = 11;
            case 11:
                likedContentIdSet_1 = new Set();
                if (!(userId && allContentIds.length > 0)) return [3 /*break*/, 13];
                return [4 /*yield*/, UserLike_1.UserLikeModel.find({
                        userId: userId,
                        contentId: { $in: allContentIds },
                    }).select('contentId').lean()];
            case 12:
                userLikes = _d.sent();
                userLikes.forEach(function (l) { return likedContentIdSet_1.add(l.contentId.toString()); });
                _d.label = 13;
            case 13:
                mappedSections = validSections.map(function (section) { return ({
                    key: section.key,
                    title: section.title,
                    category: section.category,
                    layout: section.layout || 'horizontal',
                    showViewAll: section.showViewAll !== false,
                    itemType: section.itemType || 'poster',
                    shows: section.content.map(function (item) {
                        var cid = item._id.toString();
                        var likeCount = item.likes || 0;
                        var isLikedByUser = likedContentIdSet_1.has(cid);
                        if (tab_1 === 'drama') {
                            var episodeCount = episodeCountMap_1.get(cid) || 0;
                            var firstEpisode = firstEpisodeMap_1.get(cid);
                            return mapContentItem(item, 'drama', resolveUrl_1, episodeCount, firstEpisode, likeCount, isLikedByUser);
                        }
                        else {
                            return mapContentItem(item, 'movie', resolveUrl_1, 0, undefined, likeCount, isLikedByUser);
                        }
                    }),
                }); });
                continueWatchingShows = [];
                if (!(watchProgressList.length > 0)) return [3 /*break*/, 18];
                contentIds = watchProgressList.map(function (p) { return p.contentId; });
                items = [];
                if (!(tab_1 === 'movie')) return [3 /*break*/, 15];
                return [4 /*yield*/, Movie_1.MovieModel.find({ _id: { $in: contentIds } }).lean()];
            case 14:
                items = _d.sent();
                return [3 /*break*/, 17];
            case 15: return [4 /*yield*/, Content_1.ContentModel.find({ _id: { $in: contentIds } }).lean()];
            case 16:
                items = _d.sent();
                _d.label = 17;
            case 17:
                itemsMap_1 = new Map();
                items.forEach(function (item) { return itemsMap_1.set(item._id.toString(), item); });
                for (_b = 0, watchProgressList_1 = watchProgressList; _b < watchProgressList_1.length; _b++) {
                    progress = watchProgressList_1[_b];
                    item = itemsMap_1.get(progress.contentId.toString());
                    if (!item)
                        continue;
                    cid = item._id.toString();
                    likeCount = item.likes || 0;
                    isLikedByUser = likedContentIdSet_1.has(cid);
                    mapped = void 0;
                    if (tab_1 === 'drama') {
                        episodeCount = episodeCountMap_1.get(cid) || 0;
                        firstEpisode = firstEpisodeMap_1.get(cid);
                        mapped = mapContentItem(item, 'drama', resolveUrl_1, episodeCount, firstEpisode, likeCount, isLikedByUser);
                    }
                    else {
                        mapped = mapContentItem(item, 'movie', resolveUrl_1, 0, undefined, likeCount, isLikedByUser);
                    }
                    // Inject watch progress detail
                    mapped.watchProgress = {
                        progressSeconds: progress.progressSeconds,
                        durationSeconds: progress.durationSeconds,
                        progressPercent: progress.progressPercent,
                        lastWatchedAt: progress.lastWatchedAt,
                        episodeId: progress.episodeId ? (_c = progress.episodeId._id) === null || _c === void 0 ? void 0 : _c.toString() : null,
                        episodeNumber: progress.episodeId ? progress.episodeId.episode : null,
                        season: progress.episodeId ? progress.episodeId.season : null,
                        episodeTitle: progress.episodeId ? progress.episodeId.title : null,
                    };
                    continueWatchingShows.push(mapped);
                }
                _d.label = 18;
            case 18:
                if (continueWatchingShows.length > 0) {
                    mappedSections.unshift({
                        key: 'continue-watching',
                        title: 'Continue Watching',
                        category: 'Continue Watching',
                        layout: 'horizontal',
                        showViewAll: false,
                        itemType: 'poster',
                        shows: continueWatchingShows,
                    });
                }
                return [4 /*yield*/, AppSetting_1.AppSettingModel.findOne({ key: 'home-tabs-config' }).lean()];
            case 19:
                appSetting = _d.sent();
                tabName = tab_1 === 'drama' ? 'Short Dramas' : 'Movies & Series';
                if (appSetting && appSetting.value && Array.isArray(appSetting.value)) {
                    tabConfig = appSetting.value.find(function (t) { return t.id === tab_1; });
                    if (tabConfig && tabConfig.name) {
                        tabName = tabConfig.name;
                    }
                }
                return [2 /*return*/, reply.send({
                        success: true,
                        data: {
                            tab: tab_1,
                            tabName: tabName,
                            sections: mappedSections,
                        },
                    })];
            case 20:
                error_1 = _d.sent();
                logger_1.logger.error({ error: error_1 }, 'Error getting home page data');
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error', error: error_1.stack })];
            case 21: return [2 /*return*/];
        }
    });
}); };
exports.getHomePage = getHomePage;
// ── GET App Banners (separate from home layout) ────────────────────────────
var getAppBanners = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var query, tab, platform, limit, now, resolveUrl_2, contentTypeFilter, bannersRaw, banners, userId, allContentIds, firstEpisodeMap_2, episodeCountMap_2, _a, firstEpisodes, episodeCounts, likedContentIdSet_2, userLikes, mappedBanners, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                query = request.query;
                tab = query.tab || 'drama';
                platform = query.platform || 'mobile';
                limit = Math.min(20, Math.max(1, Number(query.limit || 10)));
                now = new Date();
                resolveUrl_2 = buildUrlResolver(request);
                contentTypeFilter = tab === 'both'
                    ? { contentType: { $in: ['drama', 'movie', 'both'] } }
                    : { contentType: { $in: [tab, 'both'] } };
                return [4 /*yield*/, Banner_1.BannerModel.find(__assign(__assign({ isActive: true, targetPlatforms: platform }, contentTypeFilter), { $and: [
                            { $or: [{ startDate: { $exists: false } }, { startDate: { $lte: now } }] },
                            { $or: [{ endDate: { $exists: false } }, { endDate: { $gte: now } }] },
                        ] }))
                        .sort({ position: 1, createdAt: -1 })
                        .limit(limit)
                        .lean()];
            case 1:
                bannersRaw = _b.sent();
                return [4 /*yield*/, populateBannersContent(bannersRaw)];
            case 2:
                banners = _b.sent();
                // Strict filtering based on the actual populated content
                if (tab === 'drama') {
                    banners = banners.filter(function (b) {
                        if (!b.contentId)
                            return true;
                        return b.contentId.contentType === 'drama';
                    });
                }
                else if (tab === 'movie') {
                    banners = banners.filter(function (b) {
                        if (!b.contentId)
                            return true;
                        var contentType = b.contentId.contentType;
                        var type = b.contentId.type;
                        return type === 'movie' || contentType === 'series';
                    });
                }
                userId = getAuthData(request).userId;
                allContentIds = banners
                    .filter(function (b) { return b.contentId; })
                    .map(function (b) { return new mongoose_1.default.Types.ObjectId(b.contentId._id.toString()); });
                firstEpisodeMap_2 = new Map();
                episodeCountMap_2 = new Map();
                if (!(allContentIds.length > 0)) return [3 /*break*/, 4];
                return [4 /*yield*/, Promise.all([
                        Episode_1.EpisodeModel.aggregate([
                            { $match: { contentId: { $in: allContentIds }, season: 1, episode: 1, processingStatus: 'ready' } },
                            { $sort: { season: 1, episode: 1 } },
                        ]),
                        Episode_1.EpisodeModel.aggregate([
                            { $match: { contentId: { $in: allContentIds } } },
                            { $group: { _id: '$contentId', count: { $sum: 1 } } },
                        ]),
                    ])];
            case 3:
                _a = _b.sent(), firstEpisodes = _a[0], episodeCounts = _a[1];
                firstEpisodes.forEach(function (e) { return firstEpisodeMap_2.set(e.contentId.toString(), e); });
                episodeCounts.forEach(function (e) { return episodeCountMap_2.set(e._id.toString(), e.count); });
                _b.label = 4;
            case 4:
                likedContentIdSet_2 = new Set();
                if (!(userId && allContentIds.length > 0)) return [3 /*break*/, 6];
                return [4 /*yield*/, UserLike_1.UserLikeModel.find({ userId: userId, contentId: { $in: allContentIds } }).select('contentId').lean()];
            case 5:
                userLikes = _b.sent();
                userLikes.forEach(function (l) { return likedContentIdSet_2.add(l.contentId.toString()); });
                _b.label = 6;
            case 6:
                mappedBanners = banners.map(function (banner) {
                    if (!banner.contentId)
                        return mapBanner(banner, resolveUrl_2);
                    var cid = banner.contentId._id.toString();
                    var likeCount = banner.contentId.likes || 0;
                    var isLikedByUser = likedContentIdSet_2.has(cid);
                    var episodeCount = episodeCountMap_2.get(cid) || 0;
                    var firstEpisode = firstEpisodeMap_2.get(cid);
                    return mapBanner(banner, resolveUrl_2, episodeCount, firstEpisode, likeCount, isLikedByUser);
                });
                return [2 /*return*/, reply.send({
                        success: true,
                        data: {
                            tab: tab,
                            banners: mappedBanners,
                        },
                    })];
            case 7:
                error_2 = _b.sent();
                logger_1.logger.error({ error: error_2 }, 'Error getting app banners');
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error', error: error_2.message })];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.getAppBanners = getAppBanners;
