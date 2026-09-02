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
exports.toggleLike = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var Content_1 = require("../models/Content");
var Movie_1 = require("../models/Movie");
var Episode_1 = require("../models/Episode");
var Audio_1 = require("../models/Audio");
var VideoMusic_1 = require("../models/VideoMusic");
var UserLike_1 = require("../models/UserLike");
var logger_1 = require("../lib/logger");
// Helper: fetch content by id from the right collection
var findContent = function (contentId, contentType) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (contentType === 'movie') {
            return [2 /*return*/, Movie_1.MovieModel.findById(contentId).select('likes').lean()];
        }
        if (contentType === 'audio') {
            return [2 /*return*/, Audio_1.AudioModel.findById(contentId).select('likes').lean()];
        }
        if (contentType === 'videoMusic') {
            return [2 /*return*/, VideoMusic_1.VideoMusicModel.findById(contentId).select('likes').lean()];
        }
        return [2 /*return*/, Content_1.ContentModel.findById(contentId).select('likes').lean()];
    });
}); };
// Helper: atomically increment / decrement likes
var updateLikes = function (contentId, contentType, increment) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (contentType === 'movie') {
            return [2 /*return*/, Movie_1.MovieModel.findByIdAndUpdate(contentId, { $inc: { likes: increment } }, { returnDocument: 'after' }).select('likes').lean()];
        }
        if (contentType === 'audio') {
            return [2 /*return*/, Audio_1.AudioModel.findByIdAndUpdate(contentId, { $inc: { likes: increment } }, { returnDocument: 'after' }).select('likes').lean()];
        }
        if (contentType === 'videoMusic') {
            return [2 /*return*/, VideoMusic_1.VideoMusicModel.findByIdAndUpdate(contentId, { $inc: { likes: increment } }, { returnDocument: 'after' }).select('likes').lean()];
        }
        return [2 /*return*/, Content_1.ContentModel.findByIdAndUpdate(contentId, { $inc: { likes: increment } }, { returnDocument: 'after' }).select('likes').lean()];
    });
}); };
// Helper: atomically increment / decrement likes on an Episode
var updateEpisodeLikes = function (episodeId, increment) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, Episode_1.EpisodeModel.findByIdAndUpdate(episodeId, { $inc: { likes: increment } }, { returnDocument: 'after' }).select('likes').lean()];
    });
}); };
// POST /api/like/:contentId
// Body: { contentType: 'drama' | 'movie', episodeId?: string }
//   - If episodeId is provided  → like is scoped to that specific episode only
//   - If episodeId is omitted   → like is scoped to the whole series / movie
// Header: Authorization: Bearer <token>
var toggleLike = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, userObjectId, _a, contentId, body, contentType, contentModelType, episodeId, content, episode, likeQuery, existingLike, likeCount, updated, updated, likeCount, updated, updated, error_1;
    var _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 21, , 22]);
                userId = void 0;
                userObjectId = void 0;
                _f.label = 1;
            case 1:
                _f.trys.push([1, 3, , 4]);
                return [4 /*yield*/, request.jwtVerify()];
            case 2:
                _f.sent();
                userId = request.user.id;
                userObjectId = new mongoose_1.default.Types.ObjectId(userId);
                return [3 /*break*/, 4];
            case 3:
                _a = _f.sent();
                return [2 /*return*/, reply.status(401).send({
                        success: false,
                        message: 'Authentication required. Please login to like content.',
                    })];
            case 4:
                contentId = request.params.contentId;
                body = request.body;
                contentType = (body === null || body === void 0 ? void 0 : body.contentType) || 'drama';
                contentModelType = contentType === 'movie' ? 'Movie' : contentType === 'audio' ? 'Audio' : contentType === 'videoMusic' ? 'VideoMusic' : 'Content';
                episodeId = (body === null || body === void 0 ? void 0 : body.episodeId) || null;
                // Validate contentId
                if (!mongoose_1.default.Types.ObjectId.isValid(contentId)) {
                    return [2 /*return*/, reply.status(400).send({ success: false, message: 'Invalid contentId.' })];
                }
                // Validate episodeId (if provided)
                if (episodeId && !mongoose_1.default.Types.ObjectId.isValid(episodeId)) {
                    return [2 /*return*/, reply.status(400).send({
                            success: false,
                            message: 'Invalid episodeId.',
                        })];
                }
                return [4 /*yield*/, findContent(contentId, contentType)];
            case 5:
                content = _f.sent();
                if (!content) {
                    return [2 /*return*/, reply.status(404).send({
                            success: false,
                            message: 'Content not found.',
                        })];
                }
                if (!episodeId) return [3 /*break*/, 7];
                return [4 /*yield*/, Episode_1.EpisodeModel.findById(episodeId).select('_id likes contentId').lean()];
            case 6:
                episode = _f.sent();
                if (!episode) {
                    return [2 /*return*/, reply.status(404).send({
                            success: false,
                            message: 'Episode not found.',
                        })];
                }
                if (episode.contentId.toString() !== contentId) {
                    return [2 /*return*/, reply.status(400).send({
                            success: false,
                            message: 'Episode does not belong to the specified content.',
                        })];
                }
                _f.label = 7;
            case 7:
                likeQuery = episodeId
                    ? { userId: userObjectId, contentId: contentId, episodeId: episodeId }
                    : { userId: userObjectId, contentId: contentId, episodeId: null };
                return [4 /*yield*/, UserLike_1.UserLikeModel.findOne(likeQuery)];
            case 8:
                existingLike = _f.sent();
                if (!existingLike) return [3 /*break*/, 14];
                // Already liked → UNLIKE
                return [4 /*yield*/, UserLike_1.UserLikeModel.deleteOne({ _id: existingLike._id })];
            case 9:
                // Already liked → UNLIKE
                _f.sent();
                likeCount = 0;
                if (!episodeId) return [3 /*break*/, 11];
                return [4 /*yield*/, updateEpisodeLikes(episodeId, -1)];
            case 10:
                updated = _f.sent();
                likeCount = Math.max(0, (_b = updated === null || updated === void 0 ? void 0 : updated.likes) !== null && _b !== void 0 ? _b : 0);
                return [3 /*break*/, 13];
            case 11: return [4 /*yield*/, updateLikes(contentId, contentType, -1)];
            case 12:
                updated = _f.sent();
                likeCount = Math.max(0, (_c = updated === null || updated === void 0 ? void 0 : updated.likes) !== null && _c !== void 0 ? _c : 0);
                _f.label = 13;
            case 13:
                logger_1.logger.info({ userId: userId, contentId: contentId, episodeId: episodeId, contentType: contentType }, 'User unliked content');
                return [2 /*return*/, reply.send({
                        success: true,
                        message: 'Video unliked successfully',
                        data: {
                            likeCount: likeCount,
                            isLikedByUser: false,
                            episodeId: episodeId || null,
                        },
                    })];
            case 14: 
            // Not liked → LIKE
            return [4 /*yield*/, UserLike_1.UserLikeModel.create({ userId: userObjectId, contentId: contentId, episodeId: episodeId || null, contentModelType: contentModelType })];
            case 15:
                // Not liked → LIKE
                _f.sent();
                likeCount = 0;
                if (!episodeId) return [3 /*break*/, 17];
                return [4 /*yield*/, updateEpisodeLikes(episodeId, 1)];
            case 16:
                updated = _f.sent();
                likeCount = (_d = updated === null || updated === void 0 ? void 0 : updated.likes) !== null && _d !== void 0 ? _d : 0;
                return [3 /*break*/, 19];
            case 17: return [4 /*yield*/, updateLikes(contentId, contentType, 1)];
            case 18:
                updated = _f.sent();
                likeCount = (_e = updated === null || updated === void 0 ? void 0 : updated.likes) !== null && _e !== void 0 ? _e : 0;
                _f.label = 19;
            case 19:
                logger_1.logger.info({ userId: userId, contentId: contentId, episodeId: episodeId, contentType: contentType }, 'User liked content');
                return [2 /*return*/, reply.send({
                        success: true,
                        message: 'Video liked successfully',
                        data: {
                            likeCount: likeCount,
                            isLikedByUser: true,
                            episodeId: episodeId || null,
                        },
                    })];
            case 20: return [3 /*break*/, 22];
            case 21:
                error_1 = _f.sent();
                logger_1.logger.error(error_1, 'Error toggling like');
                return [2 /*return*/, reply.status(500).send({
                        success: false,
                        message: 'Failed to process like.',
                        error: error_1.message,
                    })];
            case 22: return [2 /*return*/];
        }
    });
}); };
exports.toggleLike = toggleLike;
