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
exports.getWebBrowse = void 0;
var Movie_1 = require("../models/Movie");
var Content_1 = require("../models/Content");
var Genre_1 = require("../models/Genre");
var logger_1 = require("../lib/logger");
// Standardized mapping for website ContentItem
var mapContentItem = function (item, type, queryContentType) {
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
        type: type,
        contentType: queryContentType || (type === 'movie' ? 'movie' : (item.contentType || 'series')),
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
var browseCache = new Map();
var BROWSE_CACHE_TTL = 30000; // 30 seconds
var getWebBrowse = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var query, cacheKey, now, cached, contentType_1, genreName, searchTerm, section, page, limit, skip, filter, genre, sort, selectFields, rawItems, total, _a, movies, shows, totalMovies, totalShows, allItems, Model, items, responseData, error_1;
    var _b;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 7, , 8]);
                query = request.query;
                cacheKey = JSON.stringify(query);
                now = Date.now();
                if (browseCache.has(cacheKey)) {
                    cached = browseCache.get(cacheKey);
                    if (now - cached.time < BROWSE_CACHE_TTL) {
                        return [2 /*return*/, reply.send(cached.data)];
                    }
                    browseCache.delete(cacheKey); // clear expired
                }
                contentType_1 = query.type || 'movie';
                genreName = query.genre;
                searchTerm = (_c = query.search) === null || _c === void 0 ? void 0 : _c.trim();
                section = query.section;
                page = Math.max(1, Number(query.page || 1));
                limit = Math.min(50, Math.max(1, Number(query.limit || 20)));
                skip = (page - 1) * limit;
                filter = { status: 'published' };
                if (searchTerm) {
                    filter.$or = [
                        { title: new RegExp(searchTerm, 'i') },
                        { description: new RegExp(searchTerm, 'i') },
                        { tags: new RegExp(searchTerm, 'i') },
                    ];
                }
                if (!(genreName && genreName.toLowerCase() !== 'all')) return [3 /*break*/, 2];
                return [4 /*yield*/, Genre_1.GenreModel.findOne({ name: { $regex: new RegExp("^".concat(genreName, "$"), 'i') } }).select('_id').lean()];
            case 1:
                genre = _d.sent();
                if (genre) {
                    filter.genres = genre._id;
                }
                else {
                    return [2 /*return*/, reply.send({
                            success: true,
                            data: { items: [], pagination: { total: 0, page: page, limit: limit, totalPages: 0 } },
                        })];
                }
                _d.label = 2;
            case 2:
                sort = { createdAt: -1 };
                if (section === 'trending') {
                    sort = { views: -1, createdAt: -1 };
                    filter.trending = true;
                }
                else if (section === 'new') {
                    sort = { createdAt: -1 };
                    filter.isNewContent = true;
                }
                else if (section === 'top-rated') {
                    sort = { imdbRating: -1, views: -1 };
                }
                selectFields = 'title description shortDescription thumbnail bannerImage posterImage year rating ageRating duration imdbRating featured trending isNewContent views genres languages createdAt contentType';
                rawItems = [];
                total = 0;
                if (!(contentType_1 === 'all')) return [3 /*break*/, 4];
                return [4 /*yield*/, Promise.all([
                        Movie_1.MovieModel.find(filter).sort(sort).limit(skip + limit).select(selectFields).populate('genres', 'name').lean(),
                        Content_1.ContentModel.find(__assign(__assign({}, filter), { status: 'published' })).sort(sort).limit(skip + limit).select(selectFields).populate('genres', 'name').lean(),
                        Movie_1.MovieModel.countDocuments(filter),
                        Content_1.ContentModel.countDocuments(__assign(__assign({}, filter), { status: 'published' }))
                    ])];
            case 3:
                _a = _d.sent(), movies = _a[0], shows = _a[1], totalMovies = _a[2], totalShows = _a[3];
                allItems = __spreadArray(__spreadArray([], movies.map(function (m) { return (__assign(__assign({}, m), { _mappedType: 'movie' })); }), true), shows.map(function (s) { return (__assign(__assign({}, s), { _mappedType: 'show' })); }), true);
                if (section === 'trending')
                    allItems.sort(function (a, b) { return (b.views || 0) - (a.views || 0); });
                else if (section === 'top-rated')
                    allItems.sort(function (a, b) { return (b.imdbRating || 0) - (a.imdbRating || 0); });
                else
                    allItems.sort(function (a, b) { return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); });
                rawItems = allItems.slice(skip, skip + limit);
                total = totalMovies + totalShows;
                return [3 /*break*/, 6];
            case 4:
                Model = void 0;
                if (contentType_1 === 'movie')
                    Model = Movie_1.MovieModel;
                else if (contentType_1 === 'show') {
                    Model = Content_1.ContentModel;
                    filter.type = 'series';
                    filter.contentType = { $ne: 'drama' };
                }
                else if (contentType_1 === 'drama') {
                    Model = Content_1.ContentModel;
                    filter.type = 'series';
                    filter.contentType = 'drama';
                }
                return [4 /*yield*/, Promise.all([
                        Model.find(filter).sort(sort).skip(skip).limit(limit).select(selectFields).populate('genres', 'name').lean(),
                        Model.countDocuments(filter)
                    ])];
            case 5:
                _b = _d.sent(), rawItems = _b[0], total = _b[1];
                _d.label = 6;
            case 6:
                items = rawItems.map(function (item) {
                    var mappedType = item._mappedType || (contentType_1 === 'movie' ? 'movie' : 'show');
                    return mapContentItem(item, mappedType, contentType_1 !== 'all' ? contentType_1 : undefined);
                });
                responseData = {
                    success: true,
                    data: {
                        items: items,
                        pagination: {
                            total: total,
                            page: page,
                            limit: limit,
                            totalPages: Math.ceil(total / limit),
                        },
                    },
                };
                browseCache.set(cacheKey, { time: Date.now(), data: responseData });
                return [2 /*return*/, reply.send(responseData)];
            case 7:
                error_1 = _d.sent();
                logger_1.logger.error({ error: error_1 }, 'Error fetching web browse API data');
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error', error: error_1.message })];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.getWebBrowse = getWebBrowse;
