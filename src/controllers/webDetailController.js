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
exports.getWebDetail = void 0;
var Movie_1 = require("../models/Movie");
var Content_1 = require("../models/Content");
var Episode_1 = require("../models/Episode");
var logger_1 = require("../lib/logger");
var context_1 = require("../lib/context");
var User_1 = require("../models/User");
var UnlockedEpisode_1 = require("../models/UnlockedEpisode");
var getWebDetail = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var contentId, query, typeHint, item, isMovie, hours, minutes, durationFormatted, genreNames, languageNames, hlsUrl, qualities, videoSettings, playbackSpeeds, cast, crew, crewMembers, type_1, mappedItem, episodes, eps, userCtx, isSubscribed_1, unlockedEpisodeIds_1, dbUser, unlocked, related, primaryGenreId, Model, relatedRaw, error_1;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 17, , 18]);
                contentId = request.params.contentId;
                query = request.query;
                typeHint = query.type;
                item = void 0;
                isMovie = false;
                if (!(typeHint === 'movie')) return [3 /*break*/, 2];
                return [4 /*yield*/, Movie_1.MovieModel.findById(contentId)
                        .populate('genres', 'name')
                        .populate('languages', 'name')
                        .populate('cast.actor', 'name image designation')
                        .populate('crew.director', 'name image designation')
                        .lean()];
            case 1:
                item = _d.sent();
                isMovie = true;
                return [3 /*break*/, 8];
            case 2:
                if (!(typeHint === 'show' || typeHint === 'drama')) return [3 /*break*/, 4];
                return [4 /*yield*/, Content_1.ContentModel.findById(contentId)
                        .populate('genres', 'name')
                        .populate('languages', 'name')
                        .populate('cast.actor', 'name image designation')
                        .populate('crew.director', 'name image designation')
                        .populate('crewMembers.crewMember', 'name image designation')
                        .lean()];
            case 3:
                item = _d.sent();
                return [3 /*break*/, 8];
            case 4: return [4 /*yield*/, Movie_1.MovieModel.findById(contentId)
                    .populate('genres', 'name')
                    .populate('languages', 'name')
                    .populate('cast.actor', 'name image designation')
                    .populate('crew.director', 'name image designation')
                    .lean()];
            case 5:
                // Try movie first
                item = _d.sent();
                if (!item) return [3 /*break*/, 6];
                isMovie = true;
                return [3 /*break*/, 8];
            case 6: return [4 /*yield*/, Content_1.ContentModel.findById(contentId)
                    .populate('genres', 'name')
                    .populate('languages', 'name')
                    .populate('cast.actor', 'name image designation')
                    .populate('crew.director', 'name image designation')
                    .populate('crewMembers.crewMember', 'name image designation')
                    .lean()];
            case 7:
                item = _d.sent();
                _d.label = 8;
            case 8:
                if (!item) {
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'Content not found' })];
                }
                hours = item.duration ? Math.floor(item.duration / 3600) : 0;
                minutes = item.duration ? Math.floor((item.duration % 3600) / 60) : 0;
                durationFormatted = item.duration
                    ? hours > 0 ? "".concat(hours, "h ").concat(minutes, "m") : "".concat(minutes, "m")
                    : null;
                genreNames = (item.genres || []).map(function (g) { return (g === null || g === void 0 ? void 0 : g.name) || g; });
                languageNames = (item.languages || []).map(function (l) { return (l === null || l === void 0 ? void 0 : l.name) || l; });
                hlsUrl = isMovie ? (item.hlsUrl || item.videoUrl) : undefined;
                qualities = item.videoQualities || [];
                videoSettings = hlsUrl
                    ? __spreadArray([
                        { key: 'auto', label: 'Auto', description: 'Adjusts quality automatically', url: hlsUrl }
                    ], qualities.map(function (q) {
                        var sizeMB = q.size ? "".concat(Math.round(q.size / (1024 * 1024)), " MB") : 'N/A';
                        return {
                            key: q.quality,
                            label: q.quality === '4k' ? '4K' : q.quality.toUpperCase(),
                            description: "".concat(q.quality.toUpperCase(), " quality option (").concat(sizeMB, ")"),
                            url: q.url,
                        };
                    }), true) : null;
                playbackSpeeds = [
                    { value: 0.75, label: '0.75x' },
                    { value: 1.0, label: 'Normal' },
                    { value: 1.25, label: '1.25x' },
                    { value: 1.5, label: '1.5x' },
                    { value: 1.75, label: '1.75x' },
                    { value: 2.0, label: '2.0x' }
                ];
                cast = (item.cast || []).map(function (c) {
                    var _a, _b, _c, _d, _e, _f;
                    return ({
                        id: ((_b = (_a = c.actor) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString()) || null,
                        name: ((_c = c.actor) === null || _c === void 0 ? void 0 : _c.name) || 'Unknown',
                        image: ((_d = c.actor) === null || _d === void 0 ? void 0 : _d.image) || ((_e = c.actor) === null || _e === void 0 ? void 0 : _e.avatar) || null,
                        designation: ((_f = c.actor) === null || _f === void 0 ? void 0 : _f.designation) || null,
                        role: c.role || 'Actor',
                        character: c.character || null,
                    });
                });
                crew = (item.crew || []).map(function (c) {
                    var _a, _b, _c, _d, _e;
                    return ({
                        id: ((_b = (_a = c.director) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString()) || null,
                        name: ((_c = c.director) === null || _c === void 0 ? void 0 : _c.name) || 'Unknown',
                        image: ((_d = c.director) === null || _d === void 0 ? void 0 : _d.image) || null,
                        designation: ((_e = c.director) === null || _e === void 0 ? void 0 : _e.designation) || null,
                        role: c.role || 'Director',
                    });
                });
                crewMembers = (item.crewMembers || []).map(function (c) {
                    var _a, _b, _c, _d, _e;
                    return ({
                        id: ((_b = (_a = c.crewMember) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString()) || null,
                        name: ((_c = c.crewMember) === null || _c === void 0 ? void 0 : _c.name) || 'Unknown',
                        image: ((_d = c.crewMember) === null || _d === void 0 ? void 0 : _d.image) || null,
                        designation: ((_e = c.crewMember) === null || _e === void 0 ? void 0 : _e.designation) || null,
                        role: c.role || 'Crew',
                    });
                });
                type_1 = isMovie ? 'movie' : 'show';
                mappedItem = {
                    id: item._id.toString(),
                    title: item.title,
                    originalTitle: item.originalTitle || null,
                    poster: item.posterImage || item.thumbnail || '',
                    backdrop: item.bannerImage || item.thumbnail || '',
                    type: type_1,
                    contentType: isMovie ? 'movie' : (item.contentType || 'series'),
                    playerType: isMovie || item.contentType === 'series' ? 'standard' : 'shorts',
                    year: ((_a = item.year) === null || _a === void 0 ? void 0 : _a.toString()) || new Date(item.createdAt).getFullYear().toString(),
                    duration: item.duration ? "".concat(item.duration, "m") : '120m',
                    durationFormatted: durationFormatted,
                    imdbRating: ((_b = item.imdbRating) === null || _b === void 0 ? void 0 : _b.toString()) || (item.rating || '8.0'),
                    ageRating: item.ageRating ? "".concat(item.ageRating, "+") : 'U/A 13+',
                    description: item.description || item.shortDescription || '',
                    shortDescription: item.shortDescription || null,
                    language: languageNames.length > 0 ? languageNames.join(', ') : 'EN',
                    languages: languageNames,
                    genres: genreNames,
                    genresText: genreNames.join(' & '),
                    seasons: type_1 === 'show' ? item.seasons || 1 : undefined,
                    trailerUrl: item.trailerUrl,
                    videoUrl: hlsUrl,
                    hlsUrl: hlsUrl,
                    videoSettings: videoSettings,
                    playbackSpeeds: playbackSpeeds,
                    cast: cast,
                    directors: crew.filter(function (c) { return c.role === 'Director'; }).map(function (c) { return c.name; }),
                    crew: crew,
                    crewMembers: crewMembers,
                    country: item.country || null,
                    studio: item.studio || null,
                    producer: item.producer || null,
                    tags: item.tags || [],
                    isLocked: item.planRequired !== 'free',
                    planRequired: item.planRequired || 'free',
                    episodeMeta: "HD \u2022 ".concat(genreNames.join(', '), " \u2022 ").concat(durationFormatted || 'N/A'),
                    isExclusive: item.isExclusive || false,
                    featured: item.featured || false,
                    trending: item.trending || false,
                    releaseDate: item.releaseDate || null,
                };
                episodes = [];
                if (!!isMovie) return [3 /*break*/, 14];
                return [4 /*yield*/, Episode_1.EpisodeModel.find({ contentId: item._id })
                        .sort({ season: 1, episode: 1 })
                        .select('title description thumbnail hlsUrl sourceVideoUrl duration season episode isFree isLocked coinsRequired videoQualities')
                        .lean()];
            case 9:
                eps = _d.sent();
                userCtx = (_c = context_1.requestContext.getStore()) === null || _c === void 0 ? void 0 : _c.user;
                isSubscribed_1 = false;
                unlockedEpisodeIds_1 = new Set();
                if (!userCtx) return [3 /*break*/, 13];
                return [4 /*yield*/, User_1.UserModel.findById(userCtx.id).select('subscriptionStatus')];
            case 10:
                dbUser = _d.sent();
                if (!((dbUser === null || dbUser === void 0 ? void 0 : dbUser.subscriptionStatus) === 'active')) return [3 /*break*/, 11];
                isSubscribed_1 = true;
                return [3 /*break*/, 13];
            case 11: return [4 /*yield*/, UnlockedEpisode_1.UnlockedEpisodeModel.find({ userId: userCtx.id }).select('episodeId').lean()];
            case 12:
                unlocked = _d.sent();
                unlocked.forEach(function (u) { return unlockedEpisodeIds_1.add(u.episodeId.toString()); });
                _d.label = 13;
            case 13:
                episodes = eps.map(function (e) {
                    var _a;
                    var epHlsUrl = e.hlsUrl || e.sourceVideoUrl;
                    var isLocked = (_a = e.isLocked) !== null && _a !== void 0 ? _a : !e.isFree;
                    // Determine if user has access
                    var hasAccess = false;
                    if (!isLocked || e.isFree)
                        hasAccess = true;
                    else if (isSubscribed_1)
                        hasAccess = true;
                    else if (unlockedEpisodeIds_1.has(e._id.toString()))
                        hasAccess = true;
                    if (!hasAccess) {
                        epHlsUrl = null; // Hide the URL
                    }
                    var epQualities = e.videoQualities || [];
                    var epVideoSettings = epHlsUrl
                        ? __spreadArray([
                            { key: 'auto', label: 'Auto', description: 'Adjusts quality automatically', url: epHlsUrl }
                        ], epQualities.map(function (q) {
                            var sizeMB = q.size ? "".concat(Math.round(q.size / (1024 * 1024)), " MB") : 'N/A';
                            return {
                                key: q.quality,
                                label: q.quality === '4k' ? '4K' : q.quality.toUpperCase(),
                                description: "".concat(q.quality.toUpperCase(), " quality option (").concat(sizeMB, ")"),
                                url: q.url,
                            };
                        }), true) : null;
                    return {
                        id: e._id.toString(),
                        title: e.title,
                        description: e.description,
                        thumbnail: e.thumbnail,
                        videoUrl: epHlsUrl,
                        hlsUrl: epHlsUrl,
                        duration: e.duration ? "".concat(e.duration, "m") : '0m',
                        season: e.season,
                        episode: e.episode,
                        isFree: e.isFree,
                        isLocked: isLocked,
                        isLockedForUser: !hasAccess,
                        coinsRequired: e.coinsRequired || 0,
                        videoSettings: epVideoSettings,
                    };
                });
                _d.label = 14;
            case 14:
                related = [];
                if (!(item.genres && item.genres.length > 0)) return [3 /*break*/, 16];
                primaryGenreId = item.genres[0]._id;
                Model = (isMovie ? Movie_1.MovieModel : Content_1.ContentModel);
                return [4 /*yield*/, Model.find({ genres: primaryGenreId, _id: { $ne: item._id }, status: 'published' })
                        .sort({ views: -1 })
                        .limit(5)
                        .select('title thumbnail posterImage bannerImage year rating ageRating duration imdbRating isNewContent featured trending views createdAt')
                        .lean()];
            case 15:
                relatedRaw = _d.sent();
                related = relatedRaw.map(function (r) {
                    var _a, _b;
                    return ({
                        id: r._id.toString(),
                        title: r.title,
                        poster: r.posterImage || r.thumbnail || '',
                        type: type_1,
                        year: ((_a = r.year) === null || _a === void 0 ? void 0 : _a.toString()) || new Date(r.createdAt).getFullYear().toString(),
                        duration: r.duration ? "".concat(r.duration, "m") : '120m',
                        imdbRating: ((_b = r.imdbRating) === null || _b === void 0 ? void 0 : _b.toString()) || (r.rating || '8.0'),
                        ageRating: r.ageRating ? "".concat(r.ageRating, "+") : 'U/A 13+',
                    });
                });
                _d.label = 16;
            case 16: return [2 /*return*/, reply.send({
                    success: true,
                    data: __assign(__assign({}, mappedItem), { episodes: episodes, related: related }),
                })];
            case 17:
                error_1 = _d.sent();
                logger_1.logger.error({ error: error_1 }, 'Error fetching web detail API data');
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error', error: error_1.message })];
            case 18: return [2 /*return*/];
        }
    });
}); };
exports.getWebDetail = getWebDetail;
