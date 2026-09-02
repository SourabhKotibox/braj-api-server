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
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleVideoMusicTrending = exports.toggleVideoMusicFeatured = exports.deleteVideoMusic = exports.updateVideoMusic = exports.createVideoMusic = exports.getVideoMusicById = exports.getAllVideoMusics = void 0;
var VideoMusic_1 = require("../models/VideoMusic");
var logger_1 = require("../lib/logger");
var getAllVideoMusics = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var query, page, limit, skip, filter, _a, videos, total, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                query = request.query;
                page = Math.max(1, Number(query.page || 1));
                limit = Math.min(100, Math.max(1, Number(query.limit || 20)));
                skip = (page - 1) * limit;
                filter = {};
                if (query.status)
                    filter.status = query.status;
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
                if (query.search) {
                    filter.$or = [
                        { title: new RegExp(query.search, 'i') },
                        { artist: new RegExp(query.search, 'i') },
                        { album: new RegExp(query.search, 'i') },
                    ];
                }
                return [4 /*yield*/, Promise.all([
                        VideoMusic_1.VideoMusicModel.find(filter)
                            .populate('genre', 'name')
                            .populate('category', 'name')
                            .populate('language', 'name')
                            .sort({ createdAt: -1 })
                            .skip(skip)
                            .limit(limit)
                            .lean(),
                        VideoMusic_1.VideoMusicModel.countDocuments(filter),
                    ])];
            case 1:
                _a = _b.sent(), videos = _a[0], total = _a[1];
                return [2 /*return*/, reply.send({
                        success: true,
                        data: videos.map(function (v) { var _a; return (__assign(__assign({}, v), { id: (_a = v._id) === null || _a === void 0 ? void 0 : _a.toString() })); }),
                        pagination: { page: page, limit: limit, total: total, pages: Math.ceil(total / limit) },
                    })];
            case 2:
                error_1 = _b.sent();
                logger_1.logger.error({ error: error_1 }, 'Error getting all video musics');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_1.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllVideoMusics = getAllVideoMusics;
var getVideoMusicById = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, video, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                id = request.params.id;
                return [4 /*yield*/, VideoMusic_1.VideoMusicModel.findById(id)
                        .populate('genre', 'name')
                        .populate('category', 'name')
                        .populate('language', 'name')
                        .lean()];
            case 1:
                video = _b.sent();
                if (!video) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Video music not found' })];
                }
                return [2 /*return*/, reply.send({ success: true, data: __assign(__assign({}, video), { id: (_a = video._id) === null || _a === void 0 ? void 0 : _a.toString() }) })];
            case 2:
                error_2 = _b.sent();
                logger_1.logger.error({ error: error_2 }, 'Error getting video music by ID');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_2.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getVideoMusicById = getVideoMusicById;
var createVideoMusic = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var body, isRawLocalVideo, video, error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                body = request.body;
                isRawLocalVideo = body.videoUrl && !body.videoUrl.startsWith('http://') && !body.videoUrl.startsWith('https://');
                if (isRawLocalVideo) {
                    body.processingStatus = 'queued';
                }
                else {
                    body.processingStatus = 'ready';
                }
                return [4 /*yield*/, VideoMusic_1.VideoMusicModel.create(body)];
            case 1:
                video = _b.sent();
                return [2 /*return*/, reply.status(201).send({
                        success: true,
                        data: __assign(__assign({}, video.toObject()), { id: (_a = video._id) === null || _a === void 0 ? void 0 : _a.toString() }),
                    })];
            case 2:
                error_3 = _b.sent();
                logger_1.logger.error({ error: error_3 }, 'Error creating video music');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_3.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createVideoMusic = createVideoMusic;
var updateVideoMusic = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, body, video, error_4;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                id = request.params.id;
                body = request.body;
                return [4 /*yield*/, VideoMusic_1.VideoMusicModel.findByIdAndUpdate(id, { $set: body }, { returnDocument: 'after', runValidators: true })];
            case 1:
                video = _b.sent();
                if (!video) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Video music not found' })];
                }
                return [2 /*return*/, reply.send({ success: true, data: __assign(__assign({}, video.toObject()), { id: (_a = video._id) === null || _a === void 0 ? void 0 : _a.toString() }) })];
            case 2:
                error_4 = _b.sent();
                logger_1.logger.error({ error: error_4 }, 'Error updating video music');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_4.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateVideoMusic = updateVideoMusic;
var deleteVideoMusic = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, video, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = request.params.id;
                return [4 /*yield*/, VideoMusic_1.VideoMusicModel.findByIdAndDelete(id)];
            case 1:
                video = _a.sent();
                if (!video) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Video music not found' })];
                }
                return [2 /*return*/, reply.send({ success: true, message: 'Video music deleted successfully' })];
            case 2:
                error_5 = _a.sent();
                logger_1.logger.error({ error: error_5 }, 'Error deleting video music');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_5.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteVideoMusic = deleteVideoMusic;
var toggleVideoMusicFeatured = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, video, updated, error_6;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                id = request.params.id;
                return [4 /*yield*/, VideoMusic_1.VideoMusicModel.findById(id).lean()];
            case 1:
                video = _b.sent();
                if (!video) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Video music not found' })];
                }
                return [4 /*yield*/, VideoMusic_1.VideoMusicModel.findByIdAndUpdate(id, { $set: { featured: !video.featured } }, { returnDocument: 'after' }).lean()];
            case 2:
                updated = _b.sent();
                return [2 /*return*/, reply.send({ success: true, data: __assign(__assign({}, updated), { id: (_a = updated === null || updated === void 0 ? void 0 : updated._id) === null || _a === void 0 ? void 0 : _a.toString() }) })];
            case 3:
                error_6 = _b.sent();
                logger_1.logger.error({ error: error_6 }, 'Error toggling video music featured');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_6.message })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.toggleVideoMusicFeatured = toggleVideoMusicFeatured;
var toggleVideoMusicTrending = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, video, updated, error_7;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                id = request.params.id;
                return [4 /*yield*/, VideoMusic_1.VideoMusicModel.findById(id).lean()];
            case 1:
                video = _b.sent();
                if (!video) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Video music not found' })];
                }
                return [4 /*yield*/, VideoMusic_1.VideoMusicModel.findByIdAndUpdate(id, { $set: { trending: !video.trending } }, { returnDocument: 'after' }).lean()];
            case 2:
                updated = _b.sent();
                return [2 /*return*/, reply.send({ success: true, data: __assign(__assign({}, updated), { id: (_a = updated === null || updated === void 0 ? void 0 : updated._id) === null || _a === void 0 ? void 0 : _a.toString() }) })];
            case 3:
                error_7 = _b.sent();
                logger_1.logger.error({ error: error_7 }, 'Error toggling video music trending');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_7.message })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.toggleVideoMusicTrending = toggleVideoMusicTrending;
