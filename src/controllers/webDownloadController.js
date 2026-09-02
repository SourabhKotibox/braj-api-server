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
exports.webDeleteDownload = exports.webGetDownloads = exports.webRequestDownload = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var Movie_1 = require("../models/Movie");
var Content_1 = require("../models/Content");
var Episode_1 = require("../models/Episode");
var UserDownload_1 = require("../models/UserDownload");
var logger_1 = require("../lib/logger");
var s3_1 = require("../lib/s3");
var toAbsoluteUrl = function (request, url, s3Active, s3BaseUrl) {
    if (!url)
        return null;
    if (url.startsWith('http://') || url.startsWith('https://'))
        return url;
    var isLocalHls = url.startsWith('hls/') || url.startsWith('/uploads/hls/') || url.includes('/hls/');
    if (s3Active && !isLocalHls) {
        var cleanKey = url;
        if (cleanKey.startsWith('/'))
            cleanKey = cleanKey.slice(1);
        if (cleanKey.startsWith('uploads/'))
            cleanKey = cleanKey.replace('uploads/', '');
        if (cleanKey.startsWith('/uploads/'))
            cleanKey = cleanKey.replace('/uploads/', '');
        return "".concat(s3BaseUrl, "/").concat(cleanKey);
    }
    var relPath = url;
    if (!relPath.startsWith('/uploads/')) {
        relPath = relPath.startsWith('uploads/') ? "/".concat(relPath) : "/uploads/".concat(relPath.startsWith('/') ? relPath.slice(1) : relPath);
    }
    var baseUrl = "".concat(request.protocol, "://").concat(request.hostname);
    return "".concat(baseUrl).concat(relPath);
};
// POST /api/web/download
var webRequestDownload = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var userPayload, userId, userObjectId, _a, contentId, episodeId, contentType, profileId, s3Active, s3BaseUrl, s3Url, downloadUrl, title, parentTitle, thumbnail, duration, contentModelType, downloadDoc, movie, _b, content, episode, error_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 10, , 11]);
                userPayload = request.user;
                if (!(userPayload === null || userPayload === void 0 ? void 0 : userPayload.id)) {
                    return [2 /*return*/, reply.status(401).send({ success: false, message: 'Unauthorized' })];
                }
                userId = userPayload.id;
                if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
                    return [2 /*return*/, reply.status(401).send({ success: false, message: 'Invalid user token' })];
                }
                userObjectId = new mongoose_1.default.Types.ObjectId(userId);
                _a = (request.body || {}), contentId = _a.contentId, episodeId = _a.episodeId, contentType = _a.contentType, profileId = _a.profileId;
                if (!contentId || !mongoose_1.default.Types.ObjectId.isValid(contentId)) {
                    return [2 /*return*/, reply.status(400).send({ success: false, message: 'Invalid or missing contentId' })];
                }
                return [4 /*yield*/, (0, s3_1.isS3Configured)()];
            case 1:
                s3Active = _c.sent();
                s3BaseUrl = '';
                if (!s3Active) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, s3_1.getS3PublicUrl)('')];
            case 2:
                s3Url = _c.sent();
                s3BaseUrl = s3Url.endsWith('/') ? s3Url.slice(0, -1) : s3Url;
                _c.label = 3;
            case 3:
                downloadUrl = '';
                title = '';
                parentTitle = '';
                thumbnail = '';
                duration = 0;
                contentModelType = 'Movie';
                downloadDoc = null;
                if (!(contentType === 'movie')) return [3 /*break*/, 6];
                return [4 /*yield*/, Movie_1.MovieModel.findById(contentId).lean()];
            case 4:
                movie = _c.sent();
                if (!movie || movie.status !== 'published') {
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'Movie not found' })];
                }
                title = movie.title;
                thumbnail = toAbsoluteUrl(request, movie.thumbnail || '', s3Active, s3BaseUrl) || '';
                duration = movie.duration || 0;
                downloadUrl = toAbsoluteUrl(request, movie.videoUrl || movie.hlsUrl || '', s3Active, s3BaseUrl) || '';
                contentModelType = 'Movie';
                return [4 /*yield*/, UserDownload_1.UserDownloadModel.findOneAndUpdate({ userId: userObjectId, contentId: contentId, episodeId: null, profileId: profileId || null }, { $setOnInsert: { contentModelType: contentModelType } }, { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true })];
            case 5:
                downloadDoc = _c.sent();
                return [3 /*break*/, 9];
            case 6:
                if (!episodeId || !mongoose_1.default.Types.ObjectId.isValid(episodeId)) {
                    return [2 /*return*/, reply.status(400).send({ success: false, message: 'episodeId is required for drama/series content' })];
                }
                return [4 /*yield*/, Promise.all([
                        Content_1.ContentModel.findById(contentId).lean(),
                        Episode_1.EpisodeModel.findById(episodeId).lean(),
                    ])];
            case 7:
                _b = _c.sent(), content = _b[0], episode = _b[1];
                if (!content || content.status !== 'published') {
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'Content not found' })];
                }
                if (!episode || episode.processingStatus !== 'ready') {
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'Episode not found or not ready' })];
                }
                title = episode.title;
                parentTitle = content.title;
                thumbnail = toAbsoluteUrl(request, episode.thumbnail || content.thumbnail || '', s3Active, s3BaseUrl) || '';
                duration = episode.duration || 0;
                downloadUrl = toAbsoluteUrl(request, episode.sourceVideoUrl || episode.hlsUrl || '', s3Active, s3BaseUrl) || '';
                contentModelType = 'Content';
                return [4 /*yield*/, UserDownload_1.UserDownloadModel.findOneAndUpdate({ userId: userObjectId, contentId: contentId, episodeId: episodeId, profileId: profileId || null }, { $setOnInsert: { contentModelType: contentModelType } }, { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true })];
            case 8:
                downloadDoc = _c.sent();
                _c.label = 9;
            case 9:
                if (!downloadUrl) {
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'No video URL available for this content' })];
                }
                return [2 /*return*/, reply.send({
                        success: true,
                        data: {
                            id: downloadDoc._id.toString(),
                            contentId: contentId,
                            episodeId: episodeId || null,
                            contentType: contentType,
                            title: title,
                            parentTitle: parentTitle,
                            thumbnail: thumbnail,
                            duration: duration,
                            downloadUrl: downloadUrl,
                        },
                    })];
            case 10:
                error_1 = _c.sent();
                logger_1.logger.error(error_1, 'Error in webRequestDownload');
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Failed to process download request', error: error_1.message })];
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.webRequestDownload = webRequestDownload;
// GET /api/web/downloads
var webGetDownloads = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var userPayload, userId, userObjectId, s3Active, s3BaseUrl, s3Url, profileId, downloads, result, _i, downloads_1, dl, movie, _a, content, episode, error_2;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 11, , 12]);
                userPayload = request.user;
                if (!(userPayload === null || userPayload === void 0 ? void 0 : userPayload.id)) {
                    return [2 /*return*/, reply.status(401).send({ success: false, message: 'Unauthorized' })];
                }
                userId = userPayload.id;
                if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
                    return [2 /*return*/, reply.status(401).send({ success: false, message: 'Invalid user token' })];
                }
                userObjectId = new mongoose_1.default.Types.ObjectId(userId);
                return [4 /*yield*/, (0, s3_1.isS3Configured)()];
            case 1:
                s3Active = _c.sent();
                s3BaseUrl = '';
                if (!s3Active) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, s3_1.getS3PublicUrl)('')];
            case 2:
                s3Url = _c.sent();
                s3BaseUrl = s3Url.endsWith('/') ? s3Url.slice(0, -1) : s3Url;
                _c.label = 3;
            case 3:
                profileId = request.query.profileId;
                return [4 /*yield*/, UserDownload_1.UserDownloadModel.find({ userId: userObjectId, profileId: profileId || null }).sort({ createdAt: -1 }).lean()];
            case 4:
                downloads = _c.sent();
                result = [];
                _i = 0, downloads_1 = downloads;
                _c.label = 5;
            case 5:
                if (!(_i < downloads_1.length)) return [3 /*break*/, 10];
                dl = downloads_1[_i];
                if (!(dl.contentModelType === 'Movie')) return [3 /*break*/, 7];
                return [4 /*yield*/, Movie_1.MovieModel.findById(dl.contentId).lean()];
            case 6:
                movie = _c.sent();
                if (!movie || movie.status !== 'published')
                    return [3 /*break*/, 9];
                result.push({
                    id: dl._id.toString(),
                    contentId: dl.contentId.toString(),
                    episodeId: null,
                    contentType: 'movie',
                    title: movie.title,
                    parentTitle: '',
                    thumbnail: toAbsoluteUrl(request, movie.thumbnail || '', s3Active, s3BaseUrl) || '',
                    duration: movie.duration || 0,
                    downloadUrl: toAbsoluteUrl(request, movie.videoUrl || movie.hlsUrl || '', s3Active, s3BaseUrl) || '',
                    createdAt: dl.createdAt,
                });
                return [3 /*break*/, 9];
            case 7: return [4 /*yield*/, Promise.all([
                    Content_1.ContentModel.findById(dl.contentId).lean(),
                    dl.episodeId ? Episode_1.EpisodeModel.findById(dl.episodeId).lean() : Promise.resolve(null),
                ])];
            case 8:
                _a = _c.sent(), content = _a[0], episode = _a[1];
                if (!content || content.status !== 'published' || !episode || episode.processingStatus !== 'ready')
                    return [3 /*break*/, 9];
                result.push({
                    id: dl._id.toString(),
                    contentId: dl.contentId.toString(),
                    episodeId: ((_b = dl.episodeId) === null || _b === void 0 ? void 0 : _b.toString()) || null,
                    contentType: content.contentType === 'drama' ? 'drama' : 'series',
                    title: episode.title,
                    parentTitle: content.title,
                    thumbnail: toAbsoluteUrl(request, episode.thumbnail || content.thumbnail || '', s3Active, s3BaseUrl) || '',
                    duration: episode.duration || 0,
                    downloadUrl: toAbsoluteUrl(request, episode.sourceVideoUrl || episode.hlsUrl || '', s3Active, s3BaseUrl) || '',
                    createdAt: dl.createdAt,
                });
                _c.label = 9;
            case 9:
                _i++;
                return [3 /*break*/, 5];
            case 10: return [2 /*return*/, reply.send({ success: true, data: result })];
            case 11:
                error_2 = _c.sent();
                logger_1.logger.error(error_2, 'Error in webGetDownloads');
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Failed to fetch downloads', error: error_2.message })];
            case 12: return [2 /*return*/];
        }
    });
}); };
exports.webGetDownloads = webGetDownloads;
// DELETE /api/web/downloads/:id
var webDeleteDownload = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var userPayload, userId, userObjectId, id, deleted, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userPayload = request.user;
                if (!(userPayload === null || userPayload === void 0 ? void 0 : userPayload.id)) {
                    return [2 /*return*/, reply.status(401).send({ success: false, message: 'Unauthorized' })];
                }
                userId = userPayload.id;
                if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
                    return [2 /*return*/, reply.status(401).send({ success: false, message: 'Invalid user token' })];
                }
                userObjectId = new mongoose_1.default.Types.ObjectId(userId);
                id = request.params.id;
                if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                    return [2 /*return*/, reply.status(400).send({ success: false, message: 'Invalid download ID' })];
                }
                return [4 /*yield*/, UserDownload_1.UserDownloadModel.findOneAndDelete({
                        _id: new mongoose_1.default.Types.ObjectId(id),
                        userId: userObjectId,
                    })];
            case 1:
                deleted = _a.sent();
                if (!deleted) {
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'Download record not found' })];
                }
                return [2 /*return*/, reply.send({ success: true, message: 'Download removed' })];
            case 2:
                error_3 = _a.sent();
                logger_1.logger.error(error_3, 'Error in webDeleteDownload');
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Failed to delete download', error: error_3.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.webDeleteDownload = webDeleteDownload;
