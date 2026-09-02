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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEpisodeLock = exports.appendContentVideo = exports.updateContentStatus = exports.deleteContent = exports.updateContent = exports.createContent = exports.getContentById = exports.getAllContents = void 0;
var Content_1 = require("../models/Content");
var Episode_1 = require("../models/Episode");
var Section_1 = require("../models/Section");
var logger_1 = require("../lib/logger");
var categoryController_1 = require("./categoryController");
var videoProcessor_1 = require("../services/videoProcessor");
var syncSections = function (contentIdStr, sections) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Section_1.SectionModel.updateMany({ manualContentIds: contentIdStr }, { $pull: { manualContentIds: contentIdStr } })];
            case 1:
                _a.sent();
                if (!(sections && Array.isArray(sections) && sections.length > 0)) return [3 /*break*/, 3];
                return [4 /*yield*/, Section_1.SectionModel.updateMany({ _id: { $in: sections } }, { $addToSet: { manualContentIds: contentIdStr } })];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
var getAllContents = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var query, page, limit, skip, filter, _a, contents, total, contentIds, episodeCounts, episodeCountMap_1, _i, episodeCounts_1, e, data, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                query = request.query;
                page = Math.max(1, Number(query.page || 1));
                limit = Math.min(100, Math.max(1, Number(query.limit || 20)));
                skip = (page - 1) * limit;
                filter = {};
                if (query.status)
                    filter.status = query.status;
                if (query.contentType)
                    filter.contentType = query.contentType;
                if (query.type)
                    filter.type = query.type;
                if (query.featured === 'true')
                    filter.featured = true;
                if (query.trending === 'true')
                    filter.trending = true;
                if (query.search) {
                    filter.$or = [
                        { title: new RegExp(query.search, 'i') },
                        { description: new RegExp(query.search, 'i') },
                        { tags: new RegExp(query.search, 'i') },
                    ];
                }
                return [4 /*yield*/, Promise.all([
                        Content_1.ContentModel.find(filter)
                            .populate('genres', 'name image')
                            .populate('categories', 'name thumbnail')
                            .populate('languages', 'name code')
                            .populate('subtitleLanguages', 'name code')
                            .populate('audioLanguages', 'name code')
                            .populate('cast.actor', 'name image designation')
                            .populate('crew.director', 'name image designation')
                            .populate('crewMembers.crewMember', 'name image designation')
                            .sort({ createdAt: -1 })
                            .skip(skip)
                            .limit(limit)
                            .lean(),
                        Content_1.ContentModel.countDocuments(filter),
                    ])];
            case 1:
                _a = _b.sent(), contents = _a[0], total = _a[1];
                contentIds = contents.map(function (c) { return c._id; });
                return [4 /*yield*/, Episode_1.EpisodeModel.aggregate([
                        { $match: { contentId: { $in: contentIds } } },
                        { $group: { _id: '$contentId', count: { $sum: 1 } } },
                    ])];
            case 2:
                episodeCounts = _b.sent();
                episodeCountMap_1 = {};
                for (_i = 0, episodeCounts_1 = episodeCounts; _i < episodeCounts_1.length; _i++) {
                    e = episodeCounts_1[_i];
                    episodeCountMap_1[e._id.toString()] = e.count;
                }
                data = contents.map(function (c) {
                    var _a, _b;
                    return (__assign(__assign({}, c), { id: (_a = c._id) === null || _a === void 0 ? void 0 : _a.toString(), episodeCount: episodeCountMap_1[(_b = c._id) === null || _b === void 0 ? void 0 : _b.toString()] || 0 }));
                });
                return [2 /*return*/, reply.send({
                        success: true,
                        data: data,
                        pagination: { page: page, limit: limit, total: total, pages: Math.ceil(total / limit) },
                    })];
            case 3:
                error_1 = _b.sent();
                logger_1.logger.error({ error: error_1 }, 'Error getting all contents');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_1.message })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getAllContents = getAllContents;
var getContentById = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, content, episodes, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                id = request.params.id;
                return [4 /*yield*/, Content_1.ContentModel.findById(id)
                        .populate('genres', 'name image')
                        .populate('categories', 'name thumbnail')
                        .populate('languages', 'name code')
                        .populate('subtitleLanguages', 'name code')
                        .populate('audioLanguages', 'name code')
                        .populate('cast.actor', 'name image designation')
                        .populate('crew.director', 'name image designation')
                        .populate('crewMembers.crewMember', 'name image designation')
                        .lean()];
            case 1:
                content = _b.sent();
                if (!content) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Content not found' })];
                }
                return [4 /*yield*/, Episode_1.EpisodeModel.find({ contentId: id })
                        .sort({ season: 1, episode: 1 })
                        .lean()];
            case 2:
                episodes = _b.sent();
                return [2 /*return*/, reply.send({
                        success: true,
                        data: {
                            content: __assign(__assign({}, content), { id: (_a = content._id) === null || _a === void 0 ? void 0 : _a.toString() }),
                            episodes: episodes.map(function (e) { var _a; return (__assign(__assign({}, e), { id: (_a = e._id) === null || _a === void 0 ? void 0 : _a.toString() })); }),
                        },
                    })];
            case 3:
                error_2 = _b.sent();
                logger_1.logger.error({ error: error_2 }, 'Error getting content by ID');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_2.message })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getContentById = getContentById;
var createContent = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var body, content, error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                body = request.body;
                // Default to drama/series for short dramas
                if (!body.type)
                    body.type = 'series';
                if (!body.contentType)
                    body.contentType = 'drama';
                return [4 /*yield*/, Content_1.ContentModel.create(body)];
            case 1:
                content = _b.sent();
                return [4 /*yield*/, syncSections(content._id.toString(), body.sections)];
            case 2:
                _b.sent();
                return [2 /*return*/, reply.status(201).send({
                        success: true,
                        data: __assign(__assign({}, content.toObject()), { id: (_a = content._id) === null || _a === void 0 ? void 0 : _a.toString() }),
                    })];
            case 3:
                error_3 = _b.sent();
                logger_1.logger.error({ error: error_3 }, 'Error creating content');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_3.message })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.createContent = createContent;
var updateContent = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, body, content, error_4;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                id = request.params.id;
                body = request.body;
                return [4 /*yield*/, Content_1.ContentModel.findByIdAndUpdate(id, { $set: body }, { returnDocument: 'after', runValidators: true }).lean()];
            case 1:
                content = _b.sent();
                if (!content) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Content not found' })];
                }
                if (!(body.sections !== undefined)) return [3 /*break*/, 3];
                return [4 /*yield*/, syncSections(id, body.sections)];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3: return [2 /*return*/, reply.send({
                    success: true,
                    data: __assign(__assign({}, content), { id: (_a = content._id) === null || _a === void 0 ? void 0 : _a.toString() }),
                })];
            case 4:
                error_4 = _b.sent();
                logger_1.logger.error({ error: error_4 }, 'Error updating content');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_4.message })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.updateContent = updateContent;
var deleteContent = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, content, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                id = request.params.id;
                return [4 /*yield*/, Content_1.ContentModel.findByIdAndDelete(id)];
            case 1:
                content = _a.sent();
                if (!content) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Content not found' })];
                }
                return [4 /*yield*/, syncSections(id, [])];
            case 2:
                _a.sent();
                // Delete associated episodes
                return [4 /*yield*/, Episode_1.EpisodeModel.deleteMany({ contentId: id })];
            case 3:
                // Delete associated episodes
                _a.sent();
                return [2 /*return*/, reply.send({ success: true, message: 'Content deleted successfully' })];
            case 4:
                error_5 = _a.sent();
                logger_1.logger.error({ error: error_5 }, 'Error deleting content');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_5.message })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.deleteContent = deleteContent;
var updateContentStatus = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, status_1, rejectionReason, updateData, content, error_6;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                id = request.params.id;
                _a = request.body, status_1 = _a.status, rejectionReason = _a.rejectionReason;
                updateData = { status: status_1 };
                if (rejectionReason && status_1 === 'rejected')
                    updateData.rejectionReason = rejectionReason;
                return [4 /*yield*/, Content_1.ContentModel.findByIdAndUpdate(id, { $set: updateData }, { returnDocument: 'after', runValidators: true }).lean()];
            case 1:
                content = _c.sent();
                if (!content) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Content not found' })];
                }
                return [2 /*return*/, reply.send({
                        success: true,
                        data: __assign(__assign({}, content), { id: (_b = content._id) === null || _b === void 0 ? void 0 : _b.toString() }),
                    })];
            case 2:
                error_6 = _c.sent();
                logger_1.logger.error({ error: error_6 }, 'Error updating content status');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_6.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateContentStatus = updateContentStatus;
var appendContentVideo = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, content, reelDurationMinutes, totalDurationMinutes, freeEpisodeCount, lockEpisodes, videoUrl, videoFilePath, seasonNumber, _a, _b, _c, part, v, v, s, writeFile, join, fileURLToPath, __filename_1, __dirname_1, uploadsDir, mkdirSync, filename, fullPath, chunks, _d, _e, _f, chunk, e_1_1, e_2_1, sourceVideoUrl, episodes, error_7;
    var _g, e_2, _h, _j, _k, e_1, _l, _m;
    return __generator(this, function (_o) {
        switch (_o.label) {
            case 0:
                _o.trys.push([0, 34, , 35]);
                id = request.params.id;
                return [4 /*yield*/, Content_1.ContentModel.findById(id)];
            case 1:
                content = _o.sent();
                if (!content) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Content not found' })];
                }
                reelDurationMinutes = 3.5;
                totalDurationMinutes = void 0;
                freeEpisodeCount = void 0;
                lockEpisodes = true;
                videoUrl = void 0;
                videoFilePath = void 0;
                seasonNumber = 1;
                _o.label = 2;
            case 2:
                _o.trys.push([2, 26, 27, 32]);
                _a = true, _b = __asyncValues(request.parts());
                _o.label = 3;
            case 3: return [4 /*yield*/, _b.next()];
            case 4:
                if (!(_c = _o.sent(), _g = _c.done, !_g)) return [3 /*break*/, 25];
                _j = _c.value;
                _a = false;
                part = _j;
                if (!(part.type === 'field')) return [3 /*break*/, 5];
                if (part.fieldname === 'reelDurationMinutes') {
                    v = Number(part.value) || 3.5;
                    // Short dramas: cap episode duration at 3 minutes 30 seconds
                    reelDurationMinutes = content.contentType === 'drama' ? Math.min(v, 3.5) : v;
                }
                if (part.fieldname === 'totalDurationMinutes') {
                    v = Number(part.value);
                    if (v > 0)
                        totalDurationMinutes = v;
                }
                if (part.fieldname === 'freeEpisodeCount')
                    freeEpisodeCount = Number(part.value);
                if (part.fieldname === 'lockEpisodes')
                    lockEpisodes = part.value !== 'false';
                if (part.fieldname === 'videoUrl')
                    videoUrl = part.value;
                if (part.fieldname === 'season') {
                    s = Number(part.value);
                    if (s > 0)
                        seasonNumber = s;
                }
                return [3 /*break*/, 24];
            case 5:
                if (!(part.type === 'file' && part.fieldname === 'videoFile')) return [3 /*break*/, 24];
                return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('fs/promises')); })];
            case 6:
                writeFile = (_o.sent()).writeFile;
                return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('path')); })];
            case 7:
                join = (_o.sent()).join;
                return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('url')); })];
            case 8:
                fileURLToPath = (_o.sent()).fileURLToPath;
                __filename_1 = fileURLToPath(import.meta.url);
                return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('path')); })];
            case 9:
                __dirname_1 = (_o.sent()).dirname(__filename_1);
                uploadsDir = join(__dirname_1, '../../uploads/videos');
                return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('fs')); })];
            case 10:
                mkdirSync = (_o.sent()).mkdirSync;
                mkdirSync(uploadsDir, { recursive: true });
                filename = "".concat(Date.now(), "_").concat(part.filename);
                fullPath = join(uploadsDir, filename);
                chunks = [];
                _o.label = 11;
            case 11:
                _o.trys.push([11, 16, 17, 22]);
                _d = true, _e = (e_1 = void 0, __asyncValues(part.file));
                _o.label = 12;
            case 12: return [4 /*yield*/, _e.next()];
            case 13:
                if (!(_f = _o.sent(), _k = _f.done, !_k)) return [3 /*break*/, 15];
                _m = _f.value;
                _d = false;
                chunk = _m;
                chunks.push(chunk);
                _o.label = 14;
            case 14:
                _d = true;
                return [3 /*break*/, 12];
            case 15: return [3 /*break*/, 22];
            case 16:
                e_1_1 = _o.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 22];
            case 17:
                _o.trys.push([17, , 20, 21]);
                if (!(!_d && !_k && (_l = _e.return))) return [3 /*break*/, 19];
                return [4 /*yield*/, _l.call(_e)];
            case 18:
                _o.sent();
                _o.label = 19;
            case 19: return [3 /*break*/, 21];
            case 20:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 21: return [7 /*endfinally*/];
            case 22: return [4 /*yield*/, writeFile(fullPath, Buffer.concat(chunks))];
            case 23:
                _o.sent();
                videoFilePath = "/uploads/videos/".concat(filename);
                _o.label = 24;
            case 24:
                _a = true;
                return [3 /*break*/, 3];
            case 25: return [3 /*break*/, 32];
            case 26:
                e_2_1 = _o.sent();
                e_2 = { error: e_2_1 };
                return [3 /*break*/, 32];
            case 27:
                _o.trys.push([27, , 30, 31]);
                if (!(!_a && !_g && (_h = _b.return))) return [3 /*break*/, 29];
                return [4 /*yield*/, _h.call(_b)];
            case 28:
                _o.sent();
                _o.label = 29;
            case 29: return [3 /*break*/, 31];
            case 30:
                if (e_2) throw e_2.error;
                return [7 /*endfinally*/];
            case 31: return [7 /*endfinally*/];
            case 32:
                sourceVideoUrl = videoUrl || videoFilePath;
                if (!sourceVideoUrl) {
                    return [2 /*return*/, reply.status(400).send({ success: false, error: 'Video URL or file required' })];
                }
                return [4 /*yield*/, (0, categoryController_1.createEpisodeSlices)({
                        contentId: content._id,
                        sourceVideoUrl: sourceVideoUrl,
                        sourceVideoPath: (0, videoProcessor_1.toLocalUploadPath)(sourceVideoUrl) || sourceVideoUrl,
                        reelDurationMinutes: reelDurationMinutes,
                        totalDurationMinutes: totalDurationMinutes,
                        freeEpisodeCount: freeEpisodeCount,
                        lockEpisodes: lockEpisodes,
                        seasonNumber: seasonNumber,
                    })];
            case 33:
                episodes = _o.sent();
                return [2 /*return*/, reply.send({
                        success: true,
                        message: "Created ".concat(episodes.length, " episodes"),
                        data: episodes,
                    })];
            case 34:
                error_7 = _o.sent();
                logger_1.logger.error({ error: error_7 }, 'Error appending content video');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_7.message })];
            case 35: return [2 /*return*/];
        }
    });
}); };
exports.appendContentVideo = appendContentVideo;
var updateEpisodeLock = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var episodeId, isLocked, episode, error_8;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                episodeId = request.params.episodeId;
                isLocked = request.body.isLocked;
                return [4 /*yield*/, Episode_1.EpisodeModel.findByIdAndUpdate(episodeId, { $set: { isLocked: isLocked } }, { returnDocument: 'after' }).lean()];
            case 1:
                episode = _b.sent();
                if (!episode) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Episode not found' })];
                }
                return [2 /*return*/, reply.send({ success: true, data: __assign(__assign({}, episode), { id: (_a = episode._id) === null || _a === void 0 ? void 0 : _a.toString() }) })];
            case 2:
                error_8 = _b.sent();
                logger_1.logger.error({ error: error_8 }, 'Error updating episode lock');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_8.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateEpisodeLock = updateEpisodeLock;
