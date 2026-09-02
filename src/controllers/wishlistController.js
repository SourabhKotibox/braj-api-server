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
exports.getWishlist = exports.toggleWishlist = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var UserWishlist_1 = require("../models/UserWishlist");
var Content_1 = require("../models/Content");
var Movie_1 = require("../models/Movie");
var Audio_1 = require("../models/Audio");
var VideoMusic_1 = require("../models/VideoMusic");
var User_1 = require("../models/User");
var logger_1 = require("../lib/logger");
var toggleWishlist = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var params, body, contentId, rawType, profileId, isMovie, isAudio, isVideoMusic, contentModelType, user, userId, userObjectId, content, existingWishlist, newWishlist, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 16, , 17]);
                params = (request.params || {});
                body = (request.body || {});
                contentId = body.contentId || params.contentId;
                rawType = body.contentType || body.type;
                profileId = body.profileId || null;
                if (!contentId) {
                    return [2 /*return*/, reply.status(400).send({ success: false, message: 'contentId is required' })];
                }
                if (!rawType) {
                    return [2 /*return*/, reply.status(400).send({ success: false, message: 'type or contentType is required' })];
                }
                isMovie = rawType === 'movie';
                isAudio = rawType === 'audio';
                isVideoMusic = rawType === 'videoMusic';
                contentModelType = isMovie ? 'Movie' : isAudio ? 'Audio' : isVideoMusic ? 'VideoMusic' : 'Content';
                user = request.user;
                if (!user || !user.id) {
                    return [2 /*return*/, reply.status(401).send({ success: false, message: 'Unauthorized' })];
                }
                userId = user.id;
                userObjectId = new mongoose_1.default.Types.ObjectId(userId);
                content = void 0;
                if (!isMovie) return [3 /*break*/, 2];
                return [4 /*yield*/, Movie_1.MovieModel.findById(contentId).select('_id')];
            case 1:
                content = _a.sent();
                return [3 /*break*/, 8];
            case 2:
                if (!isAudio) return [3 /*break*/, 4];
                return [4 /*yield*/, Audio_1.AudioModel.findById(contentId).select('_id')];
            case 3:
                content = _a.sent();
                return [3 /*break*/, 8];
            case 4:
                if (!isVideoMusic) return [3 /*break*/, 6];
                return [4 /*yield*/, VideoMusic_1.VideoMusicModel.findById(contentId).select('_id')];
            case 5:
                content = _a.sent();
                return [3 /*break*/, 8];
            case 6: return [4 /*yield*/, Content_1.ContentModel.findById(contentId).select('_id')];
            case 7:
                content = _a.sent();
                _a.label = 8;
            case 8:
                if (!content) {
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'Content not found' })];
                }
                return [4 /*yield*/, UserWishlist_1.UserWishlistModel.findOne({ userId: userObjectId, contentId: contentId, profileId: profileId })];
            case 9:
                existingWishlist = _a.sent();
                if (!existingWishlist) return [3 /*break*/, 12];
                // Remove from wishlist
                return [4 /*yield*/, UserWishlist_1.UserWishlistModel.deleteOne({ _id: existingWishlist._id })];
            case 10:
                // Remove from wishlist
                _a.sent();
                return [4 /*yield*/, User_1.UserModel.findByIdAndUpdate(userObjectId, { $inc: { watchlistCount: -1 } })];
            case 11:
                _a.sent();
                return [2 /*return*/, reply.send({
                        success: true,
                        message: 'Removed from wishlist',
                        isWishlisted: false,
                        data: { id: existingWishlist._id.toString(), type: rawType }
                    })];
            case 12: return [4 /*yield*/, UserWishlist_1.UserWishlistModel.create({
                    userId: userObjectId,
                    contentId: contentId,
                    contentModelType: contentModelType,
                    profileId: profileId,
                })];
            case 13:
                newWishlist = _a.sent();
                return [4 /*yield*/, User_1.UserModel.findByIdAndUpdate(userObjectId, { $inc: { watchlistCount: 1 } })];
            case 14:
                _a.sent();
                return [2 /*return*/, reply.send({
                        success: true,
                        message: 'Added to wishlist',
                        isWishlisted: true,
                        data: { id: newWishlist._id.toString(), type: rawType }
                    })];
            case 15: return [3 /*break*/, 17];
            case 16:
                error_1 = _a.sent();
                logger_1.logger.error({ error: error_1 }, 'Error toggling wishlist');
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error', error: error_1.message })];
            case 17: return [2 /*return*/];
        }
    });
}); };
exports.toggleWishlist = toggleWishlist;
var getWishlist = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var user, userId, userObjectId, query, page, limit, skip, profileId, _a, wishlistItems, total, selectFields, movieIds, contentIds, _b, movies, contents, movieMap_1, contentMap_1, mappedItems, error_2;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                user = request.user;
                if (!user || !user.id) {
                    return [2 /*return*/, reply.status(401).send({ success: false, message: 'Unauthorized' })];
                }
                userId = user.id;
                userObjectId = new mongoose_1.default.Types.ObjectId(userId);
                query = request.query;
                page = Math.max(1, Number(query.page || 1));
                limit = Math.min(50, Math.max(1, Number(query.limit || 20)));
                skip = (page - 1) * limit;
                profileId = query.profileId || null;
                return [4 /*yield*/, Promise.all([
                        UserWishlist_1.UserWishlistModel.find({ userId: userObjectId, profileId: profileId })
                            .sort({ createdAt: -1 })
                            .skip(skip)
                            .limit(limit)
                            .lean(),
                        UserWishlist_1.UserWishlistModel.countDocuments({ userId: userObjectId, profileId: profileId }),
                    ])];
            case 1:
                _a = _c.sent(), wishlistItems = _a[0], total = _a[1];
                selectFields = 'title description shortDescription thumbnail bannerImage posterImage year rating ageRating duration imdbRating type contentType createdAt';
                movieIds = wishlistItems.filter(function (i) { return i.contentModelType === 'Movie'; }).map(function (i) { return i.contentId; });
                contentIds = wishlistItems.filter(function (i) { return i.contentModelType === 'Content'; }).map(function (i) { return i.contentId; });
                return [4 /*yield*/, Promise.all([
                        movieIds.length > 0 ? Movie_1.MovieModel.find({ _id: { $in: movieIds } }).select(selectFields).lean() : Promise.resolve([]),
                        contentIds.length > 0 ? Content_1.ContentModel.find({ _id: { $in: contentIds } }).select(selectFields).lean() : Promise.resolve([]),
                    ])];
            case 2:
                _b = _c.sent(), movies = _b[0], contents = _b[1];
                movieMap_1 = new Map(movies.map(function (m) { return [m._id.toString(), m]; }));
                contentMap_1 = new Map(contents.map(function (c) { return [c._id.toString(), c]; }));
                mappedItems = wishlistItems.map(function (item) {
                    var _a, _b;
                    var isMovie = item.contentModelType === 'Movie';
                    var c = isMovie ? movieMap_1.get(item.contentId.toString()) : contentMap_1.get(item.contentId.toString());
                    if (!c)
                        return null;
                    // For Content model: use contentType field ('drama' | 'series' | 'movie')
                    // For Movie model: always 'movie'
                    var contentType = isMovie ? 'movie' : (c.contentType || c.type || 'series');
                    var type = contentType === 'drama' ? 'drama' : (c.type === 'series' || contentType === 'series' ? 'show' : 'movie');
                    return {
                        id: c._id.toString(),
                        contentId: item.contentId.toString(),
                        title: c.title,
                        poster: c.posterImage || c.thumbnail || '',
                        backdrop: c.bannerImage || c.thumbnail || '',
                        type: type,
                        contentType: contentType,
                        year: ((_a = c.year) === null || _a === void 0 ? void 0 : _a.toString()) || new Date(c.createdAt).getFullYear().toString(),
                        duration: c.duration ? "".concat(c.duration, "m") : '120m',
                        imdbRating: ((_b = c.imdbRating) === null || _b === void 0 ? void 0 : _b.toString()) || (c.rating || '8.0'),
                        ageRating: c.ageRating ? "".concat(c.ageRating, "+") : 'U/A 13+',
                        description: c.shortDescription || c.description || '',
                        language: c.languages && c.languages.length > 0 ? 'Multi' : 'EN',
                        genres: (c.genres || []).map(function (g) { return (g === null || g === void 0 ? void 0 : g.name) || g; }),
                        seasons: type === 'show' ? c.seasons || 1 : undefined,
                        addedAt: item.createdAt
                    };
                }).filter(Boolean);
                return [2 /*return*/, reply.send({
                        success: true,
                        data: {
                            items: mappedItems,
                            pagination: {
                                total: total,
                                page: page,
                                limit: limit,
                                totalPages: Math.ceil(total / limit),
                            },
                        },
                    })];
            case 3:
                error_2 = _c.sent();
                logger_1.logger.error({ error: error_2 }, 'Error fetching wishlist');
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error', error: error_2.message })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getWishlist = getWishlist;
