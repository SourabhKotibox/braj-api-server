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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var health_1 = __importDefault(require("./health"));
var auth_1 = __importDefault(require("./auth"));
var appAuth_1 = __importDefault(require("./appAuth"));
var users_1 = __importDefault(require("./users"));
var languages_1 = __importDefault(require("./languages"));
var promotions_1 = __importDefault(require("./promotions"));
var banners_1 = __importDefault(require("./banners"));
var settings_1 = __importDefault(require("./settings"));
var genres_1 = __importDefault(require("./genres"));
var pages_1 = __importDefault(require("./pages"));
var faqs_1 = __importDefault(require("./faqs"));
var actors_1 = __importDefault(require("./actors"));
var directors_1 = __importDefault(require("./directors"));
var notificationLogs_1 = __importDefault(require("./notificationLogs"));
var subscriptionPlans_1 = __importDefault(require("./subscriptionPlans"));
var planLimits_1 = __importDefault(require("./planLimits"));
var subscriptions_1 = __importDefault(require("./subscriptions"));
var categories_1 = __importDefault(require("./categories"));
var notificationTemplates_1 = __importDefault(require("./notificationTemplates"));
var media_1 = __importDefault(require("./media"));
var appSettings_1 = __importDefault(require("./appSettings"));
var dashboard_1 = __importDefault(require("./dashboard"));
var movie_1 = __importDefault(require("./movie"));
var audio_1 = __importDefault(require("./audio"));
var audioArtists_1 = __importDefault(require("./audioArtists"));
var audioAlbums_1 = __importDefault(require("./audioAlbums"));
var mobile_1 = __importDefault(require("./mobile"));
var videoMusic_1 = __importDefault(require("./videoMusic"));
var adminUsers_1 = __importDefault(require("./adminUsers"));
var sections_1 = __importDefault(require("./sections"));
var contents_1 = __importDefault(require("./contents"));
var episodes_1 = __importDefault(require("./episodes"));
var countries_1 = __importDefault(require("./countries"));
var crews_1 = __importDefault(require("./crews"));
var like_1 = __importDefault(require("./like"));
var watch_1 = __importDefault(require("./watch"));
var share_1 = __importDefault(require("./share"));
var wishlist_1 = __importDefault(require("./wishlist"));
var appProfile_1 = __importDefault(require("./appProfile"));
var download_1 = __importDefault(require("./download"));
var webDownload_1 = __importDefault(require("./webDownload"));
var watchProgress_1 = __importDefault(require("./watchProgress"));
var rewardRoutes_1 = __importDefault(require("./rewardRoutes"));
var appNotificationRoutes_1 = __importDefault(require("./appNotificationRoutes"));
var appHomeController_1 = require("../controllers/appHomeController");
var appHomeController_2 = require("../controllers/appHomeController");
var exploreController_1 = require("../controllers/exploreController");
var searchController_1 = require("../controllers/searchController");
var webHomeController_1 = require("../controllers/webHomeController");
var webBrowseController_1 = require("../controllers/webBrowseController");
var webDetailController_1 = require("../controllers/webDetailController");
var appMovieController_1 = require("../controllers/appMovieController");
var appSeriesController_1 = require("../controllers/appSeriesController");
var ad_1 = __importDefault(require("./ad"));
var adminNotifications_1 = __importDefault(require("./adminNotifications"));
var review_1 = __importDefault(require("./review"));
var views_1 = __importDefault(require("./views"));
var walletRoutes_1 = __importDefault(require("./walletRoutes"));
var router = function (fastify) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        fastify.register(walletRoutes_1.default, { prefix: '/wallet' });
        fastify.register(views_1.default);
        fastify.register(review_1.default);
        fastify.register(adminNotifications_1.default, { prefix: '/admin-notifications' });
        fastify.register(ad_1.default);
        fastify.register(health_1.default);
        fastify.register(auth_1.default);
        fastify.register(appAuth_1.default);
        fastify.register(users_1.default);
        fastify.register(languages_1.default, { prefix: '/languages' });
        fastify.register(promotions_1.default);
        fastify.register(banners_1.default);
        fastify.register(settings_1.default);
        fastify.register(genres_1.default, { prefix: '/genres' });
        fastify.register(pages_1.default, { prefix: '/pages' });
        fastify.register(faqs_1.default, { prefix: '/faqs' });
        fastify.register(actors_1.default, { prefix: '/actors' });
        fastify.register(directors_1.default, { prefix: '/directors' });
        fastify.register(notificationLogs_1.default, { prefix: '/notification-logs' });
        fastify.register(subscriptionPlans_1.default, { prefix: '/subscription-plans' });
        fastify.register(planLimits_1.default, { prefix: '/plan-limits' });
        fastify.register(subscriptions_1.default);
        fastify.register(categories_1.default, { prefix: '/categories' });
        fastify.register(notificationTemplates_1.default, { prefix: '/notification-templates' });
        fastify.register(media_1.default, { prefix: '/media' });
        fastify.register(appSettings_1.default, { prefix: '/app-settings' });
        fastify.register(dashboard_1.default);
        fastify.register(movie_1.default, { prefix: '/movies' });
        fastify.register(audio_1.default, { prefix: '/audio' });
        fastify.register(audioArtists_1.default, { prefix: '/audio-artists' });
        fastify.register(audioAlbums_1.default, { prefix: '/audio-albums' });
        fastify.register(mobile_1.default);
        fastify.register(videoMusic_1.default, { prefix: '/video-music' });
        fastify.register(adminUsers_1.default, { prefix: '/admin-users' });
        // Public audio/video routes (no auth required)
        fastify.get('/public/audio/related', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
            var AudioModel, _a, id, limit, audio, relatedLimit, filter, query, related, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../models/Audio')); })];
                    case 1:
                        AudioModel = (_b.sent()).AudioModel;
                        _a = request.query, id = _a.id, limit = _a.limit;
                        if (!id) {
                            return [2 /*return*/, reply.status(400).send({ success: false, error: 'id query parameter is required' })];
                        }
                        return [4 /*yield*/, AudioModel.findById(id).lean()];
                    case 2:
                        audio = _b.sent();
                        if (!audio) {
                            return [2 /*return*/, reply.status(404).send({ success: false, error: 'Audio not found' })];
                        }
                        relatedLimit = Math.min(20, Math.max(1, Number(limit || 10)));
                        filter = {
                            status: 'published',
                            _id: { $ne: audio._id },
                            $or: [],
                        };
                        if (audio.artist) {
                            filter.$or.push({ artist: audio.artist });
                        }
                        if (audio.genre) {
                            filter.$or.push({ genre: audio.genre });
                        }
                        if (audio.tags && audio.tags.length > 0) {
                            filter.$or.push({ tags: { $in: audio.tags } });
                        }
                        query = filter.$or.length > 0 ? filter : { status: 'published', _id: { $ne: audio._id } };
                        return [4 /*yield*/, AudioModel.find(query)
                                .sort({ views: -1, createdAt: -1 })
                                .limit(relatedLimit)
                                .lean()];
                    case 3:
                        related = _b.sent();
                        return [2 /*return*/, reply.send({
                                success: true,
                                data: related.map(function (a) { var _a; return (__assign(__assign({}, a), { id: (_a = a._id) === null || _a === void 0 ? void 0 : _a.toString() })); }),
                            })];
                    case 4:
                        error_1 = _b.sent();
                        return [2 /*return*/, reply.status(500).send({ success: false, error: error_1.message })];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
        fastify.get('/public/video-music/related', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
            var VideoMusicModel, _a, id, limit, video, relatedLimit, filter, query, related, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../models/VideoMusic')); })];
                    case 1:
                        VideoMusicModel = (_b.sent()).VideoMusicModel;
                        _a = request.query, id = _a.id, limit = _a.limit;
                        if (!id) {
                            return [2 /*return*/, reply.status(400).send({ success: false, error: 'id query parameter is required' })];
                        }
                        return [4 /*yield*/, VideoMusicModel.findById(id).lean()];
                    case 2:
                        video = _b.sent();
                        if (!video) {
                            return [2 /*return*/, reply.status(404).send({ success: false, error: 'Video not found' })];
                        }
                        relatedLimit = Math.min(20, Math.max(1, Number(limit || 10)));
                        filter = {
                            status: 'published',
                            _id: { $ne: video._id },
                            $or: [],
                        };
                        if (video.artist) {
                            filter.$or.push({ artist: video.artist });
                        }
                        if (video.genre) {
                            filter.$or.push({ genre: video.genre });
                        }
                        if (video.tags && video.tags.length > 0) {
                            filter.$or.push({ tags: { $in: video.tags } });
                        }
                        query = filter.$or.length > 0 ? filter : { status: 'published', _id: { $ne: video._id } };
                        return [4 /*yield*/, VideoMusicModel.find(query)
                                .sort({ views: -1, createdAt: -1 })
                                .limit(relatedLimit)
                                .lean()];
                    case 3:
                        related = _b.sent();
                        return [2 /*return*/, reply.send({
                                success: true,
                                data: related.map(function (v) { var _a; return (__assign(__assign({}, v), { id: (_a = v._id) === null || _a === void 0 ? void 0 : _a.toString() })); }),
                            })];
                    case 4:
                        error_2 = _b.sent();
                        return [2 /*return*/, reply.status(500).send({ success: false, error: error_2.message })];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
        fastify.get('/public/audio', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
            var AudioModel, query, page, limit, filter, _a, audios, total, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../models/Audio')); })];
                    case 1:
                        AudioModel = (_b.sent()).AudioModel;
                        query = request.query;
                        page = Math.max(1, Number(query.page || 1));
                        limit = Math.min(100, Math.max(1, Number(query.limit || 20)));
                        filter = { status: 'published' };
                        if (query.search) {
                            filter.$or = [
                                { title: new RegExp(query.search, 'i') },
                                { artist: new RegExp(query.search, 'i') },
                            ];
                        }
                        if (query.featured === 'true')
                            filter.featured = true;
                        if (query.trending === 'true')
                            filter.trending = true;
                        if (query.genre)
                            filter.genre = query.genre;
                        if (query.category)
                            filter.category = query.category;
                        if (query.language)
                            filter.language = query.language;
                        if (query.artist)
                            filter.artist = new RegExp(query.artist, 'i');
                        if (query.album)
                            filter.album = new RegExp(query.album, 'i');
                        return [4 /*yield*/, Promise.all([
                                AudioModel.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
                                AudioModel.countDocuments(filter),
                            ])];
                    case 2:
                        _a = _b.sent(), audios = _a[0], total = _a[1];
                        return [2 /*return*/, reply.send({ success: true, data: audios.map(function (a) { var _a; return (__assign(__assign({}, a), { id: (_a = a._id) === null || _a === void 0 ? void 0 : _a.toString() })); }), pagination: { page: page, limit: limit, total: total, pages: Math.ceil(total / limit) } })];
                    case 3:
                        error_3 = _b.sent();
                        return [2 /*return*/, reply.status(500).send({ success: false, error: error_3.message })];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        // Get unique artists
        fastify.get('/public/audio/artists', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
            var AudioModel, artists, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../models/Audio')); })];
                    case 1:
                        AudioModel = (_a.sent()).AudioModel;
                        return [4 /*yield*/, AudioModel.distinct('artist', { status: 'published' })];
                    case 2:
                        artists = _a.sent();
                        return [2 /*return*/, reply.send({ success: true, data: artists.filter(Boolean).sort() })];
                    case 3:
                        error_4 = _a.sent();
                        return [2 /*return*/, reply.status(500).send({ success: false, error: error_4.message })];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        // Get unique albums
        fastify.get('/public/audio/albums', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
            var AudioModel, albums, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../models/Audio')); })];
                    case 1:
                        AudioModel = (_a.sent()).AudioModel;
                        return [4 /*yield*/, AudioModel.distinct('album', { status: 'published' })];
                    case 2:
                        albums = _a.sent();
                        return [2 /*return*/, reply.send({ success: true, data: albums.filter(Boolean).sort() })];
                    case 3:
                        error_5 = _a.sent();
                        return [2 /*return*/, reply.status(500).send({ success: false, error: error_5.message })];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        // Get audio by artist
        fastify.get('/public/audio/artist/:artist', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
            var AudioModel, artist, query, page, limit, filter, _a, audios, total, error_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../models/Audio')); })];
                    case 1:
                        AudioModel = (_b.sent()).AudioModel;
                        artist = request.params.artist;
                        query = request.query;
                        page = Math.max(1, Number(query.page || 1));
                        limit = Math.min(100, Math.max(1, Number(query.limit || 20)));
                        filter = { status: 'published', artist: new RegExp(artist, 'i') };
                        return [4 /*yield*/, Promise.all([
                                AudioModel.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
                                AudioModel.countDocuments(filter),
                            ])];
                    case 2:
                        _a = _b.sent(), audios = _a[0], total = _a[1];
                        return [2 /*return*/, reply.send({ success: true, data: audios.map(function (a) { var _a; return (__assign(__assign({}, a), { id: (_a = a._id) === null || _a === void 0 ? void 0 : _a.toString() })); }), pagination: { page: page, limit: limit, total: total, pages: Math.ceil(total / limit) } })];
                    case 3:
                        error_6 = _b.sent();
                        return [2 /*return*/, reply.status(500).send({ success: false, error: error_6.message })];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        // Get audio by album
        fastify.get('/public/audio/album/:album', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
            var AudioModel, album, query, page, limit, filter, _a, audios, total, error_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../models/Audio')); })];
                    case 1:
                        AudioModel = (_b.sent()).AudioModel;
                        album = request.params.album;
                        query = request.query;
                        page = Math.max(1, Number(query.page || 1));
                        limit = Math.min(100, Math.max(1, Number(query.limit || 20)));
                        filter = { status: 'published', album: new RegExp(album, 'i') };
                        return [4 /*yield*/, Promise.all([
                                AudioModel.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
                                AudioModel.countDocuments(filter),
                            ])];
                    case 2:
                        _a = _b.sent(), audios = _a[0], total = _a[1];
                        return [2 /*return*/, reply.send({ success: true, data: audios.map(function (a) { var _a; return (__assign(__assign({}, a), { id: (_a = a._id) === null || _a === void 0 ? void 0 : _a.toString() })); }), pagination: { page: page, limit: limit, total: total, pages: Math.ceil(total / limit) } })];
                    case 3:
                        error_7 = _b.sent();
                        return [2 /*return*/, reply.status(500).send({ success: false, error: error_7.message })];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        fastify.get('/public/audio/:id', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
            var AudioModel, id, audio, error_8;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../models/Audio')); })];
                    case 1:
                        AudioModel = (_b.sent()).AudioModel;
                        id = request.params.id;
                        return [4 /*yield*/, AudioModel.findById(id).lean()];
                    case 2:
                        audio = _b.sent();
                        if (!audio)
                            return [2 /*return*/, reply.status(404).send({ success: false, error: 'Not found' })];
                        return [2 /*return*/, reply.send({ success: true, data: __assign(__assign({}, audio), { id: (_a = audio._id) === null || _a === void 0 ? void 0 : _a.toString() }) })];
                    case 3:
                        error_8 = _b.sent();
                        return [2 /*return*/, reply.status(500).send({ success: false, error: error_8.message })];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        fastify.get('/public/video-music', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
            var VideoMusicModel, query, page, limit, filter, _a, videos, total, error_9;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../models/VideoMusic')); })];
                    case 1:
                        VideoMusicModel = (_b.sent()).VideoMusicModel;
                        query = request.query;
                        page = Math.max(1, Number(query.page || 1));
                        limit = Math.min(100, Math.max(1, Number(query.limit || 20)));
                        filter = { status: 'published' };
                        if (query.search) {
                            filter.$or = [
                                { title: new RegExp(query.search, 'i') },
                                { artist: new RegExp(query.search, 'i') },
                            ];
                        }
                        if (query.featured === 'true')
                            filter.featured = true;
                        if (query.trending === 'true')
                            filter.trending = true;
                        if (query.genre)
                            filter.genre = query.genre;
                        if (query.category)
                            filter.category = query.category;
                        if (query.language)
                            filter.language = query.language;
                        if (query.artist)
                            filter.artist = new RegExp(query.artist, 'i');
                        if (query.album)
                            filter.album = new RegExp(query.album, 'i');
                        return [4 /*yield*/, Promise.all([
                                VideoMusicModel.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
                                VideoMusicModel.countDocuments(filter),
                            ])];
                    case 2:
                        _a = _b.sent(), videos = _a[0], total = _a[1];
                        return [2 /*return*/, reply.send({ success: true, data: videos.map(function (v) { var _a; return (__assign(__assign({}, v), { id: (_a = v._id) === null || _a === void 0 ? void 0 : _a.toString() })); }), pagination: { page: page, limit: limit, total: total, pages: Math.ceil(total / limit) } })];
                    case 3:
                        error_9 = _b.sent();
                        return [2 /*return*/, reply.status(500).send({ success: false, error: error_9.message })];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        // Get unique artists for video music
        fastify.get('/public/video-music/artists', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
            var VideoMusicModel, artists, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../models/VideoMusic')); })];
                    case 1:
                        VideoMusicModel = (_a.sent()).VideoMusicModel;
                        return [4 /*yield*/, VideoMusicModel.distinct('artist', { status: 'published' })];
                    case 2:
                        artists = _a.sent();
                        return [2 /*return*/, reply.send({ success: true, data: artists.filter(Boolean).sort() })];
                    case 3:
                        error_10 = _a.sent();
                        return [2 /*return*/, reply.status(500).send({ success: false, error: error_10.message })];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        // Get unique albums for video music
        fastify.get('/public/video-music/albums', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
            var VideoMusicModel, albums, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../models/VideoMusic')); })];
                    case 1:
                        VideoMusicModel = (_a.sent()).VideoMusicModel;
                        return [4 /*yield*/, VideoMusicModel.distinct('album', { status: 'published' })];
                    case 2:
                        albums = _a.sent();
                        return [2 /*return*/, reply.send({ success: true, data: albums.filter(Boolean).sort() })];
                    case 3:
                        error_11 = _a.sent();
                        return [2 /*return*/, reply.status(500).send({ success: false, error: error_11.message })];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        // Get video music by artist
        fastify.get('/public/video-music/artist/:artist', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
            var VideoMusicModel, artist, query, page, limit, filter, _a, videos, total, error_12;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../models/VideoMusic')); })];
                    case 1:
                        VideoMusicModel = (_b.sent()).VideoMusicModel;
                        artist = request.params.artist;
                        query = request.query;
                        page = Math.max(1, Number(query.page || 1));
                        limit = Math.min(100, Math.max(1, Number(query.limit || 20)));
                        filter = { status: 'published', artist: new RegExp(artist, 'i') };
                        return [4 /*yield*/, Promise.all([
                                VideoMusicModel.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
                                VideoMusicModel.countDocuments(filter),
                            ])];
                    case 2:
                        _a = _b.sent(), videos = _a[0], total = _a[1];
                        return [2 /*return*/, reply.send({ success: true, data: videos.map(function (v) { var _a; return (__assign(__assign({}, v), { id: (_a = v._id) === null || _a === void 0 ? void 0 : _a.toString() })); }), pagination: { page: page, limit: limit, total: total, pages: Math.ceil(total / limit) } })];
                    case 3:
                        error_12 = _b.sent();
                        return [2 /*return*/, reply.status(500).send({ success: false, error: error_12.message })];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        // Get video music by album
        fastify.get('/public/video-music/album/:album', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
            var VideoMusicModel, album, query, page, limit, filter, _a, videos, total, error_13;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../models/VideoMusic')); })];
                    case 1:
                        VideoMusicModel = (_b.sent()).VideoMusicModel;
                        album = request.params.album;
                        query = request.query;
                        page = Math.max(1, Number(query.page || 1));
                        limit = Math.min(100, Math.max(1, Number(query.limit || 20)));
                        filter = { status: 'published', album: new RegExp(album, 'i') };
                        return [4 /*yield*/, Promise.all([
                                VideoMusicModel.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
                                VideoMusicModel.countDocuments(filter),
                            ])];
                    case 2:
                        _a = _b.sent(), videos = _a[0], total = _a[1];
                        return [2 /*return*/, reply.send({ success: true, data: videos.map(function (v) { var _a; return (__assign(__assign({}, v), { id: (_a = v._id) === null || _a === void 0 ? void 0 : _a.toString() })); }), pagination: { page: page, limit: limit, total: total, pages: Math.ceil(total / limit) } })];
                    case 3:
                        error_13 = _b.sent();
                        return [2 /*return*/, reply.status(500).send({ success: false, error: error_13.message })];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        fastify.get('/public/video-music/:id', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
            var VideoMusicModel, id, video, error_14;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../models/VideoMusic')); })];
                    case 1:
                        VideoMusicModel = (_b.sent()).VideoMusicModel;
                        id = request.params.id;
                        return [4 /*yield*/, VideoMusicModel.findById(id).lean()];
                    case 2:
                        video = _b.sent();
                        if (!video)
                            return [2 /*return*/, reply.status(404).send({ success: false, error: 'Not found' })];
                        return [2 /*return*/, reply.send({ success: true, data: __assign(__assign({}, video), { id: (_a = video._id) === null || _a === void 0 ? void 0 : _a.toString() }) })];
                    case 3:
                        error_14 = _b.sent();
                        return [2 /*return*/, reply.status(500).send({ success: false, error: error_14.message })];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        // Audio normalization endpoint
        fastify.post('/audio/normalize', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
            var _a, audioUrl, targetLoudness, truePeak, loudnessRange, normalizeAudio, result, error_15;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        _a = request.body, audioUrl = _a.audioUrl, targetLoudness = _a.targetLoudness, truePeak = _a.truePeak, loudnessRange = _a.loudnessRange;
                        if (!audioUrl) {
                            return [2 /*return*/, reply.status(400).send({ success: false, error: 'audioUrl is required' })];
                        }
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../lib/audioNormalization')); })];
                    case 1:
                        normalizeAudio = (_b.sent()).normalizeAudio;
                        return [4 /*yield*/, normalizeAudio(audioUrl, {
                                targetLoudness: targetLoudness ? Number(targetLoudness) : undefined,
                                truePeak: truePeak ? Number(truePeak) : undefined,
                                loudnessRange: loudnessRange ? Number(loudnessRange) : undefined,
                            })];
                    case 2:
                        result = _b.sent();
                        return [2 /*return*/, reply.send(result)];
                    case 3:
                        error_15 = _b.sent();
                        return [2 /*return*/, reply.status(500).send({ success: false, error: error_15.message })];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        // Audio loudness analysis endpoint
        fastify.post('/audio/analyze', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
            var audioUrl, analyzeAudioLoudness, loudnessInfo, error_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        audioUrl = request.body.audioUrl;
                        if (!audioUrl) {
                            return [2 /*return*/, reply.status(400).send({ success: false, error: 'audioUrl is required' })];
                        }
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../lib/audioNormalization')); })];
                    case 1:
                        analyzeAudioLoudness = (_a.sent()).analyzeAudioLoudness;
                        return [4 /*yield*/, analyzeAudioLoudness(audioUrl)];
                    case 2:
                        loudnessInfo = _a.sent();
                        return [2 /*return*/, reply.send({ success: true, data: loudnessInfo })];
                    case 3:
                        error_16 = _a.sent();
                        return [2 /*return*/, reply.status(500).send({ success: false, error: error_16.message })];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        // ─── Public Like/Wishlist/Share/Download for Audio/Video Music ───────────────
        fastify.post('/public/audio/:id/like', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
            var AudioModel, id, audio, error_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../models/Audio')); })];
                    case 1:
                        AudioModel = (_a.sent()).AudioModel;
                        id = request.params.id;
                        return [4 /*yield*/, AudioModel.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { returnDocument: 'after' }).select('likes').lean()];
                    case 2:
                        audio = _a.sent();
                        if (!audio)
                            return [2 /*return*/, reply.status(404).send({ success: false, error: 'Audio not found' })];
                        return [2 /*return*/, reply.send({ success: true, data: { likes: audio.likes, isLiked: true } })];
                    case 3:
                        error_17 = _a.sent();
                        return [2 /*return*/, reply.status(500).send({ success: false, error: error_17.message })];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        fastify.post('/public/video-music/:id/like', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
            var VideoMusicModel, id, video, error_18;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../models/VideoMusic')); })];
                    case 1:
                        VideoMusicModel = (_a.sent()).VideoMusicModel;
                        id = request.params.id;
                        return [4 /*yield*/, VideoMusicModel.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { returnDocument: 'after' }).select('likes').lean()];
                    case 2:
                        video = _a.sent();
                        if (!video)
                            return [2 /*return*/, reply.status(404).send({ success: false, error: 'Video not found' })];
                        return [2 /*return*/, reply.send({ success: true, data: { likes: video.likes, isLiked: true } })];
                    case 3:
                        error_18 = _a.sent();
                        return [2 /*return*/, reply.status(500).send({ success: false, error: error_18.message })];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        fastify.post('/public/audio/:id/share', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
            var AudioModel, id, audio, error_19;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../models/Audio')); })];
                    case 1:
                        AudioModel = (_b.sent()).AudioModel;
                        id = request.params.id;
                        return [4 /*yield*/, AudioModel.findByIdAndUpdate(id, { $inc: { shares: 1 } }, { returnDocument: 'after' }).select('shares').lean()];
                    case 2:
                        audio = _b.sent();
                        return [2 /*return*/, reply.send({ success: true, data: { shares: (_a = audio === null || audio === void 0 ? void 0 : audio.shares) !== null && _a !== void 0 ? _a : 1 } })];
                    case 3:
                        error_19 = _b.sent();
                        return [2 /*return*/, reply.status(500).send({ success: false, error: error_19.message })];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        fastify.post('/public/video-music/:id/share', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
            var VideoMusicModel, id, video, error_20;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../models/VideoMusic')); })];
                    case 1:
                        VideoMusicModel = (_b.sent()).VideoMusicModel;
                        id = request.params.id;
                        return [4 /*yield*/, VideoMusicModel.findByIdAndUpdate(id, { $inc: { shares: 1 } }, { returnDocument: 'after' }).select('shares').lean()];
                    case 2:
                        video = _b.sent();
                        return [2 /*return*/, reply.send({ success: true, data: { shares: (_a = video === null || video === void 0 ? void 0 : video.shares) !== null && _a !== void 0 ? _a : 1 } })];
                    case 3:
                        error_20 = _b.sent();
                        return [2 /*return*/, reply.status(500).send({ success: false, error: error_20.message })];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        // Direct download endpoint (triggers file download)
        fastify.get('/public/download', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
            var _a, url, filename;
            return __generator(this, function (_b) {
                try {
                    _a = request.query, url = _a.url, filename = _a.filename;
                    if (!url)
                        return [2 /*return*/, reply.status(400).send({ success: false, error: 'URL is required' })];
                    reply.header('Content-Disposition', "attachment; filename=\"".concat(filename || 'download.mp3', "\""));
                    reply.header('Content-Type', 'application/octet-stream');
                    reply.redirect(url);
                }
                catch (error) {
                    return [2 /*return*/, reply.status(500).send({ success: false, error: error.message })];
                }
                return [2 /*return*/];
            });
        }); });
        fastify.register(sections_1.default, { prefix: '/sections' });
        fastify.register(contents_1.default, { prefix: '/contents' });
        fastify.register(episodes_1.default, { prefix: '/episodes' });
        fastify.register(countries_1.default, { prefix: '/countries' });
        fastify.register(crews_1.default, { prefix: '/crews' });
        // Like / Unlike route
        fastify.register(like_1.default);
        // Watch page route (video player + episodes + lock/unlock)
        fastify.register(watch_1.default);
        // Smart Deep Link Share route
        fastify.register(share_1.default);
        // Wishlist route
        fastify.register(wishlist_1.default, { prefix: '/app' });
        // App Profile / Settings route
        fastify.register(appProfile_1.default, { prefix: '/app' });
        // Download routes (POST /download, GET /downloads, DELETE /downloads/:id)
        fastify.register(download_1.default, { prefix: '/app' });
        // Web download routes — separate from app, no subscription gate
        fastify.register(webDownload_1.default, { prefix: '/web' });
        // Watch progress routes (POST /watch/progress, DELETE /watch/progress/:contentId)
        fastify.register(watchProgress_1.default, { prefix: '/app' });
        // Rewards routes
        fastify.register(rewardRoutes_1.default, { prefix: '/app/rewards' });
        // App Notifications routes
        fastify.register(appNotificationRoutes_1.default, { prefix: '/app/notifications' });
        // Mobile movie detail page
        fastify.get('/app/movies/:id', appMovieController_1.getMovieDetail);
        // Mobile series detail page (includes seasons and episodes)
        fastify.get('/app/series/:id', appSeriesController_1.getSeriesDetail);
        // Home page route for app (layout/sections only — no banners)
        fastify.get('/home', appHomeController_1.getHomePage);
        // App Banners — separate from home layout
        // ?tab=drama   → drama banners only
        // ?tab=movie   → movie banners only
        // ?tab=both    → all banners
        fastify.get('/app/banners', appHomeController_2.getAppBanners);
        // Explore page (infinite scroll)
        fastify.get('/explore', exploreController_1.getExplore);
        // Search page (trending keywords + query results)
        fastify.get('/search', searchController_1.getSearchPage);
        // Web Homepage aggregated data
        fastify.get('/web-home', webHomeController_1.getWebHome);
        // Web all content for dynamic sections
        fastify.get('/web-all-content', webHomeController_1.getWebAllContent);
        // Web Browse paginated data
        fastify.get('/web-browse', webBrowseController_1.getWebBrowse);
        // Web Detail page data
        fastify.get('/web-detail/:contentId', webDetailController_1.getWebDetail);
        // Public banners by page (for music, videos, movies, tvshows)
        fastify.get('/public/banners', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
            var BannerModel, _a, page, limit, now, pageNum, limitNum, filter, _b, banners, total, contentIds_1, _c, movies, contents, audios, videoMusics, contentMap_1, _i, movies_1, movie, _d, contents_2, content, _e, audios_1, audio, _f, videoMusics_1, vm, populatedBanners, error_21;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        _g.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../models/Banner')); })];
                    case 1:
                        BannerModel = (_g.sent()).BannerModel;
                        _a = request.query, page = _a.page, limit = _a.limit;
                        now = new Date();
                        pageNum = Math.max(1, Number(page || 1));
                        limitNum = Math.min(50, Math.max(1, Number(limit || 10)));
                        filter = {
                            isActive: true,
                            $and: [
                                { $or: [{ startDate: { $exists: false } }, { startDate: { $lte: now } }] },
                                { $or: [{ endDate: { $exists: false } }, { endDate: { $gte: now } }] },
                            ],
                        };
                        // Filter by target page if specified
                        if (page) {
                            filter.targetPages = { $in: [page] };
                        }
                        return [4 /*yield*/, Promise.all([
                                BannerModel.find(filter)
                                    .sort({ position: 1, createdAt: -1 })
                                    .skip((pageNum - 1) * limitNum)
                                    .limit(limitNum)
                                    .lean(),
                                BannerModel.countDocuments(filter),
                            ])];
                    case 2:
                        _b = _g.sent(), banners = _b[0], total = _b[1];
                        contentIds_1 = banners.map(function (b) { return b.contentId; }).filter(Boolean);
                        return [4 /*yield*/, Promise.all([
                                Promise.resolve().then(function () { return __importStar(require('../models/Movie')); }).then(function (m) { return m.MovieModel.find({ _id: { $in: contentIds_1 } }).lean(); }),
                                Promise.resolve().then(function () { return __importStar(require('../models/Content')); }).then(function (m) { return m.ContentModel.find({ _id: { $in: contentIds_1 } }).lean(); }),
                                Promise.resolve().then(function () { return __importStar(require('../models/Audio')); }).then(function (m) { return m.AudioModel.find({ _id: { $in: contentIds_1 } }).lean(); }),
                                Promise.resolve().then(function () { return __importStar(require('../models/VideoMusic')); }).then(function (m) { return m.VideoMusicModel.find({ _id: { $in: contentIds_1 } }).lean(); }),
                            ])];
                    case 3:
                        _c = _g.sent(), movies = _c[0], contents = _c[1], audios = _c[2], videoMusics = _c[3];
                        contentMap_1 = new Map();
                        for (_i = 0, movies_1 = movies; _i < movies_1.length; _i++) {
                            movie = movies_1[_i];
                            contentMap_1.set(movie._id.toString(), __assign(__assign({}, movie), { type: 'movie' }));
                        }
                        for (_d = 0, contents_2 = contents; _d < contents_2.length; _d++) {
                            content = contents_2[_d];
                            contentMap_1.set(content._id.toString(), __assign(__assign({}, content), { type: content.contentType || 'series' }));
                        }
                        for (_e = 0, audios_1 = audios; _e < audios_1.length; _e++) {
                            audio = audios_1[_e];
                            contentMap_1.set(audio._id.toString(), __assign(__assign({}, audio), { type: 'audio' }));
                        }
                        for (_f = 0, videoMusics_1 = videoMusics; _f < videoMusics_1.length; _f++) {
                            vm = videoMusics_1[_f];
                            contentMap_1.set(vm._id.toString(), __assign(__assign({}, vm), { type: 'video-music' }));
                        }
                        populatedBanners = banners.map(function (banner) { return ({
                            id: banner._id.toString(),
                            title: banner.title,
                            subtitle: banner.subtitle,
                            description: banner.description,
                            imageUrl: banner.imageUrl,
                            mobileImageUrl: banner.mobileImageUrl,
                            ctaText: banner.ctaText,
                            ctaLink: banner.ctaLink,
                            position: banner.position,
                            type: banner.type,
                            contentType: banner.contentType,
                            content: banner.contentId ? contentMap_1.get(banner.contentId.toString()) || null : null,
                        }); });
                        return [2 /*return*/, reply.send({
                                success: true,
                                data: populatedBanners,
                                pagination: { page: pageNum, limit: limitNum, total: total, pages: Math.ceil(total / limitNum) },
                            })];
                    case 4:
                        error_21 = _g.sent();
                        return [2 /*return*/, reply.status(500).send({ success: false, error: error_21.message })];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
        // Public notifications (broadcast only — no private user data)
        fastify.get('/public/notifications', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
            var NotificationLogModel, notifications, error_22;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../models/NotificationLog')); })];
                    case 1:
                        NotificationLogModel = (_a.sent()).NotificationLogModel;
                        return [4 /*yield*/, NotificationLogModel.find({ type: { $in: ['all', 'broadcast', 'announcement', 'promo'] } })
                                .sort({ createdAt: -1 })
                                .limit(10)
                                .select('title text type createdAt')
                                .lean()];
                    case 2:
                        notifications = _a.sent();
                        return [2 /*return*/, reply.send({ success: true, data: notifications })];
                    case 3:
                        error_22 = _a.sent();
                        return [2 /*return*/, reply.status(500).send({ success: false, error: error_22.message })];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); };
exports.default = router;
