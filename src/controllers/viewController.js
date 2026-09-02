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
exports.recordView = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var Content_1 = require("../models/Content");
var Movie_1 = require("../models/Movie");
var Episode_1 = require("../models/Episode");
var UserView_1 = require("../models/UserView");
var logger_1 = require("../lib/logger");
// Helpers to fetch content and update views
var findContent = function (contentId, contentType) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (contentType === 'movie') {
            return [2 /*return*/, Movie_1.MovieModel.findById(contentId).select('views').lean()];
        }
        return [2 /*return*/, Content_1.ContentModel.findById(contentId).select('views').lean()];
    });
}); };
var updateViews = function (contentId, contentType, increment) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (contentType === 'movie') {
            return [2 /*return*/, Movie_1.MovieModel.findByIdAndUpdate(contentId, { $inc: { views: increment } }, { returnDocument: 'after' }).select('views').lean()];
        }
        return [2 /*return*/, Content_1.ContentModel.findByIdAndUpdate(contentId, { $inc: { views: increment } }, { returnDocument: 'after' }).select('views').lean()];
    });
}); };
var updateEpisodeViews = function (episodeId, increment) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, Episode_1.EpisodeModel.findByIdAndUpdate(episodeId, { $inc: { views: increment } }, { returnDocument: 'after' }).select('views').lean()];
    });
}); };
var recordView = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, userObjectId, _a, contentId, body, contentType, contentModelType, episodeId, content, episode, viewQuery, existingView, viewsCount_1, ep, c, viewsCount, updated, updated, error_1;
    var _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 19, , 20]);
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
                        message: 'Authentication required. Please login to watch content.',
                    })];
            case 4:
                contentId = request.params.contentId;
                body = request.body;
                contentType = (body === null || body === void 0 ? void 0 : body.contentType) || 'drama';
                contentModelType = contentType === 'movie' ? 'Movie' : 'Content';
                episodeId = (body === null || body === void 0 ? void 0 : body.episodeId) || null;
                // Validate IDs
                if (!mongoose_1.default.Types.ObjectId.isValid(contentId)) {
                    return [2 /*return*/, reply.status(400).send({ success: false, message: 'Invalid contentId.' })];
                }
                if (episodeId && !mongoose_1.default.Types.ObjectId.isValid(episodeId)) {
                    return [2 /*return*/, reply.status(400).send({ success: false, message: 'Invalid episodeId.' })];
                }
                return [4 /*yield*/, findContent(contentId, contentType)];
            case 5:
                content = _f.sent();
                if (!content) {
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'Content not found.' })];
                }
                if (!episodeId) return [3 /*break*/, 7];
                return [4 /*yield*/, Episode_1.EpisodeModel.findById(episodeId).select('_id views contentId').lean()];
            case 6:
                episode = _f.sent();
                if (!episode) {
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'Episode not found.' })];
                }
                if (episode.contentId.toString() !== contentId) {
                    return [2 /*return*/, reply.status(400).send({ success: false, message: 'Episode does not belong to specified content.' })];
                }
                _f.label = 7;
            case 7:
                viewQuery = episodeId
                    ? { userId: userObjectId, contentId: contentId, episodeId: episodeId }
                    : { userId: userObjectId, contentId: contentId, episodeId: null };
                return [4 /*yield*/, UserView_1.UserViewModel.findOne(viewQuery)];
            case 8:
                existingView = _f.sent();
                if (!existingView) return [3 /*break*/, 13];
                viewsCount_1 = 0;
                if (!episodeId) return [3 /*break*/, 10];
                return [4 /*yield*/, Episode_1.EpisodeModel.findById(episodeId).select('views').lean()];
            case 9:
                ep = _f.sent();
                viewsCount_1 = (_b = ep === null || ep === void 0 ? void 0 : ep.views) !== null && _b !== void 0 ? _b : 0;
                return [3 /*break*/, 12];
            case 10: return [4 /*yield*/, findContent(contentId, contentType)];
            case 11:
                c = _f.sent();
                viewsCount_1 = (_c = c === null || c === void 0 ? void 0 : c.views) !== null && _c !== void 0 ? _c : 0;
                _f.label = 12;
            case 12: return [2 /*return*/, reply.send({
                    success: true,
                    message: 'View already recorded for this user (views count unchanged).',
                    data: {
                        viewsCount: viewsCount_1,
                        viewRecorded: false,
                        episodeId: episodeId || null,
                    }
                })];
            case 13: 
            // New view! Create log and increment views count in the DB.
            return [4 /*yield*/, UserView_1.UserViewModel.create({
                    userId: userObjectId,
                    contentId: contentId,
                    episodeId: episodeId || null,
                    contentModelType: contentModelType
                })];
            case 14:
                // New view! Create log and increment views count in the DB.
                _f.sent();
                viewsCount = 0;
                if (!episodeId) return [3 /*break*/, 16];
                return [4 /*yield*/, updateEpisodeViews(episodeId, 1)];
            case 15:
                updated = _f.sent();
                viewsCount = (_d = updated === null || updated === void 0 ? void 0 : updated.views) !== null && _d !== void 0 ? _d : 0;
                return [3 /*break*/, 18];
            case 16: return [4 /*yield*/, updateViews(contentId, contentType, 1)];
            case 17:
                updated = _f.sent();
                viewsCount = (_e = updated === null || updated === void 0 ? void 0 : updated.views) !== null && _e !== void 0 ? _e : 0;
                _f.label = 18;
            case 18:
                logger_1.logger.info({ userId: userId, contentId: contentId, episodeId: episodeId, contentType: contentType }, 'User recorded a new view');
                return [2 /*return*/, reply.send({
                        success: true,
                        message: 'View recorded successfully.',
                        data: {
                            viewsCount: viewsCount,
                            viewRecorded: true,
                            episodeId: episodeId || null,
                        }
                    })];
            case 19:
                error_1 = _f.sent();
                logger_1.logger.error(error_1, 'Error recording view');
                return [2 /*return*/, reply.status(500).send({
                        success: false,
                        message: 'Failed to record view.',
                        error: error_1.message,
                    })];
            case 20: return [2 /*return*/];
        }
    });
}); };
exports.recordView = recordView;
