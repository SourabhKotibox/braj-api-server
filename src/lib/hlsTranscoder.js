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
exports.transcodeToHls = exports.getVideoInfo = void 0;
var fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
var ffmpeg_1 = __importDefault(require("@ffmpeg-installer/ffmpeg"));
var ffprobe_1 = __importDefault(require("@ffprobe-installer/ffprobe"));
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var url_1 = require("url");
var MediaFile_1 = require("../models/MediaFile");
var logger_1 = require("./logger");
var __filename = (0, url_1.fileURLToPath)(import.meta.url);
var __dirname = path_1.default.dirname(__filename);
var UPLOADS_ROOT = path_1.default.join(__dirname, '../../uploads');
var TEMP_DIR = path_1.default.join(UPLOADS_ROOT, 'temp');
// Ensure temp directory exists
if (!fs_1.default.existsSync(TEMP_DIR)) {
    fs_1.default.mkdirSync(TEMP_DIR, { recursive: true });
}
fluent_ffmpeg_1.default.setFfmpegPath(ffmpeg_1.default.path);
fluent_ffmpeg_1.default.setFfprobePath(ffprobe_1.default.path);
// Define qualities: 144p to 4K (2160p), we'll adapt to max height of input
var QUALITY_PRESETS = [
    { quality: '144p', height: 144, bitrate: 200 },
    { quality: '240p', height: 240, bitrate: 400 },
    { quality: '360p', height: 360, bitrate: 800 },
    { quality: '480p', height: 480, bitrate: 1200 },
    { quality: '720p', height: 720, bitrate: 2500 },
    { quality: '1080p', height: 1080, bitrate: 5000 },
    { quality: '1440p', height: 1440, bitrate: 8000 },
    { quality: '2160p', height: 2160, bitrate: 16000 },
];
var getVideoInfo = function (filePath) {
    return new Promise(function (resolve, reject) {
        fluent_ffmpeg_1.default.ffprobe(filePath, function (err, metadata) {
            if (err) {
                logger_1.logger.error(err, 'Error getting video info');
                reject(err);
                return;
            }
            var stream = metadata.streams.find(function (s) { return s.codec_type === 'video'; });
            if (!stream) {
                reject(new Error('No video stream found'));
                return;
            }
            resolve({
                duration: metadata.format.duration || 0,
                width: stream.width || 0,
                height: stream.height || 0,
            });
        });
    });
};
exports.getVideoInfo = getVideoInfo;
var transcodeToHls = function (mediaFileId, inputFilePath, baseUrl) { return __awaiter(void 0, void 0, void 0, function () {
    var mediaFile, _a, duration, width, height_1, applicablePresets, hlsOutputDir, qualities, _loop_1, _i, applicablePresets_1, preset, masterPlaylistContent, _loop_2, _b, qualities_1, q, masterPlaylistPath, relativeMasterPlaylistPath, masterPlaylistUrl, error_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, MediaFile_1.MediaFileModel.findById(mediaFileId)];
            case 1:
                mediaFile = _c.sent();
                if (!mediaFile) {
                    throw new Error('Media file not found');
                }
                _c.label = 2;
            case 2:
                _c.trys.push([2, 10, , 12]);
                // Update status to processing
                mediaFile.hlsStatus = 'processing';
                return [4 /*yield*/, mediaFile.save()];
            case 3:
                _c.sent();
                return [4 /*yield*/, (0, exports.getVideoInfo)(inputFilePath)];
            case 4:
                _a = _c.sent(), duration = _a.duration, width = _a.width, height_1 = _a.height;
                mediaFile.duration = Math.round(duration);
                applicablePresets = QUALITY_PRESETS.filter(function (preset) { return preset.height <= height_1; });
                // If video is smaller than 144p, add at least 144p
                if (applicablePresets.length === 0) {
                    applicablePresets.push(QUALITY_PRESETS[0]);
                }
                hlsOutputDir = path_1.default.join(UPLOADS_ROOT, 'hls', mediaFile._id.toString());
                if (!fs_1.default.existsSync(hlsOutputDir)) {
                    fs_1.default.mkdirSync(hlsOutputDir, { recursive: true });
                }
                qualities = [];
                _loop_1 = function (preset) {
                    var outputDir, playlistPath, segmentPattern, relativePlaylistPath, qualityUrl;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                outputDir = path_1.default.join(hlsOutputDir, preset.quality);
                                if (!fs_1.default.existsSync(outputDir)) {
                                    fs_1.default.mkdirSync(outputDir, { recursive: true });
                                }
                                playlistPath = path_1.default.join(outputDir, 'index.m3u8');
                                segmentPattern = path_1.default.join(outputDir, 'segment-%03d.ts');
                                return [4 /*yield*/, new Promise(function (resolve, reject) {
                                        (0, fluent_ffmpeg_1.default)(inputFilePath)
                                            .outputOptions([
                                            '-preset', 'fast',
                                            '-g', '48',
                                            '-sc_threshold', '0',
                                            '-keyint_min', '48',
                                            '-hls_time', '4',
                                            '-hls_list_size', '0',
                                            '-hls_segment_filename', segmentPattern,
                                            '-vf',
                                            "scale=-2:".concat(preset.height),
                                            '-b:v',
                                            "".concat(preset.bitrate, "k"),
                                            '-maxrate',
                                            "".concat(preset.bitrate * 1.5, "k"),
                                            '-bufsize',
                                            "".concat(preset.bitrate * 2, "k"),
                                            '-c:a', 'aac',
                                            '-b:a', '128k',
                                            '-ac', '2',
                                        ])
                                            .output(playlistPath)
                                            .on('start', function (commandLine) {
                                            logger_1.logger.debug({ commandLine: commandLine }, "Starting HLS transcoding for ".concat(preset.quality));
                                        })
                                            .on('progress', function (progress) {
                                            logger_1.logger.debug({ percent: progress.percent, preset: preset.quality }, 'HLS transcoding progress');
                                        })
                                            .on('end', function () { return __awaiter(void 0, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                logger_1.logger.info("HLS transcoding for ".concat(preset.quality, " complete"));
                                                resolve(null);
                                                return [2 /*return*/];
                                            });
                                        }); })
                                            .on('error', function (err, stdout, stderr) {
                                            logger_1.logger.error({ err: err, stdout: stdout, stderr: stderr }, "Error transcoding to ".concat(preset.quality));
                                            reject(err);
                                        })
                                            .run();
                                    })];
                            case 1:
                                _d.sent();
                                relativePlaylistPath = "hls/".concat(mediaFile._id.toString(), "/").concat(preset.quality, "/index.m3u8");
                                qualityUrl = "".concat(baseUrl, "/uploads/").concat(relativePlaylistPath);
                                qualities.push({
                                    quality: preset.quality,
                                    url: qualityUrl,
                                    filePath: "/uploads/".concat(relativePlaylistPath),
                                    bitrate: preset.bitrate,
                                    resolution: "".concat(Math.round(width * (preset.height / height_1)), "x").concat(preset.height),
                                });
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, applicablePresets_1 = applicablePresets;
                _c.label = 5;
            case 5:
                if (!(_i < applicablePresets_1.length)) return [3 /*break*/, 8];
                preset = applicablePresets_1[_i];
                return [5 /*yield**/, _loop_1(preset)];
            case 6:
                _c.sent();
                _c.label = 7;
            case 7:
                _i++;
                return [3 /*break*/, 5];
            case 8:
                masterPlaylistContent = '#EXTM3U\n';
                _loop_2 = function (q) {
                    var preset = applicablePresets.find(function (p) { return p.quality === q.quality; });
                    if (preset) {
                        masterPlaylistContent += "#EXT-X-STREAM-INF:BANDWIDTH=".concat(preset.bitrate * 1000, ",RESOLUTION=").concat(q.resolution, "\n");
                        masterPlaylistContent += "".concat(q.quality, "/index.m3u8\n");
                    }
                };
                for (_b = 0, qualities_1 = qualities; _b < qualities_1.length; _b++) {
                    q = qualities_1[_b];
                    _loop_2(q);
                }
                masterPlaylistPath = path_1.default.join(hlsOutputDir, 'index.m3u8');
                fs_1.default.writeFileSync(masterPlaylistPath, masterPlaylistContent);
                relativeMasterPlaylistPath = "hls/".concat(mediaFile._id.toString(), "/index.m3u8");
                masterPlaylistUrl = "".concat(baseUrl, "/uploads/").concat(relativeMasterPlaylistPath);
                // Update media file with HLS data
                mediaFile.isHls = true;
                mediaFile.hlsMasterPlaylistUrl = masterPlaylistUrl;
                mediaFile.hlsMasterPlaylistPath = "/uploads/".concat(relativeMasterPlaylistPath);
                mediaFile.hlsQualities = qualities;
                mediaFile.hlsStatus = 'completed';
                return [4 /*yield*/, mediaFile.save()];
            case 9:
                _c.sent();
                return [3 /*break*/, 12];
            case 10:
                error_1 = _c.sent();
                logger_1.logger.error({ error: error_1 }, 'Error transcoding to HLS');
                mediaFile.hlsStatus = 'failed';
                mediaFile.hlsError = error_1 instanceof Error ? error_1.message : String(error_1);
                return [4 /*yield*/, mediaFile.save()];
            case 11:
                _c.sent();
                throw error_1;
            case 12: return [2 /*return*/];
        }
    });
}); };
exports.transcodeToHls = transcodeToHls;
exports.default = {
    getVideoInfo: exports.getVideoInfo,
    transcodeToHls: exports.transcodeToHls,
};
