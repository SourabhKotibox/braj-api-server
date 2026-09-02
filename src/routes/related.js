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
Object.defineProperty(exports, "__esModule", { value: true });
var relatedRoutes = function (fastify) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        // Related audio tracks endpoint
        fastify.get('/public/audio/related/:id', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
            var AudioModel, id, limit, audio, relatedLimit, filter, query, related, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../models/Audio')); })];
                    case 1:
                        AudioModel = (_a.sent()).AudioModel;
                        id = request.params.id;
                        limit = request.query.limit;
                        return [4 /*yield*/, AudioModel.findById(id).lean()];
                    case 2:
                        audio = _a.sent();
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
                        related = _a.sent();
                        return [2 /*return*/, reply.send({
                                success: true,
                                data: related.map(function (a) { var _a; return (__assign(__assign({}, a), { id: (_a = a._id) === null || _a === void 0 ? void 0 : _a.toString() })); }),
                            })];
                    case 4:
                        error_1 = _a.sent();
                        return [2 /*return*/, reply.status(500).send({ success: false, error: error_1.message })];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
        // Related video music tracks endpoint
        fastify.get('/public/video-music/related/:id', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
            var VideoMusicModel, id, limit, video, relatedLimit, filter, query, related, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../models/VideoMusic')); })];
                    case 1:
                        VideoMusicModel = (_a.sent()).VideoMusicModel;
                        id = request.params.id;
                        limit = request.query.limit;
                        return [4 /*yield*/, VideoMusicModel.findById(id).lean()];
                    case 2:
                        video = _a.sent();
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
                        related = _a.sent();
                        return [2 /*return*/, reply.send({
                                success: true,
                                data: related.map(function (v) { var _a; return (__assign(__assign({}, v), { id: (_a = v._id) === null || _a === void 0 ? void 0 : _a.toString() })); }),
                            })];
                    case 4:
                        error_2 = _a.sent();
                        return [2 /*return*/, reply.status(500).send({ success: false, error: error_2.message })];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); };
exports.default = relatedRoutes;
