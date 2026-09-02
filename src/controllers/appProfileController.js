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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
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
exports.deleteProfile = exports.updateProfile = exports.createProfile = exports.getProfiles = exports.removeDevice = exports.getDevices = exports.uploadAppAvatar = exports.updateAppProfile = exports.deleteAppAccount = exports.updatePreferredLanguage = exports.updateVideoQuality = exports.getAppProfile = void 0;
var User_1 = require("../models/User");
var AdminUser_1 = require("../models/AdminUser");
var Content_1 = require("../models/Content");
var Language_1 = require("../models/Language");
var Settings_1 = require("../models/Settings");
var SubscriptionPlan_1 = require("../models/SubscriptionPlan");
var PlanLimit_1 = require("../models/PlanLimit");
var mongoose_1 = __importDefault(require("mongoose"));
var Page_1 = require("../models/Page");
var UserDownload_1 = require("../models/UserDownload");
var UserWishlist_1 = require("../models/UserWishlist");
var UserLike_1 = require("../models/UserLike");
var Movie_1 = require("../models/Movie");
var Episode_1 = require("../models/Episode");
var UserWatchProgress_1 = require("../models/UserWatchProgress");
var Review_1 = require("../models/Review");
var Subscription_1 = require("../models/Subscription");
var logger_1 = require("../lib/logger");
var uploadHandler_1 = __importDefault(require("../lib/uploadHandler"));
// Optional user lookup helper
var getOptionalUserToken = function (request) {
    try {
        var authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer '))
            return null;
        return authHeader.slice(7);
    }
    catch (_a) {
        return null;
    }
};
var getOptionalUserId = function (request) {
    try {
        var token = getOptionalUserToken(request);
        if (!token)
            return null;
        var server = request.server;
        var decoded = server.jwt.verify(token);
        return (decoded === null || decoded === void 0 ? void 0 : decoded.id) || null;
    }
    catch (_a) {
        return null;
    }
};
// ── GET Profile & Settings ──────────────────────────────────────────────────
var getAppProfile = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, userProfile, downloadsList, wishlistList, likesList, likeRecords, userObjectId, user, token, server, decoded_1, deviceExists, admin, userNumber, settings, appName, prefix, displayId, plan, profileLimitCount, limit, isActive, existingReview, downloads, movieIds, contentIds, episodeIds, _a, movies, dramas, episodes, movieMap_1, dramaMap_1, episodeMap_1, wishlistItems, wMovieIds, wContentIds, _b, wMovies, wContents, wMovieMap_1, wContentMap_1, likedItems, allLikes, lMovieIds, lContentIds, _c, lMovies, lContents, lMovieMap_1, lContentMap_1, _d, movies, dramas, dramaIds, episodes, _e, episodeMap_2, subscriptionOffer, recommendationsRaw, baseUrl_1, recommendations, pages, dbSettings, platformName, contactEmail, shareAppText, privacyPage, termsPage, appSettings, languages, error_1;
    var _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                _g.trys.push([0, 32, , 33]);
                userId = getOptionalUserId(request);
                userProfile = null;
                downloadsList = [];
                wishlistList = [];
                likesList = [];
                likeRecords = [];
                if (!userId) return [3 /*break*/, 21];
                userObjectId = new mongoose_1.default.Types.ObjectId(userId);
                return [4 /*yield*/, User_1.UserModel.findById(userObjectId).lean()];
            case 1:
                user = _g.sent();
                if (user) {
                    token = getOptionalUserToken(request);
                    if (token) {
                        try {
                            server = request.server;
                            decoded_1 = server.jwt.verify(token);
                            if (decoded_1.deviceId && decoded_1.deviceId !== 'unknown') {
                                deviceExists = (_f = user.devices) === null || _f === void 0 ? void 0 : _f.some(function (d) { return d.deviceId === decoded_1.deviceId; });
                                if (!deviceExists) {
                                    return [2 /*return*/, reply.status(401).send({ success: false, message: 'Device was removed, please login again.' })];
                                }
                            }
                        }
                        catch (e) {
                            // ignore jwt error here, it was already handled or we fallback to guest
                        }
                    }
                }
                if (!!user) return [3 /*break*/, 3];
                return [4 /*yield*/, AdminUser_1.AdminUserModel.findById(userObjectId).lean()];
            case 2:
                admin = _g.sent();
                if (admin) {
                    user = {
                        _id: admin._id,
                        name: admin.name,
                        email: admin.email,
                        phone: admin.phone || '',
                        avatar: admin.avatar || '',
                        subscriptionStatus: 'active',
                        subscriptionPlan: 'premium',
                        videoQuality: 'auto',
                        preferredLanguage: 'English',
                        profiles: [
                            {
                                name: admin.name,
                                isKids: false,
                                maturityLevel: 18,
                                language: 'English',
                            }
                        ],
                        devices: [],
                        languageSelectionSkipped: true,
                        watchlistCount: 0,
                        totalWatchTime: 0,
                        status: 'active',
                        loginCount: admin.loginCount,
                        createdAt: admin.createdAt,
                        updatedAt: admin.updatedAt,
                    };
                }
                _g.label = 3;
            case 3:
                if (!user) return [3 /*break*/, 10];
                return [4 /*yield*/, User_1.UserModel.countDocuments({ _id: { $lte: user._id } })];
            case 4:
                userNumber = _g.sent();
                return [4 /*yield*/, Settings_1.SettingsModel.findOne().lean()];
            case 5:
                settings = _g.sent();
                appName = (settings === null || settings === void 0 ? void 0 : settings.platformName) || 'Braj Cinema';
                prefix = appName.substring(0, 4).toUpperCase();
                displayId = "".concat(prefix).concat(String(userNumber).padStart(4, '0'));
                return [4 /*yield*/, SubscriptionPlan_1.SubscriptionPlanModel.findOne({ name: user.subscriptionPlan }).lean()];
            case 6:
                plan = _g.sent();
                profileLimitCount = 1;
                if (!plan) return [3 /*break*/, 8];
                return [4 /*yield*/, PlanLimit_1.PlanLimitModel.findOne({ planId: plan._id }).lean()];
            case 7:
                limit = _g.sent();
                if (limit) {
                    profileLimitCount = limit.profileLimitCount;
                }
                _g.label = 8;
            case 8:
                isActive = user.subscriptionStatus === 'active' &&
                    (!user.subscriptionExpiry || user.subscriptionExpiry > new Date());
                userProfile = {
                    id: user._id.toString(),
                    displayId: displayId,
                    name: user.name,
                    phone: user.phone || null,
                    email: user.email || null,
                    avatar: user.avatar || null,
                    subscription: isActive,
                    subscriptionStatus: isActive ? 'active' : 'inactive',
                    subscriptionPlan: isActive ? (user.subscriptionPlan || 'free') : 'free',
                    profileLimitCount: profileLimitCount,
                    videoQuality: user.videoQuality || 'auto',
                    preferredLanguage: user.preferredLanguage || 'Hindi',
                    accessToken: getOptionalUserToken(request) || null,
                    profiles: user.profiles || [],
                };
                return [4 /*yield*/, Review_1.ReviewModel.findOne({ userId: user._id }).lean()];
            case 9:
                existingReview = _g.sent();
                userProfile.hasReviewed = !!existingReview;
                if (existingReview) {
                    userProfile.reviewId = existingReview._id.toString();
                }
                _g.label = 10;
            case 10: return [4 /*yield*/, UserDownload_1.UserDownloadModel.find({ userId: userObjectId })
                    .sort({ createdAt: -1 })
                    .limit(5)
                    .lean()];
            case 11:
                downloads = _g.sent();
                if (!(downloads.length > 0)) return [3 /*break*/, 13];
                movieIds = downloads.filter(function (d) { return d.contentModelType === 'Movie'; }).map(function (d) { return d.contentId; });
                contentIds = downloads.filter(function (d) { return d.contentModelType === 'Content'; }).map(function (d) { return d.contentId; });
                episodeIds = downloads.filter(function (d) { return d.episodeId; }).map(function (d) { return d.episodeId; });
                return [4 /*yield*/, Promise.all([
                        movieIds.length > 0 ? Movie_1.MovieModel.find({ _id: { $in: movieIds } }).select('title thumbnail duration year rating').lean() : Promise.resolve([]),
                        contentIds.length > 0 ? Content_1.ContentModel.find({ _id: { $in: contentIds } }).select('title thumbnail').lean() : Promise.resolve([]),
                        episodeIds.length > 0 ? Episode_1.EpisodeModel.find({ _id: { $in: episodeIds } }).select('title thumbnail duration season episode').lean() : Promise.resolve([])
                    ])];
            case 12:
                _a = _g.sent(), movies = _a[0], dramas = _a[1], episodes = _a[2];
                movieMap_1 = new Map(movies.map(function (m) { return [m._id.toString(), m]; }));
                dramaMap_1 = new Map(dramas.map(function (d) { return [d._id.toString(), d]; }));
                episodeMap_1 = new Map(episodes.map(function (e) { return [e._id.toString(), e]; }));
                downloadsList = downloads.map(function (item) {
                    var _a;
                    var isMovie = item.contentModelType === 'Movie';
                    if (isMovie) {
                        var m = movieMap_1.get(item.contentId.toString());
                        if (!m)
                            return null;
                        return {
                            id: item.contentId.toString(),
                            downloadId: item._id.toString(),
                            contentId: item.contentId.toString(),
                            title: m.title,
                            thumbnail: m.thumbnail,
                            duration: m.duration,
                            year: m.year,
                            rating: m.rating,
                            type: 'movie',
                            downloadedAt: item.createdAt
                        };
                    }
                    else {
                        var d = dramaMap_1.get(item.contentId.toString());
                        var e = item.episodeId ? episodeMap_1.get(item.episodeId.toString()) : null;
                        if (!d || !e)
                            return null;
                        return {
                            id: item.contentId.toString(),
                            downloadId: item._id.toString(),
                            contentId: item.contentId.toString(),
                            episodeId: (_a = item.episodeId) === null || _a === void 0 ? void 0 : _a.toString(),
                            title: e.title,
                            parentTitle: d.title,
                            thumbnail: e.thumbnail || d.thumbnail,
                            duration: e.duration,
                            season: e.season,
                            episodeNumber: e.episode,
                            type: 'drama',
                            downloadedAt: item.createdAt
                        };
                    }
                }).filter(Boolean);
                _g.label = 13;
            case 13: return [4 /*yield*/, UserWishlist_1.UserWishlistModel.find({ userId: userObjectId })
                    .sort({ createdAt: -1 })
                    .lean()];
            case 14:
                wishlistItems = _g.sent();
                if (!(wishlistItems.length > 0)) return [3 /*break*/, 16];
                wMovieIds = wishlistItems.filter(function (i) { return i.contentModelType === 'Movie'; }).map(function (i) { return i.contentId; });
                wContentIds = wishlistItems.filter(function (i) { return i.contentModelType === 'Content'; }).map(function (i) { return i.contentId; });
                return [4 /*yield*/, Promise.all([
                        wMovieIds.length > 0 ? Movie_1.MovieModel.find({ _id: { $in: wMovieIds } }).select('title thumbnail bannerImage posterImage year rating duration views type').lean() : Promise.resolve([]),
                        wContentIds.length > 0 ? Content_1.ContentModel.find({ _id: { $in: wContentIds } }).select('title thumbnail bannerImage posterImage year rating duration views type contentType').lean() : Promise.resolve([]),
                    ])];
            case 15:
                _b = _g.sent(), wMovies = _b[0], wContents = _b[1];
                wMovieMap_1 = new Map(wMovies.map(function (m) { return [m._id.toString(), m]; }));
                wContentMap_1 = new Map(wContents.map(function (c) { return [c._id.toString(), c]; }));
                wishlistList = wishlistItems.map(function (item) {
                    var isMovie = item.contentModelType === 'Movie';
                    var c = isMovie ? wMovieMap_1.get(item.contentId.toString()) : wContentMap_1.get(item.contentId.toString());
                    if (!c)
                        return null;
                    return {
                        id: c._id.toString(),
                        title: c.title,
                        thumbnail: c.thumbnail,
                        bannerImage: c.bannerImage || null,
                        posterImage: c.posterImage || c.thumbnail || '',
                        type: isMovie ? 'movie' : (c.contentType === 'drama' ? 'drama' : 'series'),
                        views: c.views || 0,
                        year: c.year || null,
                        rating: c.rating || null,
                        duration: c.duration || null,
                        addedAt: item.createdAt
                    };
                }).filter(Boolean);
                _g.label = 16;
            case 16: return [4 /*yield*/, UserLike_1.UserLikeModel.find({ userId: userObjectId, episodeId: null })
                    .sort({ createdAt: -1 })
                    .limit(20)
                    .lean()];
            case 17:
                likedItems = _g.sent();
                return [4 /*yield*/, UserLike_1.UserLikeModel.find({ userId: userObjectId }).select('contentId episodeId').lean()];
            case 18:
                allLikes = _g.sent();
                likeRecords = allLikes.map(function (l) { return ({
                    contentId: l.contentId.toString(),
                    episodeId: l.episodeId ? l.episodeId.toString() : null
                }); });
                if (!(likedItems.length > 0)) return [3 /*break*/, 20];
                lMovieIds = likedItems.filter(function (i) { return i.contentModelType === 'Movie'; }).map(function (i) { return i.contentId; });
                lContentIds = likedItems.filter(function (i) { return i.contentModelType === 'Content'; }).map(function (i) { return i.contentId; });
                return [4 /*yield*/, Promise.all([
                        lMovieIds.length > 0 ? Movie_1.MovieModel.find({ _id: { $in: lMovieIds } }).select('title thumbnail bannerImage posterImage year rating duration views type').lean() : Promise.resolve([]),
                        lContentIds.length > 0 ? Content_1.ContentModel.find({ _id: { $in: lContentIds } }).select('title thumbnail bannerImage posterImage year rating duration views type contentType').lean() : Promise.resolve([]),
                    ])];
            case 19:
                _c = _g.sent(), lMovies = _c[0], lContents = _c[1];
                lMovieMap_1 = new Map(lMovies.map(function (m) { return [m._id.toString(), m]; }));
                lContentMap_1 = new Map(lContents.map(function (c) { return [c._id.toString(), c]; }));
                likesList = likedItems.map(function (item) {
                    var isMovie = item.contentModelType === 'Movie';
                    var c = isMovie ? lMovieMap_1.get(item.contentId.toString()) : lContentMap_1.get(item.contentId.toString());
                    if (!c)
                        return null;
                    return {
                        id: c._id.toString(),
                        title: c.title,
                        thumbnail: c.thumbnail,
                        bannerImage: c.bannerImage || null,
                        posterImage: c.posterImage || c.thumbnail || '',
                        type: isMovie ? 'movie' : (c.contentType === 'drama' ? 'drama' : 'series'),
                        views: c.views || 0,
                        year: c.year || null,
                        rating: c.rating || null,
                        duration: c.duration || null,
                        likedAt: item.createdAt
                    };
                }).filter(Boolean);
                _g.label = 20;
            case 20: return [3 /*break*/, 22];
            case 21:
                userProfile = {
                    id: null,
                    name: 'Guest',
                    subscription: false,
                    subscriptionStatus: 'inactive',
                    subscriptionPlan: 'free',
                    videoQuality: 'auto',
                    preferredLanguage: 'Hindi',
                    accessToken: null,
                    profiles: [],
                };
                _g.label = 22;
            case 22:
                if (!(!userId && (downloadsList.length === 0 || wishlistList.length === 0))) return [3 /*break*/, 27];
                return [4 /*yield*/, Promise.all([
                        Movie_1.MovieModel.find({ status: 'published' }).limit(2).lean(),
                        Content_1.ContentModel.find({ status: 'published', type: 'series', contentType: 'drama' }).limit(2).lean()
                    ])];
            case 23:
                _d = _g.sent(), movies = _d[0], dramas = _d[1];
                dramaIds = dramas.map(function (d) { return d._id; });
                if (!(dramaIds.length > 0)) return [3 /*break*/, 25];
                return [4 /*yield*/, Episode_1.EpisodeModel.find({ contentId: { $in: dramaIds } }).lean()];
            case 24:
                _e = _g.sent();
                return [3 /*break*/, 26];
            case 25:
                _e = [];
                _g.label = 26;
            case 26:
                episodes = _e;
                episodeMap_2 = new Map(episodes.map(function (e) { return [e.contentId.toString(), e]; }));
                if (downloadsList.length === 0) {
                    downloadsList = __spreadArray(__spreadArray([], movies.map(function (m) { return ({
                        id: "seed-dl-".concat(m._id),
                        contentId: m._id.toString(),
                        title: m.title,
                        thumbnail: m.thumbnail,
                        duration: m.duration || null,
                        year: m.year || null,
                        rating: m.rating || null,
                        type: 'movie',
                        downloadedAt: new Date()
                    }); }), true), dramas.map(function (d) {
                        var ep = episodeMap_2.get(d._id.toString());
                        return {
                            id: "seed-dl-".concat(d._id),
                            contentId: d._id.toString(),
                            episodeId: ep ? ep._id.toString() : undefined,
                            title: ep ? ep.title : "".concat(d.title, " - Episode 1"),
                            parentTitle: d.title,
                            thumbnail: ep ? ep.thumbnail || d.thumbnail : d.thumbnail,
                            duration: ep ? ep.duration || null : null,
                            season: ep ? ep.season : 1,
                            episodeNumber: ep ? ep.episode : 1,
                            type: 'drama',
                            downloadedAt: new Date()
                        };
                    }), true);
                }
                if (wishlistList.length === 0) {
                    wishlistList = __spreadArray(__spreadArray([], movies.map(function (m) { return ({
                        id: m._id.toString(),
                        title: m.title,
                        thumbnail: m.thumbnail,
                        bannerImage: m.bannerImage || null,
                        posterImage: m.posterImage || m.thumbnail || '',
                        type: 'movie',
                        views: m.views || 0,
                        year: m.year || null,
                        rating: m.rating || null,
                        duration: m.duration || null,
                        addedAt: new Date()
                    }); }), true), dramas.map(function (d) { return ({
                        id: d._id.toString(),
                        title: d.title,
                        thumbnail: d.thumbnail,
                        bannerImage: d.bannerImage || null,
                        posterImage: d.thumbnail || '',
                        type: d.contentType === 'drama' ? 'drama' : 'series',
                        views: d.views || 0,
                        year: d.year || null,
                        rating: d.rating || null,
                        duration: null,
                        addedAt: new Date()
                    }); }), true);
                }
                _g.label = 27;
            case 27:
                subscriptionOffer = {
                    title: 'Trial Offer',
                    subtitle: 'View benefits below',
                    ctaText: 'Start Trial',
                    benefits: [
                        { icon: 'unlimited', title: 'Unlimited Access' },
                        { icon: 'ads', title: 'Ads Free' },
                        { icon: 'hd', title: 'HD Quality' },
                        { icon: 'devices', title: 'Multiple Logins' },
                    ],
                };
                return [4 /*yield*/, Content_1.ContentModel.find({
                        status: 'published',
                        type: 'series',
                        contentType: 'drama'
                    })
                        .sort({ views: -1 })
                        .limit(3)
                        .lean()];
            case 28:
                recommendationsRaw = _g.sent();
                baseUrl_1 = "".concat(request.protocol, "://").concat(request.headers.host || request.hostname);
                recommendations = recommendationsRaw.map(function (r) {
                    var absoluteThumbnail = r.thumbnail;
                    if (absoluteThumbnail && !absoluteThumbnail.startsWith('http')) {
                        absoluteThumbnail = "".concat(baseUrl_1).concat(absoluteThumbnail.startsWith('/') ? '' : '/').concat(absoluteThumbnail);
                    }
                    return {
                        id: r._id.toString(),
                        title: r.title,
                        thumbnail: absoluteThumbnail,
                        views: r.views || 0,
                        type: 'drama'
                    };
                });
                return [4 /*yield*/, Page_1.PageModel.find({ status: 'published' }).lean()];
            case 29:
                pages = _g.sent();
                return [4 /*yield*/, Settings_1.SettingsModel.findOne().lean()];
            case 30:
                dbSettings = _g.sent();
                platformName = (dbSettings === null || dbSettings === void 0 ? void 0 : dbSettings.platformName) || 'Braj Cinema TV';
                contactEmail = (dbSettings === null || dbSettings === void 0 ? void 0 : dbSettings.mailFrom) || (dbSettings === null || dbSettings === void 0 ? void 0 : dbSettings.mailEmail) || 'support@brajcinema.tv';
                shareAppText = "Watch amazing short dramas and movies on ".concat(platformName, "!");
                privacyPage = pages.find(function (p) { return p.slug === 'privacy-policy'; });
                termsPage = pages.find(function (p) { return p.slug === 'terms-and-conditions'; });
                appSettings = {
                    shareAppTitle: 'Share the App',
                    shareAppText: shareAppText,
                    shareAppUrl: 'https://play.google.com/store/apps/details?id=com.brajcinema.tv',
                    privacyPolicy: (privacyPage === null || privacyPage === void 0 ? void 0 : privacyPage.content) || '',
                    termsOfService: (termsPage === null || termsPage === void 0 ? void 0 : termsPage.content) || '',
                    deleteAccountTitle: 'Delete Account',
                    deleteAccountDescription: 'Permanently delete your account and all associated data.',
                    appVersion: 'V1.2.4',
                };
                return [4 /*yield*/, Language_1.LanguageModel.find({ isActive: true }).sort({ order: 1 }).select('id name code').lean()];
            case 31:
                languages = _g.sent();
                // 6. Send response
                return [2 /*return*/, reply.send({
                        success: true,
                        data: {
                            user: userProfile,
                            subscriptionOffer: subscriptionOffer,
                            recommendations: recommendations,
                            appSettings: appSettings,
                            downloads: downloadsList,
                            wishlist: wishlistList,
                            likes: likesList,
                            likeRecords: likeRecords,
                            languages: languages.map(function (lang) { return ({
                                id: lang._id.toString(),
                                name: lang.name,
                                code: lang.code
                            }); }),
                        }
                    })];
            case 32:
                error_1 = _g.sent();
                logger_1.logger.error({ error: error_1 }, 'Error getting app profile');
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Failed to fetch profile' })];
            case 33: return [2 /*return*/];
        }
    });
}); };
exports.getAppProfile = getAppProfile;
// ── PUT Video Quality Setting ───────────────────────────────────────────────
var updateVideoQuality = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, videoQuality, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = getOptionalUserId(request);
                if (!userId) {
                    return [2 /*return*/, reply.status(401).send({ success: false, message: 'Unauthorized' })];
                }
                videoQuality = (request.body || {}).videoQuality;
                if (!videoQuality || !['auto', 'best', 'data_saver'].includes(videoQuality)) {
                    return [2 /*return*/, reply.status(400).send({ success: false, message: 'Invalid video quality setting' })];
                }
                return [4 /*yield*/, User_1.UserModel.findByIdAndUpdate(userId, { videoQuality: videoQuality })];
            case 1:
                _a.sent();
                return [2 /*return*/, reply.send({
                        success: true,
                        message: 'Video quality setting updated successfully',
                        data: { videoQuality: videoQuality }
                    })];
            case 2:
                error_2 = _a.sent();
                logger_1.logger.error({ error: error_2 }, 'Error updating video quality');
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Failed to update setting' })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateVideoQuality = updateVideoQuality;
// ── PUT Preferred Language Setting ──────────────────────────────────────────
var updatePreferredLanguage = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, language, user, resolvedLanguage, langDoc, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                userId = getOptionalUserId(request);
                if (!userId) {
                    return [2 /*return*/, reply.status(401).send({ success: false, message: 'Unauthorized' })];
                }
                language = (request.body || {}).language;
                if (!language || typeof language !== 'string') {
                    return [2 /*return*/, reply.status(400).send({ success: false, message: 'Language is required' })];
                }
                return [4 /*yield*/, User_1.UserModel.findById(userId)];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'User not found' })];
                }
                resolvedLanguage = language;
                return [4 /*yield*/, Language_1.LanguageModel.findOne({
                        $or: __spreadArray([
                            { name: new RegExp("^".concat(language, "$"), 'i') },
                            { code: language.toLowerCase() }
                        ], (mongoose_1.default.Types.ObjectId.isValid(language) ? [{ _id: language }] : []), true)
                    }).lean()];
            case 2:
                langDoc = _a.sent();
                if (langDoc) {
                    resolvedLanguage = langDoc.name;
                }
                user.preferredLanguage = resolvedLanguage;
                user.languageSelectionSkipped = false;
                if (user.profiles && user.profiles.length > 0) {
                    user.profiles[0].language = resolvedLanguage;
                }
                return [4 /*yield*/, user.save()];
            case 3:
                _a.sent();
                return [2 /*return*/, reply.send({
                        success: true,
                        message: 'Preferred language updated successfully',
                        data: {
                            preferredLanguage: user.preferredLanguage,
                            languageSelectionSkipped: user.languageSelectionSkipped
                        }
                    })];
            case 4:
                error_3 = _a.sent();
                logger_1.logger.error({ error: error_3 }, 'Error updating preferred language');
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Failed to update preferred language' })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.updatePreferredLanguage = updatePreferredLanguage;
// ── DELETE App Account ──────────────────────────────────────────────────────
var deleteAppAccount = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, userObjectId, deletedUser, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                userId = getOptionalUserId(request);
                if (!userId) {
                    return [2 /*return*/, reply.status(401).send({ success: false, message: 'Unauthorized' })];
                }
                userObjectId = new mongoose_1.default.Types.ObjectId(userId);
                return [4 /*yield*/, User_1.UserModel.findByIdAndDelete(userObjectId)];
            case 1:
                deletedUser = _a.sent();
                if (!deletedUser) {
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'User not found' })];
                }
                // 2. Clean up associated user data across all collections
                return [4 /*yield*/, Promise.all([
                        UserWatchProgress_1.UserWatchProgressModel.deleteMany({ userId: userObjectId }),
                        UserDownload_1.UserDownloadModel.deleteMany({ userId: userObjectId }),
                        UserWishlist_1.UserWishlistModel.deleteMany({ userId: userObjectId }),
                        UserLike_1.UserLikeModel.deleteMany({ userId: userObjectId }),
                        Review_1.ReviewModel.deleteMany({ userId: userObjectId }),
                        Subscription_1.SubscriptionModel.deleteMany({ userId: userObjectId }),
                    ])];
            case 2:
                // 2. Clean up associated user data across all collections
                _a.sent();
                return [2 /*return*/, reply.send({
                        success: true,
                        message: 'Account and all associated data deleted successfully'
                    })];
            case 3:
                error_4 = _a.sent();
                logger_1.logger.error({ error: error_4 }, 'Error deleting app account');
                return [2 /*return*/, reply.status(500).send({
                        success: false,
                        message: 'Failed to delete account',
                        error: error_4.message
                    })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteAppAccount = deleteAppAccount;
// ── PATCH Update App User Profile (name / email / avatar URL) ────────────────
var updateAppProfile = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, name_1, email, avatar, phone, updateData, user, admin, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                userId = getOptionalUserId(request);
                if (!userId)
                    return [2 /*return*/, reply.status(401).send({ success: false, message: 'Unauthorized' })];
                _a = (request.body || {}), name_1 = _a.name, email = _a.email, avatar = _a.avatar, phone = _a.phone;
                updateData = {};
                if (name_1 && typeof name_1 === 'string')
                    updateData.name = name_1.trim();
                if (email && typeof email === 'string')
                    updateData.email = email.toLowerCase().trim();
                if (avatar && typeof avatar === 'string')
                    updateData.avatar = avatar;
                if (phone && typeof phone === 'string')
                    updateData.phone = phone.trim();
                if (Object.keys(updateData).length === 0) {
                    return [2 /*return*/, reply.status(400).send({ success: false, message: 'No fields to update' })];
                }
                return [4 /*yield*/, User_1.UserModel.findByIdAndUpdate(userId, { $set: updateData }, { returnDocument: 'after', runValidators: true }).lean()];
            case 1:
                user = _b.sent();
                if (!!user) return [3 /*break*/, 3];
                return [4 /*yield*/, AdminUser_1.AdminUserModel.findByIdAndUpdate(userId, { $set: updateData }, { returnDocument: 'after', runValidators: true }).lean()];
            case 2:
                admin = _b.sent();
                if (!admin)
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'User not found' })];
                return [2 /*return*/, reply.send({
                        success: true,
                        data: {
                            id: admin._id.toString(),
                            name: admin.name,
                            email: admin.email,
                            avatar: admin.avatar || null,
                            phone: admin.phone || null,
                        },
                    })];
            case 3: return [2 /*return*/, reply.send({
                    success: true,
                    data: {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                        avatar: user.avatar || null,
                        phone: user.phone || null,
                    },
                })];
            case 4:
                error_5 = _b.sent();
                logger_1.logger.error({ error: error_5 }, 'Error updating app profile');
                if (error_5.code === 11000) {
                    return [2 /*return*/, reply.status(400).send({ success: false, message: 'This email or phone number is already registered to another account.' })];
                }
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Failed to update profile' })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.updateAppProfile = updateAppProfile;
// ── POST Upload App User Avatar (multipart) ──────────────────────────────────
var uploadAppAvatar = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, parts, avatarUrl, _a, parts_1, parts_1_1, part, fileInfo, e_1_1, user, error_6;
    var _b, e_1, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 17, , 18]);
                userId = getOptionalUserId(request);
                if (!userId)
                    return [2 /*return*/, reply.status(401).send({ success: false, message: 'Unauthorized' })];
                parts = request.parts();
                avatarUrl = null;
                _e.label = 1;
            case 1:
                _e.trys.push([1, 7, 8, 13]);
                _a = true, parts_1 = __asyncValues(parts);
                _e.label = 2;
            case 2: return [4 /*yield*/, parts_1.next()];
            case 3:
                if (!(parts_1_1 = _e.sent(), _b = parts_1_1.done, !_b)) return [3 /*break*/, 6];
                _d = parts_1_1.value;
                _a = false;
                part = _d;
                if (!(part.type === 'file' && part.fieldname === 'avatar')) return [3 /*break*/, 5];
                return [4 /*yield*/, uploadHandler_1.default.saveFileFromPart(part, request, 'IMAGE', 'avatars')];
            case 4:
                fileInfo = _e.sent();
                avatarUrl = fileInfo.url;
                return [3 /*break*/, 6];
            case 5:
                _a = true;
                return [3 /*break*/, 2];
            case 6: return [3 /*break*/, 13];
            case 7:
                e_1_1 = _e.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 13];
            case 8:
                _e.trys.push([8, , 11, 12]);
                if (!(!_a && !_b && (_c = parts_1.return))) return [3 /*break*/, 10];
                return [4 /*yield*/, _c.call(parts_1)];
            case 9:
                _e.sent();
                _e.label = 10;
            case 10: return [3 /*break*/, 12];
            case 11:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 12: return [7 /*endfinally*/];
            case 13:
                if (!avatarUrl) {
                    return [2 /*return*/, reply.status(400).send({ success: false, message: 'No avatar file provided' })];
                }
                return [4 /*yield*/, User_1.UserModel.findByIdAndUpdate(userId, { $set: { avatar: avatarUrl } })];
            case 14:
                user = _e.sent();
                if (!!user) return [3 /*break*/, 16];
                return [4 /*yield*/, AdminUser_1.AdminUserModel.findByIdAndUpdate(userId, { $set: { avatar: avatarUrl } })];
            case 15:
                _e.sent();
                _e.label = 16;
            case 16: return [2 /*return*/, reply.send({ success: true, data: { avatarUrl: avatarUrl } })];
            case 17:
                error_6 = _e.sent();
                logger_1.logger.error({ error: error_6 }, 'Error uploading app avatar');
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Failed to upload avatar' })];
            case 18: return [2 /*return*/];
        }
    });
}); };
exports.uploadAppAvatar = uploadAppAvatar;
// ── GET /api/app/devices ──────────────────────────────────────────────────────
var getDevices = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, user, devices, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = getOptionalUserId(request);
                if (!userId)
                    return [2 /*return*/, reply.status(401).send({ success: false, message: 'Unauthorized' })];
                return [4 /*yield*/, User_1.UserModel.findById(userId).select('devices').lean()];
            case 1:
                user = _a.sent();
                if (!user)
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'User not found' })];
                devices = user.devices || [];
                return [2 /*return*/, reply.send({ success: true, data: devices })];
            case 2:
                error_7 = _a.sent();
                logger_1.logger.error({ error: error_7 }, 'Error fetching devices');
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Failed to fetch devices' })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getDevices = getDevices;
// ── DELETE /api/app/devices/:deviceId ──────────────────────────────────────────
var removeDevice = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, deviceId, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = getOptionalUserId(request);
                if (!userId)
                    return [2 /*return*/, reply.status(401).send({ success: false, message: 'Unauthorized' })];
                deviceId = request.params.deviceId;
                return [4 /*yield*/, User_1.UserModel.findByIdAndUpdate(userId, {
                        $pull: { devices: { deviceId: deviceId } }
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/, reply.send({ success: true, message: 'Device removed successfully' })];
            case 2:
                error_8 = _a.sent();
                logger_1.logger.error({ error: error_8 }, 'Error removing device');
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Failed to remove device' })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.removeDevice = removeDevice;
// ── GET /api/app/profiles ────────────────────────────────────────────────────
var getProfiles = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, user, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = getOptionalUserId(request);
                if (!userId)
                    return [2 /*return*/, reply.status(401).send({ success: false, message: 'Unauthorized' })];
                return [4 /*yield*/, User_1.UserModel.findById(userId).select('profiles').lean()];
            case 1:
                user = _a.sent();
                if (!user)
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'User not found' })];
                return [2 /*return*/, reply.send({ success: true, data: user.profiles || [] })];
            case 2:
                error_9 = _a.sent();
                logger_1.logger.error({ error: error_9 }, 'Error fetching profiles');
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Failed to fetch profiles' })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getProfiles = getProfiles;
// ── POST /api/app/profiles ───────────────────────────────────────────────────
var createProfile = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, name_2, isKids, avatar, user, profileLimitCount, planName, isActive, plan, limit, newProfile, created, error_10;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 9, , 10]);
                userId = getOptionalUserId(request);
                if (!userId)
                    return [2 /*return*/, reply.status(401).send({ success: false, message: 'Unauthorized' })];
                _a = request.body, name_2 = _a.name, isKids = _a.isKids, avatar = _a.avatar;
                if (!name_2)
                    return [2 /*return*/, reply.status(400).send({ success: false, message: 'Name is required' })];
                return [4 /*yield*/, User_1.UserModel.findById(userId)];
            case 1:
                user = _b.sent();
                if (!user)
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'User not found' })];
                profileLimitCount = 1;
                planName = user.subscriptionPlan || 'free';
                isActive = user.subscriptionStatus === 'active' &&
                    (!user.subscriptionExpiry || user.subscriptionExpiry > new Date());
                if (!(isActive && planName !== 'free')) return [3 /*break*/, 6];
                return [4 /*yield*/, SubscriptionPlan_1.SubscriptionPlanModel.findOne({ name: { $regex: new RegExp("^".concat(planName, "$"), 'i') } }).lean()];
            case 2:
                plan = _b.sent();
                if (!plan) return [3 /*break*/, 4];
                return [4 /*yield*/, PlanLimit_1.PlanLimitModel.findOne({ planId: plan._id }).lean()];
            case 3:
                limit = _b.sent();
                if (limit)
                    profileLimitCount = limit.profileLimitCount;
                return [3 /*break*/, 5];
            case 4:
                // Fallback for active premium users if the exact plan name is not found
                profileLimitCount = 4;
                _b.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                if (isActive) {
                    // If they are active but planName is somehow 'free' or empty, give them premium limits as a fallback
                    profileLimitCount = 4;
                }
                _b.label = 7;
            case 7:
                if (user.profiles.length >= profileLimitCount) {
                    return [2 /*return*/, reply.status(403).send({ success: false, message: "Profile limit of ".concat(profileLimitCount, " reached on your current plan.") })];
                }
                newProfile = {
                    name: name_2,
                    isKids: isKids || false,
                    avatar: avatar || null,
                    language: user.preferredLanguage || 'Hindi',
                    maturityLevel: isKids ? 7 : 18,
                };
                user.profiles.push(newProfile);
                return [4 /*yield*/, user.save()];
            case 8:
                _b.sent();
                created = user.profiles[user.profiles.length - 1];
                return [2 /*return*/, reply.send({ success: true, data: created, message: 'Profile created successfully' })];
            case 9:
                error_10 = _b.sent();
                logger_1.logger.error({ error: error_10 }, 'Error creating profile');
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Failed to create profile' })];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.createProfile = createProfile;
// ── PUT /api/app/profiles/:profileId ─────────────────────────────────────────
var updateProfile = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, profileId, _a, name_3, isKids, avatar, user, profile, error_11;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                userId = getOptionalUserId(request);
                if (!userId)
                    return [2 /*return*/, reply.status(401).send({ success: false, message: 'Unauthorized' })];
                profileId = request.params.profileId;
                _a = request.body, name_3 = _a.name, isKids = _a.isKids, avatar = _a.avatar;
                return [4 /*yield*/, User_1.UserModel.findById(userId)];
            case 1:
                user = _b.sent();
                if (!user)
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'User not found' })];
                profile = user.profiles.id(profileId);
                if (!profile)
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'Profile not found' })];
                if (name_3)
                    profile.name = name_3;
                if (isKids !== undefined) {
                    profile.isKids = isKids;
                    profile.maturityLevel = isKids ? 7 : 18;
                }
                if (avatar !== undefined)
                    profile.avatar = avatar;
                return [4 /*yield*/, user.save()];
            case 2:
                _b.sent();
                return [2 /*return*/, reply.send({ success: true, data: profile, message: 'Profile updated successfully' })];
            case 3:
                error_11 = _b.sent();
                logger_1.logger.error({ error: error_11 }, 'Error updating profile');
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Failed to update profile' })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updateProfile = updateProfile;
// ── DELETE /api/app/profiles/:profileId ──────────────────────────────────────
var deleteProfile = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, profileId, user, error_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                userId = getOptionalUserId(request);
                if (!userId)
                    return [2 /*return*/, reply.status(401).send({ success: false, message: 'Unauthorized' })];
                profileId = request.params.profileId;
                return [4 /*yield*/, User_1.UserModel.findById(userId)];
            case 1:
                user = _a.sent();
                if (!user)
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'User not found' })];
                if (user.profiles.length <= 1) {
                    return [2 /*return*/, reply.status(400).send({ success: false, message: 'Cannot delete the last profile' })];
                }
                user.profiles.pull(profileId);
                return [4 /*yield*/, user.save()];
            case 2:
                _a.sent();
                return [2 /*return*/, reply.send({ success: true, message: 'Profile deleted successfully' })];
            case 3:
                error_12 = _a.sent();
                logger_1.logger.error({ error: error_12 }, 'Error deleting profile');
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Failed to delete profile' })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteProfile = deleteProfile;
