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
exports.getMovieDetail = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var Movie_1 = require("../models/Movie");
var User_1 = require("../models/User");
var UserLike_1 = require("../models/UserLike");
var UserWishlist_1 = require("../models/UserWishlist");
var UserWatchProgress_1 = require("../models/UserWatchProgress");
var UserDownload_1 = require("../models/UserDownload");
var logger_1 = require("../lib/logger");
var config_1 = require("../lib/config");
var watchController_1 = require("./watchController");
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
// ── GET /api/app/movies/:id ────────────────────────────────────────────────────
// Mobile movie detail page — returns all info needed to render the detail screen
// Optional auth: isLikedByUser and isWishlisted are false for guests
var getMovieDetail = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, userInfo, userId, userPlan, movie, isLikedByUser, isWishlisted, wishlisted, watchProgress, downloaded, isDownloaded, userObjectId, _a, likeDoc, wishlistDoc, progressDoc, downloadDoc, related, genreIds, relatedMovies, cast, crew, hours, minutes, durationFormatted, hlsUrl, qualities, QUALITY_ORDER_1, sortedQualities, videoSettings, genreNames, languageNames, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                id = request.params.id;
                if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                    return [2 /*return*/, reply.status(400).send({ success: false, message: 'Invalid movie ID.' })];
                }
                return [4 /*yield*/, getOptionalUser(request)];
            case 1:
                userInfo = _b.sent();
                userId = (userInfo === null || userInfo === void 0 ? void 0 : userInfo.userId) || null;
                userPlan = (userInfo === null || userInfo === void 0 ? void 0 : userInfo.userPlan) || 'free';
                return [4 /*yield*/, Movie_1.MovieModel.findById(id)
                        .populate('cast.actor', 'name image designation')
                        .populate('crew.director', 'name image designation')
                        .populate('genres', 'name')
                        .populate('languages', 'name')
                        .lean()];
            case 2:
                movie = _b.sent();
                if (!movie || movie.status !== 'published') {
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'Movie not found.' })];
                }
                isLikedByUser = false;
                isWishlisted = false;
                wishlisted = false;
                watchProgress = null;
                downloaded = false;
                isDownloaded = false;
                if (!userId) return [3 /*break*/, 4];
                userObjectId = new mongoose_1.default.Types.ObjectId(userId);
                return [4 /*yield*/, Promise.all([
                        UserLike_1.UserLikeModel.findOne({ userId: userObjectId, contentId: movie._id, episodeId: null }).lean(),
                        UserWishlist_1.UserWishlistModel.findOne({ userId: userObjectId, contentId: movie._id }).lean(),
                        UserWatchProgress_1.UserWatchProgressModel.findOne({ userId: userObjectId, contentId: movie._id, episodeId: null }).lean(),
                        UserDownload_1.UserDownloadModel.findOne({ userId: userObjectId, contentId: movie._id, episodeId: null }).lean(),
                    ])];
            case 3:
                _a = _b.sent(), likeDoc = _a[0], wishlistDoc = _a[1], progressDoc = _a[2], downloadDoc = _a[3];
                isLikedByUser = !!likeDoc;
                isWishlisted = !!wishlistDoc;
                wishlisted = !!wishlistDoc;
                downloaded = !!downloadDoc;
                isDownloaded = !!downloadDoc;
                if (progressDoc) {
                    watchProgress = {
                        progressSeconds: progressDoc.progressSeconds,
                        durationSeconds: progressDoc.durationSeconds,
                        progressPercent: progressDoc.progressPercent,
                        lastWatchedAt: progressDoc.lastWatchedAt,
                    };
                }
                _b.label = 4;
            case 4:
                related = [];
                if (!(movie.genres && movie.genres.length > 0)) return [3 /*break*/, 6];
                genreIds = movie.genres.map(function (g) { return g._id || g; });
                return [4 /*yield*/, Movie_1.MovieModel.find({
                        _id: { $ne: movie._id },
                        status: 'published',
                        genres: { $in: genreIds },
                    })
                        .select('title thumbnail bannerImage duration year rating genres')
                        .populate('genres', 'name')
                        .limit(10)
                        .lean()];
            case 5:
                relatedMovies = _b.sent();
                related = relatedMovies.map(function (r) { return ({
                    id: r._id.toString(),
                    title: r.title,
                    thumbnail: toAbsoluteUrl(request, r.thumbnail) || null,
                    bannerImage: toAbsoluteUrl(request, r.bannerImage) || null,
                    duration: r.duration || null,
                    year: r.year || null,
                    rating: r.rating || null,
                    genres: (r.genres || []).map(function (g) { return (g === null || g === void 0 ? void 0 : g.name) || g; }),
                    type: 'movie',
                }); });
                _b.label = 6;
            case 6:
                cast = (movie.cast || []).map(function (c) {
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
                crew = (movie.crew || []).map(function (c) {
                    var _a, _b, _c, _d, _e;
                    return ({
                        id: ((_b = (_a = c.director) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString()) || null,
                        name: ((_c = c.director) === null || _c === void 0 ? void 0 : _c.name) || 'Unknown',
                        image: toAbsoluteUrl(request, (_d = c.director) === null || _d === void 0 ? void 0 : _d.image) || null,
                        designation: ((_e = c.director) === null || _e === void 0 ? void 0 : _e.designation) || null,
                        role: c.role || 'Director',
                    });
                });
                hours = movie.duration ? Math.floor(movie.duration / 3600) : 0;
                minutes = movie.duration ? Math.floor((movie.duration % 3600) / 60) : 0;
                durationFormatted = movie.duration
                    ? hours > 0 ? "".concat(hours, "h ").concat(minutes, "m") : "".concat(minutes, "m")
                    : null;
                hlsUrl = movie.hlsUrl || movie.videoUrl || null;
                qualities = movie.videoQualities || [];
                QUALITY_ORDER_1 = ['144p', '240p', '360p', '480p', '720p', '1080p', '1440p', '2160p'];
                sortedQualities = __spreadArray([], qualities, true).sort(function (a, b) { return QUALITY_ORDER_1.indexOf(a.quality) - QUALITY_ORDER_1.indexOf(b.quality); });
                videoSettings = hlsUrl
                    ? __spreadArray([
                        {
                            key: 'auto',
                            label: 'Auto',
                            description: 'Adjusts quality automatically based on your connection',
                            url: toAbsoluteUrl(request, hlsUrl),
                            requiresPlan: 'free',
                            isLocked: false,
                        }
                    ], sortedQualities.map(function (q) {
                        var sizeMB = q.size ? "".concat(Math.round(q.size / (1024 * 1024)), " MB") : null;
                        var label = watchController_1.QUALITY_LABELS[q.quality] || q.quality;
                        var requiredPlan = watchController_1.QUALITY_PLAN_GATE[q.quality] || 'free';
                        // isLocked: currently always false — flip to real check when subscriptions go live
                        var isLocked = false;
                        var description = q.quality === '144p' ? 'Very low quality — for slow connections' :
                            q.quality === '240p' ? 'Low quality — saves data' :
                                q.quality === '360p' ? 'Low quality' :
                                    q.quality === '480p' ? 'Standard definition' :
                                        q.quality === '720p' ? 'High definition' :
                                            q.quality === '1080p' ? 'Full HD — recommended' :
                                                q.quality === '1440p' ? '2K — requires fast connection' :
                                                    q.quality === '2160p' ? '4K Ultra HD — requires very fast connection' :
                                                        "Stream at ".concat(label);
                        return {
                            key: q.quality,
                            label: label,
                            description: sizeMB ? "".concat(description, " (").concat(sizeMB, ")") : description,
                            url: toAbsoluteUrl(request, q.url),
                            requiresPlan: requiredPlan,
                            isLocked: isLocked,
                        };
                    }), true) : null;
                genreNames = movie.genres.map(function (g) { return (g === null || g === void 0 ? void 0 : g.name) || g; });
                languageNames = movie.languages.map(function (l) { return (l === null || l === void 0 ? void 0 : l.name) || l; });
                return [2 /*return*/, reply.send({
                        success: true,
                        data: {
                            id: movie._id.toString(),
                            title: movie.title,
                            originalTitle: movie.originalTitle || null,
                            description: movie.description || null,
                            shortDescription: movie.shortDescription || null,
                            thumbnail: toAbsoluteUrl(request, movie.thumbnail) || null,
                            bannerImage: toAbsoluteUrl(request, movie.bannerImage) || null,
                            posterImage: toAbsoluteUrl(request, movie.posterImage) || null,
                            trailerUrl: toAbsoluteUrl(request, movie.trailerUrl) || null,
                            type: 'movie',
                            // Video
                            hlsUrl: toAbsoluteUrl(request, hlsUrl),
                            videoSettings: videoSettings,
                            playbackSpeeds: [
                                { value: 0.75, label: '0.75x' },
                                { value: 1.0, label: 'Normal' },
                                { value: 1.25, label: '1.25x' },
                                { value: 1.5, label: '1.5x' },
                                { value: 1.75, label: '1.75x' },
                                { value: 2.0, label: '2.0x' }
                            ],
                            isLocked: movie.planRequired !== 'free' && userPlan === 'free',
                            // Meta
                            genres: genreNames,
                            genresText: genreNames.join(' & '),
                            languages: languageNames,
                            year: movie.year || null,
                            rating: movie.rating || null,
                            ageRating: movie.ageRating || 0,
                            duration: movie.duration || null,
                            durationFormatted: durationFormatted,
                            episodeMeta: "HD \u2022 ".concat(genreNames.join(', '), " \u2022 ").concat(durationFormatted || 'N/A'),
                            imdbRating: movie.imdbRating || null,
                            planRequired: movie.planRequired || 'free',
                            isExclusive: movie.isExclusive || false,
                            featured: movie.featured || false,
                            trending: movie.trending || false,
                            releaseDate: movie.releaseDate || null,
                            country: movie.country || null,
                            studio: movie.studio || null,
                            // Stats
                            views: movie.views || 0,
                            likeCount: movie.likes || 0,
                            shares: movie.shares || 0,
                            // User flags
                            isLikedByUser: isLikedByUser,
                            isWishlisted: isWishlisted,
                            wishlisted: wishlisted,
                            watchProgress: watchProgress,
                            downloaded: downloaded,
                            isDownloaded: isDownloaded,
                            // Share
                            shareUrl: (0, config_1.buildShareUrl)(movie._id.toString()),
                            // People
                            cast: cast,
                            crew: crew,
                            // Related
                            related: related,
                        },
                    })];
            case 7:
                error_1 = _b.sent();
                logger_1.logger.error({ error: error_1 }, 'Error getting movie detail');
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Failed to fetch movie detail.', error: error_1.message })];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.getMovieDetail = getMovieDetail;
