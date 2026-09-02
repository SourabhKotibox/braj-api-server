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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoDetectAndSyncQualities = exports.processEpisodesInBackground = exports.processEpisodeHls = exports.processMovieInBackground = exports.processMovieHls = exports.transcodeHlsMultiResolution = exports.toLocalUploadPath = exports.HLS_QUALITY_LADDER = void 0;
var child_process_1 = require("child_process");
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var Movie_1 = require("../models/Movie");
var Episode_1 = require("../models/Episode");
var Content_1 = require("../models/Content");
var logger_1 = require("../lib/logger");
// ─────────────────────────────────────────────────────────────────────────────
// All 7 quality renditions with Netflix-grade bitrate settings
// ─────────────────────────────────────────────────────────────────────────────
exports.HLS_QUALITY_LADDER = [
    { name: '144p', width: 256, height: 144, bitrate: '100k', maxrate: '110k', bufsize: '150k', audioBitrate: '48k' },
    { name: '240p', width: 426, height: 240, bitrate: '400k', maxrate: '428k', bufsize: '600k', audioBitrate: '64k' },
    { name: '360p', width: 640, height: 360, bitrate: '800k', maxrate: '856k', bufsize: '1200k', audioBitrate: '96k' },
    { name: '480p', width: 854, height: 480, bitrate: '1400k', maxrate: '1498k', bufsize: '2100k', audioBitrate: '128k' },
    { name: '720p', width: 1280, height: 720, bitrate: '2800k', maxrate: '2996k', bufsize: '4200k', audioBitrate: '128k' },
    { name: '1080p', width: 1920, height: 1080, bitrate: '5000k', maxrate: '5350k', bufsize: '7500k', audioBitrate: '192k' },
    { name: '1440p', width: 2560, height: 1440, bitrate: '8000k', maxrate: '8560k', bufsize: '12000k', audioBitrate: '192k' },
    { name: '2160p', width: 3840, height: 2160, bitrate: '16000k', maxrate: '17120k', bufsize: '24000k', audioBitrate: '192k' },
];
// Bandwidth values for master.m3u8 BANDWIDTH attribute (bits/s)
var BANDWIDTH_MAP = {
    '144p': 100000,
    '240p': 400000,
    '360p': 800000,
    '480p': 1400000,
    '720p': 2800000,
    '1080p': 5000000,
    '1440p': 8000000,
    '2160p': 16000000,
};
var RESOLUTION_MAP = {
    '144p': '256x144',
    '240p': '426x240',
    '360p': '640x360',
    '480p': '854x480',
    '720p': '1280x720',
    '1080p': '1920x1080',
    '1440p': '2560x1440',
    '2160p': '3840x2160',
};
// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
var runCommand = function (command, args) {
    return new Promise(function (resolve, reject) {
        var child = (0, child_process_1.spawn)(command, args);
        var stdout = '';
        var stderr = '';
        child.stdout.on('data', function (chunk) { stdout += chunk.toString(); });
        child.stderr.on('data', function (chunk) { stderr += chunk.toString(); });
        child.on('error', reject);
        child.on('close', function (code) {
            if (code === 0)
                resolve(stdout.trim());
            else
                reject(new Error(stderr.trim() || "".concat(command, " exited with code ").concat(code)));
        });
    });
};
var getVideoDurationSeconds = function (filePath) { return __awaiter(void 0, void 0, void 0, function () {
    var output, duration, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, runCommand('ffprobe', [
                        '-v', 'error',
                        '-show_entries', 'format=duration',
                        '-of', 'default=noprint_wrappers=1:nokey=1',
                        filePath,
                    ])];
            case 1:
                output = _a.sent();
                duration = Number(output);
                return [2 /*return*/, Number.isFinite(duration) && duration > 0 ? duration : undefined];
            case 2:
                error_1 = _a.sent();
                logger_1.logger.warn({ error: error_1, filePath: filePath }, 'ffprobe duration probe failed');
                return [2 /*return*/, undefined];
            case 3: return [2 /*return*/];
        }
    });
}); };
var ensureDir = function (dir) {
    if (!fs_1.default.existsSync(dir))
        fs_1.default.mkdirSync(dir, { recursive: true });
};
var toLocalUploadPath = function (urlPath) {
    if (!urlPath)
        return null;
    var uploadsRoot = path_1.default.join(process.cwd(), 'uploads');
    var relPath = urlPath;
    if (relPath.startsWith('/uploads/'))
        relPath = relPath.replace('/uploads/', '');
    else if (relPath.startsWith('uploads/'))
        relPath = relPath.replace('uploads/', '');
    else if (relPath.startsWith('/media/'))
        relPath = relPath.replace('/', '');
    return path_1.default.join(uploadsRoot, relPath);
};
exports.toLocalUploadPath = toLocalUploadPath;
var getFolderSize = function (folderPath) {
    try {
        if (!fs_1.default.existsSync(folderPath))
            return 0;
        var walk_1 = function (dir) {
            var size = 0;
            for (var _i = 0, _a = fs_1.default.readdirSync(dir, { withFileTypes: true }); _i < _a.length; _i++) {
                var f = _a[_i];
                var fp = path_1.default.join(dir, f.name);
                size += f.isDirectory() ? walk_1(fp) : fs_1.default.statSync(fp).size;
            }
            return size;
        };
        return walk_1(folderPath);
    }
    catch (_a) {
        return 0;
    }
};
/**
 * Probe source video resolution using ffprobe.
 * Returns { width, height } or null on failure.
 */
var probeResolution = function (inputPath) { return __awaiter(void 0, void 0, void 0, function () {
    var output, parts, w, h, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, runCommand('ffprobe', [
                        '-v', 'error',
                        '-select_streams', 'v:0',
                        '-show_entries', 'stream=width,height',
                        '-of', 'csv=p=0',
                        inputPath,
                    ])];
            case 1:
                output = _a.sent();
                parts = output.trim().split(',');
                if (parts.length >= 2) {
                    w = parseInt(parts[0], 10);
                    h = parseInt(parts[1], 10);
                    if (!isNaN(w) && !isNaN(h))
                        return [2 /*return*/, { width: w, height: h }];
                }
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                logger_1.logger.warn({ err: err_1 }, 'ffprobe resolution detection failed — will use all qualities');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/, null];
        }
    });
}); };
/**
 * Filter quality ladder to only include renditions whose height
 * does not exceed the source video's height.
 */
var filterQualitiesByResolution = function (sourceHeight, ladder) { return ladder.filter(function (q) { return q.height <= sourceHeight; }); };
// ─────────────────────────────────────────────────────────────────────────────
// Core HLS Transcoder — Single-pass multi-variant FFmpeg
// ─────────────────────────────────────────────────────────────────────────────
var transcodeHlsMultiResolution = function (options) { return __awaiter(void 0, void 0, void 0, function () {
    var id, type, sourceVideoUrl, startSeconds, duration, episodeNumber, contentIdForEpisode, sourceVideoPath, ffmpegInput, uploadsRoot, hlsFolder, localUrlBase, sourceRes, sourceHeight, qualities, args, n, splitOutputs, scaleFilters, filterComplexString, streamMap, err_2, masterLines, _i, qualities_1, q, bandwidth, resolution, processedQualities;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                id = options.id, type = options.type, sourceVideoUrl = options.sourceVideoUrl, startSeconds = options.startSeconds, duration = options.duration, episodeNumber = options.episodeNumber, contentIdForEpisode = options.contentIdForEpisode;
                sourceVideoPath = (0, exports.toLocalUploadPath)(sourceVideoUrl);
                if (!sourceVideoPath || !fs_1.default.existsSync(sourceVideoPath)) {
                    throw new Error("Source video not found: ".concat(sourceVideoPath));
                }
                ffmpegInput = sourceVideoPath;
                uploadsRoot = path_1.default.join(process.cwd(), 'uploads');
                hlsFolder = '';
                localUrlBase = '';
                if (type === 'movie') {
                    hlsFolder = path_1.default.join(uploadsRoot, 'hls', 'movies', id);
                    localUrlBase = "/uploads/hls/movies/".concat(id);
                }
                else {
                    hlsFolder = path_1.default.join(uploadsRoot, 'hls', contentIdForEpisode, "episode-".concat(episodeNumber));
                    localUrlBase = "/uploads/hls/".concat(contentIdForEpisode, "/episode-").concat(episodeNumber);
                }
                // Clear any existing HLS files to prevent mixing old and new uploads
                if (fs_1.default.existsSync(hlsFolder)) {
                    try {
                        fs_1.default.rmSync(hlsFolder, { recursive: true, force: true });
                    }
                    catch (rmErr) {
                        logger_1.logger.warn({ rmErr: rmErr, hlsFolder: hlsFolder }, 'Failed to clear existing HLS folder');
                    }
                }
                ensureDir(hlsFolder);
                return [4 /*yield*/, probeResolution(ffmpegInput)];
            case 1:
                sourceRes = _b.sent();
                sourceHeight = (_a = sourceRes === null || sourceRes === void 0 ? void 0 : sourceRes.height) !== null && _a !== void 0 ? _a : 2160;
                qualities = filterQualitiesByResolution(sourceHeight, exports.HLS_QUALITY_LADDER);
                logger_1.logger.info({ id: id, type: type, sourceHeight: sourceHeight, qualityCount: qualities.length }, 'Starting HLS transcoding');
                args = ['-y'];
                // Input seek (must come before -i for fast seek)
                if (startSeconds !== undefined && startSeconds > 0) {
                    args.push('-ss', String(startSeconds));
                }
                args.push('-i', ffmpegInput);
                if (duration !== undefined && duration > 0) {
                    args.push('-t', String(duration));
                }
                n = qualities.length;
                splitOutputs = qualities.map(function (_, i) { return "[temp".concat(i, "]"); }).join('');
                scaleFilters = qualities.map(function (q, i) { return "[temp".concat(i, "]scale=").concat(q.width, ":").concat(q.height, "[v").concat(i, "]"); }).join(';');
                filterComplexString = "[0:v]split=".concat(n).concat(splitOutputs, ";").concat(scaleFilters);
                args.push('-filter_complex', filterComplexString);
                // Map each video stream, then audio
                qualities.forEach(function (q, i) {
                    args.push("-map", "[v".concat(i, "]"), "-c:v:".concat(i), 'libx264', "-b:v:".concat(i), q.bitrate, "-maxrate:v:".concat(i), q.maxrate, "-bufsize:v:".concat(i), q.bufsize, "-preset:v:".concat(i), 'veryfast', "-profile:v:".concat(i), 'main', "-map", '0:a:0', "-c:a:".concat(i), 'aac', "-b:a:".concat(i), q.audioBitrate, "-ar:a:".concat(i), '48000');
                });
                streamMap = qualities.map(function (_, i) { return "v:".concat(i, ",a:").concat(i, ",name:").concat(qualities[i].name); }).join(' ');
                args.push('-var_stream_map', streamMap, '-master_pl_name', 'master.m3u8', '-f', 'hls', '-hls_time', '6', '-hls_playlist_type', 'vod', '-hls_flags', 'independent_segments', '-hls_segment_filename', path_1.default.join(hlsFolder, '%v/segment_%03d.ts'), path_1.default.join(hlsFolder, '%v/playlist.m3u8'));
                _b.label = 2;
            case 2:
                _b.trys.push([2, 4, , 5]);
                return [4 /*yield*/, runCommand('ffmpeg', args)];
            case 3:
                _b.sent();
                return [3 /*break*/, 5];
            case 4:
                err_2 = _b.sent();
                logger_1.logger.error({ err: err_2, id: id, type: type }, 'FFmpeg single-pass failed — falling back to sequential');
                // Fallback: process each quality sequentially (avoids OOM on low-RAM EC2)
                return [2 /*return*/, transcodeHlsSequential({ id: id, type: type, sourceVideoUrl: sourceVideoUrl, startSeconds: startSeconds, duration: duration, episodeNumber: episodeNumber, contentIdForEpisode: contentIdForEpisode, qualities: qualities, hlsFolder: hlsFolder, s3Prefix: s3Prefix, localUrlBase: localUrlBase, ffmpegInput: ffmpegInput })];
            case 5:
                masterLines = ['#EXTM3U', '#EXT-X-VERSION:3'];
                for (_i = 0, qualities_1 = qualities; _i < qualities_1.length; _i++) {
                    q = qualities_1[_i];
                    bandwidth = BANDWIDTH_MAP[q.name];
                    resolution = RESOLUTION_MAP[q.name];
                    masterLines.push("#EXT-X-STREAM-INF:BANDWIDTH=".concat(bandwidth, ",RESOLUTION=").concat(resolution, ",NAME=\"").concat(q.name, "\""), "".concat(q.name, "/playlist.m3u8"));
                }
                fs_1.default.writeFileSync(path_1.default.join(hlsFolder, 'master.m3u8'), masterLines.join('\n'), 'utf-8');
                return [4 /*yield*/, finalizeHlsOutput({
                        qualities: qualities,
                        hlsFolder: hlsFolder,
                        localUrlBase: localUrlBase,
                    })];
            case 6:
                processedQualities = _b.sent();
                return [2 /*return*/, {
                        hlsUrl: processedQualities.masterUrl,
                        videoQualities: processedQualities.renditions,
                    }];
        }
    });
}); };
exports.transcodeHlsMultiResolution = transcodeHlsMultiResolution;
// ─────────────────────────────────────────────────────────────────────────────
// Sequential fallback (one quality at a time — safer on low-RAM servers)
// ─────────────────────────────────────────────────────────────────────────────
var transcodeHlsSequential = function (opts) { return __awaiter(void 0, void 0, void 0, function () {
    var startSeconds, duration, qualities, hlsFolder, s3Prefix, localUrlBase, ffmpegInput, _i, qualities_2, q, qFolder, args, masterLines, _a, qualities_3, q, bandwidth, resolution, s3Active, out;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                startSeconds = opts.startSeconds, duration = opts.duration, qualities = opts.qualities, hlsFolder = opts.hlsFolder, s3Prefix = opts.s3Prefix, localUrlBase = opts.localUrlBase, ffmpegInput = opts.ffmpegInput;
                _i = 0, qualities_2 = qualities;
                _b.label = 1;
            case 1:
                if (!(_i < qualities_2.length)) return [3 /*break*/, 4];
                q = qualities_2[_i];
                qFolder = path_1.default.join(hlsFolder, q.name);
                ensureDir(qFolder);
                args = ['-y'];
                if (startSeconds !== undefined && startSeconds > 0)
                    args.push('-ss', String(startSeconds));
                args.push('-i', ffmpegInput);
                if (duration !== undefined && duration > 0)
                    args.push('-t', String(duration));
                args.push('-vf', "scale=".concat(q.width, ":").concat(q.height), '-c:v', 'libx264', '-b:v', q.bitrate, '-maxrate', q.maxrate, '-bufsize', q.bufsize, '-profile:v', 'main', '-preset', 'veryfast', '-c:a', 'aac', '-b:a', q.audioBitrate, '-ar', '48000', '-f', 'hls', '-hls_time', '6', '-hls_playlist_type', 'vod', '-hls_segment_filename', path_1.default.join(qFolder, 'segment_%03d.ts'), path_1.default.join(qFolder, 'playlist.m3u8'));
                return [4 /*yield*/, runCommand('ffmpeg', args)];
            case 2:
                _b.sent();
                logger_1.logger.info({ quality: q.name }, 'Sequential quality encoded');
                _b.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4:
                masterLines = ['#EXTM3U', '#EXT-X-VERSION:3'];
                for (_a = 0, qualities_3 = qualities; _a < qualities_3.length; _a++) {
                    q = qualities_3[_a];
                    bandwidth = BANDWIDTH_MAP[q.name];
                    resolution = RESOLUTION_MAP[q.name];
                    masterLines.push("#EXT-X-STREAM-INF:BANDWIDTH=".concat(bandwidth, ",RESOLUTION=").concat(resolution, ",NAME=\"").concat(q.name, "\""), "".concat(q.name, "/playlist.m3u8"));
                }
                fs_1.default.writeFileSync(path_1.default.join(hlsFolder, 'master.m3u8'), masterLines.join('\n'), 'utf-8');
                return [4 /*yield*/, isS3Configured()];
            case 5:
                s3Active = _b.sent();
                return [4 /*yield*/, finalizeHlsOutput({ qualities: qualities, hlsFolder: hlsFolder, s3Active: s3Active, s3Prefix: s3Prefix, localUrlBase: localUrlBase })];
            case 6:
                out = _b.sent();
                return [2 /*return*/, {
                        hlsUrl: out.masterUrl,
                        videoQualities: out.renditions,
                        hlsS3Prefix: s3Active ? s3Prefix : undefined,
                    }];
        }
    });
}); };
// ─────────────────────────────────────────────────────────────────────────────
// Finalize: Upload to S3 (or keep local), return URL map
// ─────────────────────────────────────────────────────────────────────────────
var finalizeHlsOutput = function (opts) { return __awaiter(void 0, void 0, void 0, function () {
    var qualities, hlsFolder, s3Active, s3Prefix, localUrlBase, baseUrl_1, masterUrl, renditions, masterUrl, renditions;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                qualities = opts.qualities, hlsFolder = opts.hlsFolder, s3Active = opts.s3Active, s3Prefix = opts.s3Prefix, localUrlBase = opts.localUrlBase;
                if (!s3Active) return [3 /*break*/, 3];
                // Upload all .ts segments + .m3u8 playlists to S3
                logger_1.logger.info({ s3Prefix: s3Prefix }, 'Uploading HLS folder to S3…');
                return [4 /*yield*/, uploadHlsFolderToS3(hlsFolder, s3Prefix)];
            case 1:
                _a.sent();
                return [4 /*yield*/, getHlsPublicBaseUrl()];
            case 2:
                baseUrl_1 = _a.sent();
                masterUrl = "".concat(baseUrl_1, "/").concat(s3Prefix, "/master.m3u8");
                renditions = qualities.map(function (q) { return ({
                    quality: q.name,
                    url: "".concat(baseUrl_1, "/").concat(s3Prefix, "/").concat(q.name, "/playlist.m3u8"),
                    size: getFolderSize(path_1.default.join(hlsFolder, q.name)),
                }); });
                // Clean up local temp files to save disk space
                try {
                    fs_1.default.rmSync(hlsFolder, { recursive: true, force: true });
                    logger_1.logger.info({ hlsFolder: hlsFolder }, 'Cleaned up local HLS temp files after S3 upload');
                }
                catch (cleanupErr) {
                    logger_1.logger.warn({ cleanupErr: cleanupErr }, 'Failed to clean up local HLS temp folder');
                }
                return [2 /*return*/, { masterUrl: masterUrl, renditions: renditions }];
            case 3:
                masterUrl = "".concat(localUrlBase, "/master.m3u8");
                renditions = qualities.map(function (q) { return ({
                    quality: q.name,
                    url: "".concat(localUrlBase, "/").concat(q.name, "/playlist.m3u8"),
                    size: getFolderSize(path_1.default.join(hlsFolder, q.name)),
                }); });
                return [2 /*return*/, { masterUrl: masterUrl, renditions: renditions }];
        }
    });
}); };
// ─────────────────────────────────────────────────────────────────────────────
// Public processors — Movies
// ─────────────────────────────────────────────────────────────────────────────
var processMovieHls = function (movieId, sourceVideoUrl) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 6]);
                return [4 /*yield*/, Movie_1.MovieModel.findByIdAndUpdate(movieId, { processingStatus: 'processing' })];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, exports.transcodeHlsMultiResolution)({
                        id: movieId.toString(),
                        type: 'movie',
                        sourceVideoUrl: sourceVideoUrl,
                    })];
            case 2:
                result = _a.sent();
                return [4 /*yield*/, Movie_1.MovieModel.findByIdAndUpdate(movieId, {
                        hlsUrl: result.hlsUrl,
                        videoUrl: sourceVideoUrl,
                        hlsS3Prefix: result.hlsS3Prefix,
                        videoQualities: result.videoQualities,
                        status: 'published',
                        processingStatus: 'ready',
                        processingError: null,
                    })];
            case 3:
                _a.sent();
                logger_1.logger.info({ movieId: movieId, hlsUrl: result.hlsUrl }, 'Movie HLS processing complete');
                return [3 /*break*/, 6];
            case 4:
                error_2 = _a.sent();
                logger_1.logger.error({ error: error_2, movieId: movieId }, 'Error processing movie HLS');
                return [4 /*yield*/, Movie_1.MovieModel.findByIdAndUpdate(movieId, {
                        processingStatus: 'failed',
                        processingError: error_2.message,
                    })];
            case 5:
                _a.sent();
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.processMovieHls = processMovieHls;
var processMovieInBackground = function (movieId, sourceVideoUrl) {
    setImmediate(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, exports.processMovieHls)(movieId, sourceVideoUrl)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
};
exports.processMovieInBackground = processMovieInBackground;
// ─────────────────────────────────────────────────────────────────────────────
// Public processors — Episodes
// ─────────────────────────────────────────────────────────────────────────────
var processEpisodeHls = function (episodeId, sourceVideoUrl) { return __awaiter(void 0, void 0, void 0, function () {
    var episode, result, actualDuration, localHlsPath, durationSecs, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 9]);
                return [4 /*yield*/, Episode_1.EpisodeModel.findById(episodeId).lean()];
            case 1:
                episode = _a.sent();
                if (!episode)
                    return [2 /*return*/];
                return [4 /*yield*/, Episode_1.EpisodeModel.findByIdAndUpdate(episodeId, { processingStatus: 'processing' })];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, exports.transcodeHlsMultiResolution)({
                        id: episodeId.toString(),
                        type: 'episode',
                        sourceVideoUrl: sourceVideoUrl,
                        startSeconds: episode.sourceStartSeconds,
                        duration: episode.duration,
                        episodeNumber: episode.episode,
                        contentIdForEpisode: episode.contentId.toString(),
                    })];
            case 3:
                result = _a.sent();
                actualDuration = void 0;
                localHlsPath = (0, exports.toLocalUploadPath)(result.hlsUrl);
                if (!(localHlsPath && fs_1.default.existsSync(localHlsPath))) return [3 /*break*/, 5];
                return [4 /*yield*/, getVideoDurationSeconds(localHlsPath)];
            case 4:
                durationSecs = _a.sent();
                if (durationSecs && Number.isFinite(durationSecs)) {
                    actualDuration = Math.round(durationSecs);
                }
                _a.label = 5;
            case 5: return [4 /*yield*/, Episode_1.EpisodeModel.findByIdAndUpdate(episodeId, __assign({ hlsUrl: result.hlsUrl, hlsS3Prefix: result.hlsS3Prefix, videoQualities: result.videoQualities, processingStatus: 'ready', processingError: null }, (actualDuration ? { duration: actualDuration } : {})))];
            case 6:
                _a.sent();
                logger_1.logger.info({ episodeId: episodeId, hlsUrl: result.hlsUrl }, 'Episode HLS processing complete');
                return [3 /*break*/, 9];
            case 7:
                error_3 = _a.sent();
                logger_1.logger.error({ error: error_3, episodeId: episodeId }, 'Error processing episode HLS');
                return [4 /*yield*/, Episode_1.EpisodeModel.findByIdAndUpdate(episodeId, {
                        processingStatus: 'failed',
                        processingError: error_3.message,
                    })];
            case 8:
                _a.sent();
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.processEpisodeHls = processEpisodeHls;
var processEpisodesInBackground = function (episodeIds, sourceVideoUrl) {
    setImmediate(function () { return __awaiter(void 0, void 0, void 0, function () {
        var _i, episodeIds_1, episodeId, firstEpisode, unfinishedCount, failedCount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _i = 0, episodeIds_1 = episodeIds;
                    _a.label = 1;
                case 1:
                    if (!(_i < episodeIds_1.length)) return [3 /*break*/, 4];
                    episodeId = episodeIds_1[_i];
                    return [4 /*yield*/, (0, exports.processEpisodeHls)(episodeId, sourceVideoUrl)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [4 /*yield*/, Episode_1.EpisodeModel.findById(episodeIds[0]).lean()];
                case 5:
                    firstEpisode = _a.sent();
                    if (!firstEpisode)
                        return [2 /*return*/];
                    return [4 /*yield*/, Episode_1.EpisodeModel.countDocuments({
                            contentId: firstEpisode.contentId,
                            processingStatus: { $in: ['queued', 'processing'] },
                        })];
                case 6:
                    unfinishedCount = _a.sent();
                    return [4 /*yield*/, Episode_1.EpisodeModel.countDocuments({
                            contentId: firstEpisode.contentId,
                            processingStatus: 'failed',
                        })];
                case 7:
                    failedCount = _a.sent();
                    if (!(unfinishedCount === 0)) return [3 /*break*/, 9];
                    return [4 /*yield*/, Content_1.ContentModel.findByIdAndUpdate(firstEpisode.contentId, {
                            status: failedCount > 0 ? 'processing' : 'published',
                        })];
                case 8:
                    _a.sent();
                    _a.label = 9;
                case 9: return [2 /*return*/];
            }
        });
    }); });
};
exports.processEpisodesInBackground = processEpisodesInBackground;
var autoDetectAndSyncQualities = function (id, type) { return __awaiter(void 0, void 0, void 0, function () {
    var folderName, doc, _a, hlsFolder, masterPlaylistPath, validQualities, detectedQualities, dirs, _i, dirs_1, dir, qualityPlaylistPath, s3Active, uploadSucceeded, s3Prefix_1, uploadErr_1, hlsUrl, videoQualities, baseUrl_2, port, localBaseUrl_1, currentQualitiesStr, newQualitiesStr, hasDiff, updateData, updatedDoc;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                folderName = type === 'movie' ? 'movies' : 'episodes';
                if (!(type === 'movie')) return [3 /*break*/, 2];
                return [4 /*yield*/, Movie_1.MovieModel.findById(id).lean()];
            case 1:
                _a = _b.sent();
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, Episode_1.EpisodeModel.findById(id).lean()];
            case 3:
                _a = _b.sent();
                _b.label = 4;
            case 4:
                doc = _a;
                if (!doc)
                    return [2 /*return*/, null];
                hlsFolder = path_1.default.join(process.cwd(), 'uploads/hls', folderName, id.toString());
                masterPlaylistPath = path_1.default.join(hlsFolder, 'master.m3u8');
                if (!fs_1.default.existsSync(masterPlaylistPath)) return [3 /*break*/, 17];
                validQualities = ['144p', '240p', '360p', '480p', '720p', '1080p', '1440p', '2160p'];
                detectedQualities = [];
                dirs = fs_1.default.readdirSync(hlsFolder, { withFileTypes: true });
                for (_i = 0, dirs_1 = dirs; _i < dirs_1.length; _i++) {
                    dir = dirs_1[_i];
                    if (dir.isDirectory() && validQualities.includes(dir.name)) {
                        qualityPlaylistPath = path_1.default.join(hlsFolder, dir.name, 'playlist.m3u8');
                        if (fs_1.default.existsSync(qualityPlaylistPath)) {
                            detectedQualities.push(dir.name);
                        }
                    }
                }
                if (!(detectedQualities.length > 0)) return [3 /*break*/, 17];
                return [4 /*yield*/, isS3Configured()];
            case 5:
                s3Active = _b.sent();
                uploadSucceeded = false;
                s3Prefix_1 = "hls/".concat(folderName, "/").concat(id);
                if (!s3Active) return [3 /*break*/, 9];
                _b.label = 6;
            case 6:
                _b.trys.push([6, 8, , 9]);
                logger_1.logger.info({ id: id.toString(), type: type, s3Prefix: s3Prefix_1 }, 'Auto-detect: Uploading HLS folder to S3…');
                return [4 /*yield*/, uploadHlsFolderToS3(hlsFolder, s3Prefix_1)];
            case 7:
                _b.sent();
                uploadSucceeded = true;
                logger_1.logger.info({ id: id.toString(), type: type }, 'Auto-detect: S3 upload successful. Cleaning up local files.');
                try {
                    fs_1.default.rmSync(hlsFolder, { recursive: true, force: true });
                }
                catch (rmErr) {
                    logger_1.logger.warn({ rmErr: rmErr }, 'Failed to clean up local folder after sync upload');
                }
                return [3 /*break*/, 9];
            case 8:
                uploadErr_1 = _b.sent();
                logger_1.logger.error({ uploadErr: uploadErr_1, id: id.toString() }, 'Auto-detect: Failed to upload HLS to S3, falling back to local files.');
                return [3 /*break*/, 9];
            case 9:
                hlsUrl = '';
                videoQualities = [];
                if (!(s3Active && uploadSucceeded)) return [3 /*break*/, 11];
                return [4 /*yield*/, getHlsPublicBaseUrl()];
            case 10:
                baseUrl_2 = _b.sent();
                hlsUrl = "".concat(baseUrl_2, "/").concat(s3Prefix_1, "/master.m3u8");
                videoQualities = detectedQualities.map(function (q) { return ({
                    quality: q,
                    url: "".concat(baseUrl_2, "/").concat(s3Prefix_1, "/").concat(q, "/playlist.m3u8"),
                    size: 0
                }); });
                return [3 /*break*/, 12];
            case 11:
                port = process.env.PORT || '3000';
                localBaseUrl_1 = "http://localhost:".concat(port);
                hlsUrl = "".concat(localBaseUrl_1, "/uploads/hls/").concat(folderName, "/").concat(id, "/master.m3u8");
                videoQualities = detectedQualities.map(function (q) { return ({
                    quality: q,
                    url: "".concat(localBaseUrl_1, "/uploads/hls/").concat(folderName, "/").concat(id, "/").concat(q, "/playlist.m3u8"),
                    size: getFolderSize(path_1.default.join(hlsFolder, q))
                }); });
                _b.label = 12;
            case 12:
                currentQualitiesStr = JSON.stringify(doc.videoQualities || []);
                newQualitiesStr = JSON.stringify(videoQualities);
                hasDiff = currentQualitiesStr !== newQualitiesStr ||
                    doc.processingStatus !== 'ready' ||
                    doc.hlsUrl !== hlsUrl;
                if (!hasDiff) return [3 /*break*/, 17];
                logger_1.logger.info({ id: id.toString(), type: type, qualityCount: videoQualities.length }, 'Syncing auto-detected HLS qualities to MongoDB');
                updateData = {
                    hlsUrl: hlsUrl,
                    videoQualities: videoQualities,
                    processingStatus: 'ready',
                    processingError: null,
                };
                if (doc.status === 'draft' || !doc.status) {
                    updateData.status = 'published';
                }
                updatedDoc = void 0;
                if (!(type === 'movie')) return [3 /*break*/, 14];
                return [4 /*yield*/, Movie_1.MovieModel.findByIdAndUpdate(id, { $set: updateData }, { returnDocument: 'after' }).lean()];
            case 13:
                updatedDoc = _b.sent();
                return [3 /*break*/, 16];
            case 14: return [4 /*yield*/, Episode_1.EpisodeModel.findByIdAndUpdate(id, { $set: updateData }, { returnDocument: 'after' }).lean()];
            case 15:
                updatedDoc = _b.sent();
                _b.label = 16;
            case 16: return [2 /*return*/, updatedDoc];
            case 17: return [2 /*return*/, doc];
        }
    });
}); };
exports.autoDetectAndSyncQualities = autoDetectAndSyncQualities;
