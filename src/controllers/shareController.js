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
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordShare = exports.handleShareRedirect = void 0;
var Movie_1 = require("../models/Movie");
var Content_1 = require("../models/Content");
var Audio_1 = require("../models/Audio");
var VideoMusic_1 = require("../models/VideoMusic");
var logger_1 = require("../lib/logger");
// Get these from env variables in production
var APP_PACKAGE_NAME = process.env.APP_PACKAGE_NAME || 'com.brajcinema.tv';
var APP_SCHEME = process.env.APP_SCHEME || 'brajcinema';
var APP_STORE_ID = process.env.APP_STORE_ID || '123456789';
// Helper to increment share count dynamically
var incrementShareCount = function (contentId, contentType) { return __awaiter(void 0, void 0, void 0, function () {
    var movieUpdated, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 12, , 13]);
                if (!(contentType === 'movie')) return [3 /*break*/, 2];
                return [4 /*yield*/, Movie_1.MovieModel.findByIdAndUpdate(contentId, { $inc: { shares: 1 } })];
            case 1:
                _a.sent();
                return [2 /*return*/];
            case 2:
                if (!(contentType === 'audio')) return [3 /*break*/, 4];
                return [4 /*yield*/, Audio_1.AudioModel.findByIdAndUpdate(contentId, { $inc: { shares: 1 } })];
            case 3:
                _a.sent();
                return [2 /*return*/];
            case 4:
                if (!(contentType === 'videoMusic')) return [3 /*break*/, 6];
                return [4 /*yield*/, VideoMusic_1.VideoMusicModel.findByIdAndUpdate(contentId, { $inc: { shares: 1 } })];
            case 5:
                _a.sent();
                return [2 /*return*/];
            case 6:
                if (!(contentType === 'drama' || contentType === 'series' || contentType === 'tv-show')) return [3 /*break*/, 8];
                return [4 /*yield*/, Content_1.ContentModel.findByIdAndUpdate(contentId, { $inc: { shares: 1 } })];
            case 7:
                _a.sent();
                return [2 /*return*/];
            case 8: return [4 /*yield*/, Movie_1.MovieModel.findByIdAndUpdate(contentId, { $inc: { shares: 1 } })];
            case 9:
                movieUpdated = _a.sent();
                if (!!movieUpdated) return [3 /*break*/, 11];
                return [4 /*yield*/, Content_1.ContentModel.findByIdAndUpdate(contentId, { $inc: { shares: 1 } })];
            case 10:
                _a.sent();
                _a.label = 11;
            case 11: return [3 /*break*/, 13];
            case 12:
                err_1 = _a.sent();
                logger_1.logger.error({ err: err_1, contentId: contentId }, 'Failed to increment share count');
                return [3 /*break*/, 13];
            case 13: return [2 /*return*/];
        }
    });
}); };
var handleShareRedirect = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var contentId, query, androidIntent, iosScheme, appStoreLink, html;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                contentId = request.params.contentId;
                query = request.query;
                // Increment share count dynamically when the link is clicked/visited
                return [4 /*yield*/, incrementShareCount(contentId, query.contentType)];
            case 1:
                // Increment share count dynamically when the link is clicked/visited
                _a.sent();
                androidIntent = "intent://watch/".concat(contentId, "#Intent;scheme=").concat(APP_SCHEME, ";package=").concat(APP_PACKAGE_NAME, ";end");
                iosScheme = "".concat(APP_SCHEME, "://watch/").concat(contentId);
                appStoreLink = "https://apps.apple.com/app/id".concat(APP_STORE_ID);
                html = "\n    <!DOCTYPE html>\n    <html lang=\"en\">\n    <head>\n      <meta charset=\"UTF-8\">\n      <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n      <title>Opening Braj Cinema TV...</title>\n      <style>\n        body { background: #000; color: #fff; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }\n        .loader { border: 4px solid #333; border-top: 4px solid #ff0055; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; }\n        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }\n      </style>\n      <script>\n        document.addEventListener(\"DOMContentLoaded\", function() {\n          var userAgent = navigator.userAgent || navigator.vendor || window.opera;\n          \n          if (/android/i.test(userAgent)) {\n            // Android: Intent URI handles both opening the app and Play Store fallback automatically natively!\n            window.location.replace(\"".concat(androidIntent, "\");\n          } \n          else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {\n            // iOS: Try custom scheme, fallback to App Store after a short delay\n            window.location.replace(\"").concat(iosScheme, "\");\n            setTimeout(function() {\n              window.location.replace(\"").concat(appStoreLink, "\");\n            }, 2500);\n          } \n          else {\n            // Desktop or other: redirect to website\n            window.location.replace(\"https://aapki-website.com/watch/").concat(contentId, "\");\n          }\n        });\n      </script>\n    </head>\n    <body>\n      <div class=\"loader\"></div>\n    </body>\n    </html>\n  ");
                return [2 /*return*/, reply.type('text/html').send(html)];
        }
    });
}); };
exports.handleShareRedirect = handleShareRedirect;
var recordShare = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var contentId, body, contentType, sharesCount, movie, audio, video, content, error_1;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 10, , 11]);
                contentId = request.params.contentId;
                body = request.body || {};
                contentType = body.contentType;
                return [4 /*yield*/, incrementShareCount(contentId, contentType)];
            case 1:
                _e.sent();
                sharesCount = 0;
                if (!(contentType === 'movie')) return [3 /*break*/, 3];
                return [4 /*yield*/, Movie_1.MovieModel.findById(contentId).select('shares').lean()];
            case 2:
                movie = _e.sent();
                sharesCount = (_a = movie === null || movie === void 0 ? void 0 : movie.shares) !== null && _a !== void 0 ? _a : 0;
                return [3 /*break*/, 9];
            case 3:
                if (!(contentType === 'audio')) return [3 /*break*/, 5];
                return [4 /*yield*/, Audio_1.AudioModel.findById(contentId).select('shares').lean()];
            case 4:
                audio = _e.sent();
                sharesCount = (_b = audio === null || audio === void 0 ? void 0 : audio.shares) !== null && _b !== void 0 ? _b : 0;
                return [3 /*break*/, 9];
            case 5:
                if (!(contentType === 'videoMusic')) return [3 /*break*/, 7];
                return [4 /*yield*/, VideoMusic_1.VideoMusicModel.findById(contentId).select('shares').lean()];
            case 6:
                video = _e.sent();
                sharesCount = (_c = video === null || video === void 0 ? void 0 : video.shares) !== null && _c !== void 0 ? _c : 0;
                return [3 /*break*/, 9];
            case 7: return [4 /*yield*/, Content_1.ContentModel.findById(contentId).select('shares').lean()];
            case 8:
                content = _e.sent();
                sharesCount = (_d = content === null || content === void 0 ? void 0 : content.shares) !== null && _d !== void 0 ? _d : 0;
                _e.label = 9;
            case 9: return [2 /*return*/, reply.send({
                    success: true,
                    message: 'Share recorded successfully.',
                    data: { sharesCount: sharesCount }
                })];
            case 10:
                error_1 = _e.sent();
                logger_1.logger.error(error_1, 'Error recording share');
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Failed to record share.', error: error_1.message })];
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.recordShare = recordShare;
