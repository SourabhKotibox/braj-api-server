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
exports.normalizeAudio = normalizeAudio;
exports.analyzeAudioLoudness = analyzeAudioLoudness;
var child_process_1 = require("child_process");
var path_1 = __importDefault(require("path"));
var promises_1 = __importDefault(require("fs/promises"));
var fs_1 = require("fs");
var promises_2 = require("stream/promises");
var https_1 = __importDefault(require("https"));
var http_1 = __importDefault(require("http"));
var logger_1 = require("./logger");
var UPLOADS_DIR = path_1.default.join(process.cwd(), '..', 'uploads');
var NORMALIZED_DIR = path_1.default.join(UPLOADS_DIR, 'normalized');
function ensureDir(dir) {
    return __awaiter(this, void 0, void 0, function () {
        var e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, promises_1.default.mkdir(dir, { recursive: true })];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function downloadFile(url, destPath) {
    return new Promise(function (resolve, reject) {
        var protocol = url.startsWith('https') ? https_1.default : http_1.default;
        var file = (0, fs_1.createWriteStream)(destPath);
        protocol.get(url, function (response) {
            if (response.statusCode === 301 || response.statusCode === 302) {
                var redirectUrl = response.headers.location;
                if (redirectUrl) {
                    downloadFile(redirectUrl, destPath).then(resolve).catch(reject);
                    return;
                }
            }
            if (response.statusCode !== 200) {
                reject(new Error("Download failed with status ".concat(response.statusCode)));
                return;
            }
            (0, promises_2.pipeline)(response, file).then(resolve).catch(reject);
        }).on('error', reject);
    });
}
function runFfmpeg(args) {
    return new Promise(function (resolve, reject) {
        var ffmpeg = (0, child_process_1.spawn)('ffmpeg', args);
        var stdout = '';
        var stderr = '';
        ffmpeg.stdout.on('data', function (data) {
            stdout += data.toString();
        });
        ffmpeg.stderr.on('data', function (data) {
            stderr += data.toString();
        });
        ffmpeg.on('close', function (code) {
            if (code === 0) {
                resolve({ stdout: stdout, stderr: stderr });
            }
            else {
                reject(new Error("FFmpeg exited with code ".concat(code, ": ").concat(stderr)));
            }
        });
        ffmpeg.on('error', reject);
    });
}
function parseLoudnessInfo(stderr) {
    var match = stderr.match(/\[Parsed_loudnorm_0 @ [^\]]+\]\s*(\{[^}]+\})/);
    if (!match)
        return null;
    try {
        return JSON.parse(match[1]);
    }
    catch (_a) {
        return null;
    }
}
function normalizeAudio(inputUrl_1) {
    return __awaiter(this, arguments, void 0, function (inputUrl, options) {
        var _a, targetLoudness, _b, truePeak, _c, loudnessRange, tempId, inputPath, outputPath, localPath, analyzeArgs, analyzeStderr, loudnessInfo, normalizeArgs, fileName, finalPath, error_1, _d, _e;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _a = options.targetLoudness, targetLoudness = _a === void 0 ? -14 : _a, _b = options.truePeak, truePeak = _b === void 0 ? -1 : _b, _c = options.loudnessRange, loudnessRange = _c === void 0 ? 11 : _c;
                    return [4 /*yield*/, ensureDir(NORMALIZED_DIR)];
                case 1:
                    _f.sent();
                    tempId = "temp_".concat(Date.now(), "_").concat(Math.random().toString(36).slice(2, 8));
                    inputPath = path_1.default.join(NORMALIZED_DIR, "".concat(tempId, "_input.mp3"));
                    outputPath = path_1.default.join(NORMALIZED_DIR, "".concat(tempId, "_normalized.mp3"));
                    _f.label = 2;
                case 2:
                    _f.trys.push([2, 10, 11, 18]);
                    if (!inputUrl.startsWith('http')) return [3 /*break*/, 4];
                    logger_1.logger.info({ url: inputUrl }, 'Downloading audio for normalization');
                    return [4 /*yield*/, downloadFile(inputUrl, inputPath)];
                case 3:
                    _f.sent();
                    return [3 /*break*/, 6];
                case 4:
                    localPath = path_1.default.join(UPLOADS_DIR, inputUrl.replace(/^\/?uploads\//, ''));
                    return [4 /*yield*/, promises_1.default.copyFile(localPath, inputPath)];
                case 5:
                    _f.sent();
                    _f.label = 6;
                case 6:
                    // First pass: Analyze loudness
                    logger_1.logger.info('Analyzing audio loudness (first pass)');
                    analyzeArgs = [
                        '-i', inputPath,
                        '-af',
                        "loudnorm=I=".concat(targetLoudness, ":TP=").concat(truePeak, ":LRA=").concat(loudnessRange, ":print_format=json"),
                        '-f', 'null',
                        '-'
                    ];
                    return [4 /*yield*/, runFfmpeg(analyzeArgs)];
                case 7:
                    analyzeStderr = (_f.sent()).stderr;
                    loudnessInfo = parseLoudnessInfo(analyzeStderr);
                    if (!loudnessInfo) {
                        throw new Error('Failed to analyze audio loudness');
                    }
                    logger_1.logger.info({ loudnessInfo: loudnessInfo }, 'Loudness analysis complete');
                    // Second pass: Apply normalization with measured values
                    logger_1.logger.info('Applying normalization (second pass)');
                    normalizeArgs = [
                        '-i', inputPath,
                        '-af',
                        "loudnorm=I=".concat(targetLoudness, ":TP=").concat(truePeak, ":LRA=").concat(loudnessRange, ":measured_I=").concat(loudnessInfo.inputI, ":measured_TP=").concat(loudnessInfo.inputTp, ":measured_LRA=").concat(loudnessInfo.inputLRA, ":measured_thresh=").concat(loudnessInfo.inputThresh, ":offset=").concat(loudnessInfo.targetOffset, ":linear=true:print_format=json"),
                        '-ar', '44100', // Standard sample rate
                        '-b:a', '320k', // High quality output
                        '-y', // Overwrite output
                        outputPath
                    ];
                    return [4 /*yield*/, runFfmpeg(normalizeArgs)];
                case 8:
                    _f.sent();
                    fileName = "normalized_".concat(Date.now(), "_").concat(Math.random().toString(36).slice(2, 8), ".mp3");
                    finalPath = path_1.default.join(NORMALIZED_DIR, fileName);
                    return [4 /*yield*/, promises_1.default.rename(outputPath, finalPath)];
                case 9:
                    _f.sent();
                    return [2 /*return*/, {
                            success: true,
                            outputPath: path_1.default.join('normalized', fileName),
                            outputUrl: "/uploads/normalized/".concat(fileName),
                            loudnessInfo: loudnessInfo,
                        }];
                case 10:
                    error_1 = _f.sent();
                    logger_1.logger.error({ error: error_1.message, inputUrl: inputUrl }, 'Audio normalization failed');
                    return [2 /*return*/, {
                            success: false,
                            error: error_1.message,
                        }];
                case 11:
                    _f.trys.push([11, 13, , 14]);
                    return [4 /*yield*/, promises_1.default.unlink(inputPath)];
                case 12:
                    _f.sent();
                    return [3 /*break*/, 14];
                case 13:
                    _d = _f.sent();
                    return [3 /*break*/, 14];
                case 14:
                    _f.trys.push([14, 16, , 17]);
                    return [4 /*yield*/, promises_1.default.unlink(outputPath)];
                case 15:
                    _f.sent();
                    return [3 /*break*/, 17];
                case 16:
                    _e = _f.sent();
                    return [3 /*break*/, 17];
                case 17: return [7 /*endfinally*/];
                case 18: return [2 /*return*/];
            }
        });
    });
}
function analyzeAudioLoudness(inputUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var tempId, inputPath, localPath, analyzeArgs, stderr, error_2, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, ensureDir(NORMALIZED_DIR)];
                case 1:
                    _b.sent();
                    tempId = "analyze_".concat(Date.now(), "_").concat(Math.random().toString(36).slice(2, 8));
                    inputPath = path_1.default.join(NORMALIZED_DIR, "".concat(tempId, "_input.mp3"));
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 8, 9, 13]);
                    if (!inputUrl.startsWith('http')) return [3 /*break*/, 4];
                    return [4 /*yield*/, downloadFile(inputUrl, inputPath)];
                case 3:
                    _b.sent();
                    return [3 /*break*/, 6];
                case 4:
                    localPath = path_1.default.join(UPLOADS_DIR, inputUrl.replace(/^\/?uploads\//, ''));
                    return [4 /*yield*/, promises_1.default.copyFile(localPath, inputPath)];
                case 5:
                    _b.sent();
                    _b.label = 6;
                case 6:
                    analyzeArgs = [
                        '-i', inputPath,
                        '-af', 'loudnorm=I=-14:TP=-1:LRA=11:print_format=json',
                        '-f', 'null',
                        '-'
                    ];
                    return [4 /*yield*/, runFfmpeg(analyzeArgs)];
                case 7:
                    stderr = (_b.sent()).stderr;
                    return [2 /*return*/, parseLoudnessInfo(stderr)];
                case 8:
                    error_2 = _b.sent();
                    logger_1.logger.error({ error: error_2.message }, 'Audio analysis failed');
                    return [2 /*return*/, null];
                case 9:
                    _b.trys.push([9, 11, , 12]);
                    return [4 /*yield*/, promises_1.default.unlink(inputPath)];
                case 10:
                    _b.sent();
                    return [3 /*break*/, 12];
                case 11:
                    _a = _b.sent();
                    return [3 /*break*/, 12];
                case 12: return [7 /*endfinally*/];
                case 13: return [2 /*return*/];
            }
        });
    });
}
