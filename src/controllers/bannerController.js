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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEpisodeLock = exports.bulkDeleteBanners = exports.deleteBanner = exports.updateBanner = exports.getBannerById = exports.getBannerShow = exports.appendBannerShowVideo = exports.createBannerShow = exports.createBannerFromContent = exports.listBanners = void 0;
var child_process_1 = require("child_process");
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var url_1 = require("url");
var Banner_1 = require("../models/Banner");
var Content_1 = require("../models/Content");
var Episode_1 = require("../models/Episode");
var Movie_1 = require("../models/Movie");
var Audio_1 = require("../models/Audio");
var VideoMusic_1 = require("../models/VideoMusic");
var uploadHandler_1 = __importDefault(require("../lib/uploadHandler"));
var videoProcessor_1 = require("../services/videoProcessor");
var __filename = (0, url_1.fileURLToPath)(import.meta.url);
var __dirname = path_1.default.dirname(__filename);
var uploadsRoot = path_1.default.join(__dirname, '../../uploads');
var parseList = function (value) {
    if (Array.isArray(value))
        return value.map(String).filter(Boolean);
    if (typeof value !== 'string')
        return [];
    return value
        .split(',')
        .map(function (item) { return item.trim(); })
        .filter(Boolean);
};
var parseBool = function (value, fallback) {
    if (fallback === void 0) { fallback = false; }
    if (value === undefined || value === null || value === '')
        return fallback;
    return value === true || value === 'true' || value === '1' || value === 'yes';
};
var parseDate = function (value) {
    if (!value)
        return undefined;
    var parsed = new Date(String(value));
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};
var parsePositiveNumber = function (value, fallback) {
    var parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 0)
        return fallback;
    return parsed;
};
var parsePlatforms = function (value) {
    var allowed = new Set(['web', 'mobile', 'tv']);
    return parseList(value).filter(function (platform) { return allowed.has(platform); });
};
var ensureDir = function (dir) {
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
};
var ensureDefaultBannerImage = function () {
    var folder = path_1.default.join(uploadsRoot, 'banners');
    var fileName = 'default-video-banner.svg';
    var filePath = path_1.default.join(folder, fileName);
    ensureDir(folder);
    if (!fs_1.default.existsSync(filePath)) {
        fs_1.default.writeFileSync(filePath, "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1280\" height=\"720\" viewBox=\"0 0 1280 720\">\n  <rect width=\"1280\" height=\"720\" fill=\"#0b1217\"/>\n  <rect x=\"64\" y=\"64\" width=\"1152\" height=\"592\" rx=\"28\" fill=\"#141d23\" stroke=\"#2a343c\" stroke-width=\"4\"/>\n  <circle cx=\"640\" cy=\"360\" r=\"92\" fill=\"#e50914\"/>\n  <path d=\"M615 312v96l84-48z\" fill=\"#fff\"/>\n  <text x=\"640\" y=\"515\" text-anchor=\"middle\" fill=\"#d7dde2\" font-family=\"Arial, sans-serif\" font-size=\"42\" font-weight=\"700\">Video Upload</text>\n</svg>");
    }
    return "/uploads/banners/".concat(fileName);
};
var toLocalUploadPath = function (fileUrl) {
    if (!fileUrl.startsWith('/uploads/'))
        return undefined;
    return path_1.default.join(__dirname, '../..', fileUrl);
};
var runCommand = function (command, args) {
    return new Promise(function (resolve, reject) {
        var child = (0, child_process_1.spawn)(command, args);
        var stdout = '';
        var stderr = '';
        child.stdout.on('data', function (chunk) {
            stdout += chunk.toString();
        });
        child.stderr.on('data', function (chunk) {
            stderr += chunk.toString();
        });
        child.on('error', reject);
        child.on('close', function (code) {
            if (code === 0) {
                resolve(stdout.trim());
            }
            else {
                reject(new Error(stderr.trim() || "".concat(command, " exited with code ").concat(code)));
            }
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
                        '-v',
                        'error',
                        '-show_entries',
                        'format=duration',
                        '-of',
                        'default=noprint_wrappers=1:nokey=1',
                        filePath,
                    ])];
            case 1:
                output = _a.sent();
                duration = Number(output);
                return [2 /*return*/, Number.isFinite(duration) && duration > 0 ? duration : undefined];
            case 2:
                error_1 = _a.sent();
                console.warn('ffprobe unavailable or failed:', error_1);
                return [2 /*return*/, undefined];
            case 3: return [2 /*return*/];
        }
    });
}); };
var mapContent = function (content, episodeCount, forceType) {
    if (episodeCount === void 0) { episodeCount = 0; }
    var resolvedType = forceType || content.contentType;
    if (!resolvedType) {
        if (content.type === 'movie') {
            resolvedType = 'movie';
        }
        else if (content.type === 'series') {
            resolvedType = 'series';
        }
        else {
            resolvedType = 'drama';
        }
    }
    return {
        id: content._id.toString(),
        title: content.title,
        subtitle: content.shortDescription,
        description: content.description,
        thumbnail: content.thumbnail,
        bannerImage: content.bannerImage,
        genres: content.genres,
        languages: content.languages,
        views: content.views,
        likes: content.likes,
        shares: content.shares,
        episodeCount: episodeCount,
        status: content.status,
        createdAt: content.createdAt,
        updatedAt: content.updatedAt,
        contentType: resolvedType,
        hlsUrl: content.hlsUrl,
        videoUrl: content.videoUrl,
    };
};
var mapEpisode = function (episode) { return ({
    id: episode._id.toString(),
    contentId: episode.contentId.toString(),
    episode: episode.episode,
    season: episode.season,
    title: episode.title,
    thumbnail: episode.thumbnail,
    hlsUrl: episode.hlsUrl,
    sourceVideoUrl: episode.sourceVideoUrl,
    sourceStartSeconds: episode.sourceStartSeconds,
    sourceEndSeconds: episode.sourceEndSeconds,
    duration: episode.duration,
    views: episode.views,
    isFree: episode.isFree,
    isLocked: episode.isLocked,
    processingStatus: episode.processingStatus,
    processingError: episode.processingError,
}); };
var populateBannersContent = function (banners) { return __awaiter(void 0, void 0, void 0, function () {
    var contentIds, _a, movies, contents, audios, videoMusics, contentMap, _i, movies_1, movie, _b, contents_1, content, _c, audios_1, audio, _d, videoMusics_1, videoMusic, _e, banners_1, banner, content;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                contentIds = banners.map(function (b) { return b.contentId; }).filter(Boolean);
                if (contentIds.length === 0)
                    return [2 /*return*/, banners];
                return [4 /*yield*/, Promise.all([
                        Movie_1.MovieModel.find({ _id: { $in: contentIds } }).lean(),
                        Content_1.ContentModel.find({ _id: { $in: contentIds } }).lean(),
                        Audio_1.AudioModel.find({ _id: { $in: contentIds } }).lean(),
                        VideoMusic_1.VideoMusicModel.find({ _id: { $in: contentIds } }).lean(),
                    ])];
            case 1:
                _a = _f.sent(), movies = _a[0], contents = _a[1], audios = _a[2], videoMusics = _a[3];
                contentMap = new Map();
                for (_i = 0, movies_1 = movies; _i < movies_1.length; _i++) {
                    movie = movies_1[_i];
                    contentMap.set(movie._id.toString(), __assign(__assign({}, movie), { contentType: 'movie', contentModel: 'Movie' }));
                }
                for (_b = 0, contents_1 = contents; _b < contents_1.length; _b++) {
                    content = contents_1[_b];
                    contentMap.set(content._id.toString(), __assign(__assign({}, content), { contentType: content.contentType || 'series', contentModel: 'Content' }));
                }
                for (_c = 0, audios_1 = audios; _c < audios_1.length; _c++) {
                    audio = audios_1[_c];
                    contentMap.set(audio._id.toString(), __assign(__assign({}, audio), { contentType: 'audio', contentModel: 'Audio' }));
                }
                for (_d = 0, videoMusics_1 = videoMusics; _d < videoMusics_1.length; _d++) {
                    videoMusic = videoMusics_1[_d];
                    contentMap.set(videoMusic._id.toString(), __assign(__assign({}, videoMusic), { contentType: 'video-music', contentModel: 'VideoMusic' }));
                }
                // Assign populated content back to banner
                for (_e = 0, banners_1 = banners; _e < banners_1.length; _e++) {
                    banner = banners_1[_e];
                    if (banner.contentId) {
                        content = contentMap.get(banner.contentId.toString());
                        banner.contentId = content || null;
                        banner.contentModel = (content === null || content === void 0 ? void 0 : content.contentModel) || banner.contentModel;
                    }
                }
                return [2 /*return*/, banners];
        }
    });
}); };
var resequenceBanners = function (movedBannerId, targetPosition) { return __awaiter(void 0, void 0, void 0, function () {
    var banners, currentPos, _i, banners_2, banner, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                return [4 /*yield*/, Banner_1.BannerModel.find().sort({ position: 1, updatedAt: -1 })];
            case 1:
                banners = _a.sent();
                currentPos = 1;
                _i = 0, banners_2 = banners;
                _a.label = 2;
            case 2:
                if (!(_i < banners_2.length)) return [3 /*break*/, 6];
                banner = banners_2[_i];
                if (movedBannerId && banner._id.toString() === movedBannerId) {
                    return [3 /*break*/, 5];
                }
                if (targetPosition !== undefined && currentPos === targetPosition) {
                    currentPos++;
                }
                if (!(banner.position !== currentPos)) return [3 /*break*/, 4];
                banner.position = currentPos;
                return [4 /*yield*/, Banner_1.BannerModel.updateOne({ _id: banner._id }, { $set: { position: currentPos } })];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                currentPos++;
                _a.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 2];
            case 6: return [3 /*break*/, 8];
            case 7:
                error_2 = _a.sent();
                console.error('Error resequencing banners:', error_2);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
var mapBanner = function (banner, episodeCount) {
    if (episodeCount === void 0) { episodeCount = 0; }
    var content = banner.contentId;
    var thumbnail = (content === null || content === void 0 ? void 0 : content.thumbnail) || banner.imageUrl;
    return {
        id: banner._id.toString(),
        title: banner.title,
        subtitle: banner.subtitle,
        description: banner.description,
        thumbnail: thumbnail,
        imageUrl: thumbnail,
        ctaText: banner.ctaText,
        ctaLink: banner.ctaLink,
        position: banner.position,
        isActive: banner.isActive,
        type: banner.type,
        targetPlatforms: banner.targetPlatforms || [],
        startDate: banner.startDate,
        endDate: banner.endDate,
        content: content ? mapContent(content, episodeCount) : undefined,
    };
};
var createEpisodeSlices = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var probedDurationSeconds, totalDurationSeconds, sliceSeconds, existingCount, episodeCount, episodes, index, episodeNumber, start, end, isFree, createdEpisodes;
    var contentId = _b.contentId, sourceVideoUrl = _b.sourceVideoUrl, sourceVideoPath = _b.sourceVideoPath, reelDurationMinutes = _b.reelDurationMinutes, totalDurationMinutes = _b.totalDurationMinutes, freeEpisodeCount = _b.freeEpisodeCount, lockEpisodes = _b.lockEpisodes, thumbnail = _b.thumbnail, title = _b.title;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, getVideoDurationSeconds(sourceVideoPath)];
            case 1:
                probedDurationSeconds = _c.sent();
                totalDurationSeconds = totalDurationMinutes
                    ? Math.round(totalDurationMinutes * 60)
                    : probedDurationSeconds;
                if (!totalDurationSeconds) {
                    throw new Error('Video duration is required when ffprobe cannot read the uploaded file. Send totalDurationMinutes.');
                }
                sliceSeconds = Math.round(reelDurationMinutes * 60);
                return [4 /*yield*/, Episode_1.EpisodeModel.countDocuments({ contentId: contentId })];
            case 2:
                existingCount = _c.sent();
                episodeCount = Math.ceil(totalDurationSeconds / sliceSeconds);
                episodes = [];
                for (index = 0; index < episodeCount; index += 1) {
                    episodeNumber = existingCount + index + 1;
                    start = index * sliceSeconds;
                    end = Math.min(start + sliceSeconds, totalDurationSeconds);
                    isFree = !lockEpisodes || episodeNumber <= freeEpisodeCount;
                    episodes.push({
                        contentId: contentId,
                        season: 1,
                        episode: episodeNumber,
                        title: "".concat(title, " - Episode ").concat(episodeNumber),
                        thumbnail: thumbnail,
                        sourceVideoUrl: sourceVideoUrl,
                        sourceStartSeconds: start,
                        sourceEndSeconds: end,
                        duration: end - start,
                        hlsUrl: '',
                        isFree: isFree,
                        isLocked: !isFree,
                        processingStatus: 'queued',
                    });
                }
                return [4 /*yield*/, Episode_1.EpisodeModel.insertMany(episodes)];
            case 3:
                createdEpisodes = _c.sent();
                (0, videoProcessor_1.processEpisodesInBackground)(createdEpisodes.map(function (episode) { return episode._id; }), sourceVideoUrl);
                return [2 /*return*/, createdEpisodes];
        }
    });
}); };
var readBannerMultipart = function (request) { return __awaiter(void 0, void 0, void 0, function () {
    var data, _a, _b, _c, part, uploadedFile, uploadedFile, uploadedFile, e_1_1;
    var _d, e_1, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                data = {};
                _g.label = 1;
            case 1:
                _g.trys.push([1, 12, 13, 18]);
                _a = true, _b = __asyncValues(request.parts());
                _g.label = 2;
            case 2: return [4 /*yield*/, _b.next()];
            case 3:
                if (!(_c = _g.sent(), _d = _c.done, !_d)) return [3 /*break*/, 11];
                _f = _c.value;
                _a = false;
                part = _f;
                if (!(part.type === 'field')) return [3 /*break*/, 4];
                if (part.fieldname === 'title')
                    data.title = part.value;
                if (part.fieldname === 'subtitle')
                    data.subtitle = part.value;
                if (part.fieldname === 'description')
                    data.description = part.value;
                if (part.fieldname === 'genres')
                    data.genres = parseList(part.value);
                if (part.fieldname === 'languages')
                    data.languages = parseList(part.value);
                if (part.fieldname === 'reelDurationMinutes')
                    data.reelDurationMinutes = parsePositiveNumber(part.value);
                if (part.fieldname === 'totalDurationMinutes')
                    data.totalDurationMinutes = parsePositiveNumber(part.value);
                if (part.fieldname === 'freeEpisodeCount')
                    data.freeEpisodeCount = Number(part.value);
                if (part.fieldname === 'lockEpisodes')
                    data.lockEpisodes = parseBool(part.value, true);
                if (part.fieldname === 'position')
                    data.position = Number(part.value);
                if (part.fieldname === 'isActive')
                    data.isActive = parseBool(part.value, true);
                if (part.fieldname === 'ctaText')
                    data.ctaText = part.value;
                if (part.fieldname === 'ctaLink')
                    data.ctaLink = part.value;
                if (part.fieldname === 'targetPlatforms')
                    data.targetPlatforms = parsePlatforms(part.value);
                if (part.fieldname === 'startDate')
                    data.startDate = parseDate(part.value);
                if (part.fieldname === 'endDate')
                    data.endDate = parseDate(part.value);
                if (part.fieldname === 'thumbnail')
                    data.thumbnail = part.value;
                if (part.fieldname === 'bannerImage')
                    data.thumbnail = part.value;
                if (part.fieldname === 'videoUrl')
                    data.videoUrl = part.value;
                return [3 /*break*/, 10];
            case 4:
                if (!(part.type === 'file')) return [3 /*break*/, 10];
                if (!(part.fieldname === 'thumbnailFile')) return [3 /*break*/, 6];
                return [4 /*yield*/, uploadHandler_1.default.saveFileFromPart(part, request, 'BANNER')];
            case 5:
                uploadedFile = _g.sent();
                data.thumbnail = uploadedFile.url;
                data.thumbnailFilePath = uploadedFile.filePath;
                _g.label = 6;
            case 6:
                if (!(part.fieldname === 'bannerFile')) return [3 /*break*/, 8];
                return [4 /*yield*/, uploadHandler_1.default.saveFileFromPart(part, request, 'BANNER')];
            case 7:
                uploadedFile = _g.sent();
                data.thumbnail = uploadedFile.url;
                data.thumbnailFilePath = uploadedFile.filePath;
                _g.label = 8;
            case 8:
                if (!(part.fieldname === 'videoFile')) return [3 /*break*/, 10];
                return [4 /*yield*/, uploadHandler_1.default.saveFileFromPart(part, request, 'VIDEO')];
            case 9:
                uploadedFile = _g.sent();
                data.videoUrl = uploadedFile.url;
                data.videoFilePath = uploadedFile.filePath;
                _g.label = 10;
            case 10:
                _a = true;
                return [3 /*break*/, 2];
            case 11: return [3 /*break*/, 18];
            case 12:
                e_1_1 = _g.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 18];
            case 13:
                _g.trys.push([13, , 16, 17]);
                if (!(!_a && !_d && (_e = _b.return))) return [3 /*break*/, 15];
                return [4 /*yield*/, _e.call(_b)];
            case 14:
                _g.sent();
                _g.label = 15;
            case 15: return [3 /*break*/, 17];
            case 16:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 17: return [7 /*endfinally*/];
            case 18: return [2 /*return*/, data];
        }
    });
}); };
var listBanners = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var query, page, limit, now, isAdminView, filter, _a, bannersRaw, total, banners, contentIds, counts, countMap_1, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                return [4 /*yield*/, resequenceBanners()];
            case 1:
                _b.sent();
                query = request.query;
                page = Math.max(1, Number(query.page || 1));
                limit = Math.min(100, Math.max(1, Number(query.limit || 20)));
                now = new Date();
                isAdminView = parseBool(query.admin, false);
                filter = isAdminView
                    ? {}
                    : {
                        isActive: true,
                        $and: [
                            { $or: [{ startDate: { $exists: false } }, { startDate: { $lte: now } }] },
                            { $or: [{ endDate: { $exists: false } }, { endDate: { $gte: now } }] },
                        ],
                    };
                if (query.platform) {
                    filter.targetPlatforms = query.platform;
                }
                return [4 /*yield*/, Promise.all([
                        Banner_1.BannerModel.find(filter)
                            .sort({ position: 1, createdAt: -1 })
                            .skip((page - 1) * limit)
                            .limit(limit)
                            .lean(),
                        Banner_1.BannerModel.countDocuments(filter),
                    ])];
            case 2:
                _a = _b.sent(), bannersRaw = _a[0], total = _a[1];
                return [4 /*yield*/, populateBannersContent(bannersRaw)];
            case 3:
                banners = _b.sent();
                contentIds = banners.map(function (banner) { var _a; return (_a = banner.contentId) === null || _a === void 0 ? void 0 : _a._id; }).filter(Boolean);
                return [4 /*yield*/, Episode_1.EpisodeModel.aggregate([
                        { $match: { contentId: { $in: contentIds } } },
                        { $group: { _id: '$contentId', count: { $sum: 1 } } },
                    ])];
            case 4:
                counts = _b.sent();
                countMap_1 = new Map(counts.map(function (item) { return [item._id.toString(), item.count]; }));
                return [2 /*return*/, {
                        success: true,
                        data: banners.map(function (banner) { return mapBanner(banner, banner.contentId ? countMap_1.get(banner.contentId._id.toString()) || 0 : 0); }),
                        pagination: {
                            page: page,
                            limit: limit,
                            total: total,
                            pages: Math.ceil(total / limit),
                        },
                    }];
            case 5:
                error_3 = _b.sent();
                console.error('Error listing banners:', error_3);
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error', error: error_3.message })];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.listBanners = listBanners;
var createBannerFromContent = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var body, source, contentType, contentModel, existing, thumbnail, title, banner, error_4;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 12, , 13]);
                body = request.body;
                if (!body.contentId || !body.contentSource) {
                    return [2 /*return*/, reply.status(400).send({ success: false, message: 'contentId and contentSource are required' })];
                }
                source = null;
                contentType = 'both';
                contentModel = 'Content';
                if (!(body.contentSource === 'movie')) return [3 /*break*/, 2];
                return [4 /*yield*/, Movie_1.MovieModel.findById(body.contentId).lean()];
            case 1:
                source = _b.sent();
                contentType = 'movie';
                contentModel = 'Movie';
                return [3 /*break*/, 8];
            case 2:
                if (!(body.contentSource === 'audio')) return [3 /*break*/, 4];
                return [4 /*yield*/, Audio_1.AudioModel.findById(body.contentId).lean()];
            case 3:
                source = _b.sent();
                contentType = 'audio';
                contentModel = 'Audio';
                return [3 /*break*/, 8];
            case 4:
                if (!(body.contentSource === 'video-music')) return [3 /*break*/, 6];
                return [4 /*yield*/, VideoMusic_1.VideoMusicModel.findById(body.contentId).lean()];
            case 5:
                source = _b.sent();
                contentType = 'video-music';
                contentModel = 'VideoMusic';
                return [3 /*break*/, 8];
            case 6: return [4 /*yield*/, Content_1.ContentModel.findById(body.contentId).lean()];
            case 7:
                source = _b.sent();
                contentType = (source === null || source === void 0 ? void 0 : source.contentType) || 'series';
                contentModel = 'Content';
                _b.label = 8;
            case 8:
                if (!source) {
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'Source content not found' })];
                }
                return [4 /*yield*/, Banner_1.BannerModel.findOne({ contentId: body.contentId })];
            case 9:
                existing = _b.sent();
                if (existing) {
                    return [2 /*return*/, reply.status(409).send({
                            success: false,
                            message: 'A banner for this content already exists. Please edit the existing banner instead.',
                        })];
                }
                thumbnail = source.thumbnail || source.bannerImage || source.coverImage || source.imageUrl || ensureDefaultBannerImage();
                title = body.title || source.title;
                return [4 /*yield*/, Banner_1.BannerModel.create({
                        title: title,
                        subtitle: body.subtitle || source.shortDescription || source.artist || '',
                        description: body.description || source.description || '',
                        imageUrl: thumbnail,
                        ctaText: body.ctaText || (body.contentSource === 'audio' ? 'Listen Now' : body.contentSource === 'video-music' ? 'Watch Now' : 'Watch Now'),
                        ctaLink: body.ctaLink || '',
                        contentId: body.contentId,
                        contentModel: contentModel,
                        type: 'hero',
                        contentType: contentType,
                        position: Number.isFinite(body.position) ? body.position : 0,
                        isActive: (_a = body.isActive) !== null && _a !== void 0 ? _a : true,
                        targetPlatforms: ['web', 'mobile'],
                        targetPages: body.targetPages || (body.contentSource === 'audio' ? ['music'] : body.contentSource === 'video-music' ? ['videos'] : ['home']),
                    })];
            case 10:
                banner = _b.sent();
                return [4 /*yield*/, resequenceBanners(banner._id.toString(), banner.position)];
            case 11:
                _b.sent();
                return [2 /*return*/, reply.status(201).send({
                        success: true,
                        data: {
                            id: banner._id,
                            title: banner.title,
                            subtitle: banner.subtitle,
                            description: banner.description,
                            imageUrl: banner.imageUrl,
                            position: banner.position,
                            isActive: banner.isActive,
                            contentId: banner.contentId,
                            contentType: banner.contentType,
                            contentModel: banner.contentModel,
                        },
                        message: 'Banner created successfully from existing content.',
                    })];
            case 12:
                error_4 = _b.sent();
                console.error('Error creating banner from content:', error_4);
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error', error: error_4.message })];
            case 13: return [2 /*return*/];
        }
    });
}); };
exports.createBannerFromContent = createBannerFromContent;
var createBannerShow = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var data, reelDurationMinutes, thumbnail, sourceVideoPath, content, banner, episodes, error_5;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 6, , 7]);
                return [4 /*yield*/, readBannerMultipart(request)];
            case 1:
                data = _d.sent();
                reelDurationMinutes = data.reelDurationMinutes || 3;
                if (!data.title || !data.videoUrl) {
                    return [2 /*return*/, reply.status(400).send({
                            success: false,
                            message: 'title and videoFile/videoUrl are required',
                        })];
                }
                thumbnail = data.thumbnail || ensureDefaultBannerImage();
                sourceVideoPath = toLocalUploadPath(data.videoUrl);
                if (!sourceVideoPath || !fs_1.default.existsSync(sourceVideoPath)) {
                    return [2 /*return*/, reply.status(400).send({
                            success: false,
                            message: 'Episode splitting requires a locally uploaded videoFile.',
                        })];
                }
                return [4 /*yield*/, Content_1.ContentModel.create({
                        title: data.title,
                        type: 'series',
                        description: data.description,
                        shortDescription: data.subtitle,
                        thumbnail: thumbnail,
                        bannerImage: thumbnail,
                        genres: data.genres || [],
                        languages: data.languages && data.languages.length ? data.languages : ['English'],
                        status: 'processing',
                        featured: true,
                        isNewContent: true,
                        planRequired: 'free',
                        seasons: 1,
                    })];
            case 2:
                content = _d.sent();
                return [4 /*yield*/, Banner_1.BannerModel.create({
                        title: data.title,
                        subtitle: data.subtitle,
                        description: data.description,
                        imageUrl: thumbnail,
                        ctaText: data.ctaText || 'Watch Now',
                        ctaLink: data.ctaLink,
                        contentId: content._id,
                        type: 'hero',
                        position: Number.isFinite(data.position) ? data.position : 0,
                        isActive: (_a = data.isActive) !== null && _a !== void 0 ? _a : true,
                        targetPlatforms: ((_b = data.targetPlatforms) === null || _b === void 0 ? void 0 : _b.length) ? data.targetPlatforms : ['web', 'mobile'],
                        startDate: data.startDate,
                        endDate: data.endDate,
                    })];
            case 3:
                banner = _d.sent();
                return [4 /*yield*/, resequenceBanners(banner._id.toString(), banner.position)];
            case 4:
                _d.sent();
                return [4 /*yield*/, createEpisodeSlices({
                        contentId: content._id,
                        sourceVideoUrl: data.videoUrl,
                        sourceVideoPath: sourceVideoPath,
                        reelDurationMinutes: reelDurationMinutes,
                        totalDurationMinutes: data.totalDurationMinutes,
                        freeEpisodeCount: Number.isFinite(data.freeEpisodeCount) ? data.freeEpisodeCount : 1,
                        lockEpisodes: (_c = data.lockEpisodes) !== null && _c !== void 0 ? _c : true,
                        thumbnail: thumbnail,
                        title: data.title,
                    })];
            case 5:
                episodes = _d.sent();
                return [2 /*return*/, reply.status(201).send({
                        success: true,
                        data: {
                            banner: {
                                id: banner._id.toString(),
                                title: banner.title,
                                thumbnail: banner.imageUrl,
                            },
                            content: mapContent(content.toObject(), episodes.length),
                            episodes: episodes.map(mapEpisode),
                        },
                        message: 'Banner show created. HLS generation has started in the background.',
                    })];
            case 6:
                error_5 = _d.sent();
                console.error('Error creating banner show:', error_5);
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error', error: error_5.message })];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.createBannerShow = createBannerShow;
var appendBannerShowVideo = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var contentId, content, data, reelDurationMinutes, sourceVideoPath, episodes, error_6;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                contentId = request.params.contentId;
                return [4 /*yield*/, Content_1.ContentModel.findById(contentId)];
            case 1:
                content = _b.sent();
                if (!content) {
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'Content not found' })];
                }
                return [4 /*yield*/, readBannerMultipart(request)];
            case 2:
                data = _b.sent();
                reelDurationMinutes = data.reelDurationMinutes || 3;
                if (!data.videoUrl) {
                    return [2 /*return*/, reply.status(400).send({ success: false, message: 'videoFile is required' })];
                }
                sourceVideoPath = toLocalUploadPath(data.videoUrl);
                if (!sourceVideoPath || !fs_1.default.existsSync(sourceVideoPath)) {
                    return [2 /*return*/, reply.status(400).send({
                            success: false,
                            message: 'Episode splitting requires a locally uploaded videoFile.',
                        })];
                }
                return [4 /*yield*/, createEpisodeSlices({
                        contentId: content._id,
                        sourceVideoUrl: data.videoUrl,
                        sourceVideoPath: sourceVideoPath,
                        reelDurationMinutes: reelDurationMinutes,
                        totalDurationMinutes: data.totalDurationMinutes,
                        freeEpisodeCount: Number.isFinite(data.freeEpisodeCount) ? data.freeEpisodeCount : 1,
                        lockEpisodes: (_a = data.lockEpisodes) !== null && _a !== void 0 ? _a : true,
                        thumbnail: data.thumbnail || content.thumbnail,
                        title: content.title,
                    })];
            case 3:
                episodes = _b.sent();
                return [2 /*return*/, reply.status(201).send({
                        success: true,
                        data: {
                            contentId: content._id.toString(),
                            addedEpisodes: episodes.length,
                            episodes: episodes.map(mapEpisode),
                        },
                        message: 'New episodes added. HLS generation has started in the background.',
                    })];
            case 4:
                error_6 = _b.sent();
                console.error('Error appending banner show video:', error_6);
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error', error: error_6.message })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.appendBannerShowVideo = appendBannerShowVideo;
var getBannerShow = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var contentId, query, page, limit, content, isMovie, episodes, total_1, _a, epList, epCount, error_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                contentId = request.params.contentId;
                query = request.query;
                page = Math.max(1, Number(query.page || 1));
                limit = Math.min(100, Math.max(1, Number(query.limit || 25)));
                return [4 /*yield*/, Content_1.ContentModel.findById(contentId).lean()];
            case 1:
                content = _b.sent();
                isMovie = false;
                if (!!content) return [3 /*break*/, 3];
                return [4 /*yield*/, Movie_1.MovieModel.findById(contentId).lean()];
            case 2:
                content = _b.sent();
                if (!content) {
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'Content not found' })];
                }
                isMovie = true;
                _b.label = 3;
            case 3:
                episodes = [];
                total_1 = 0;
                if (!!isMovie) return [3 /*break*/, 5];
                return [4 /*yield*/, Promise.all([
                        Episode_1.EpisodeModel.find({ contentId: contentId })
                            .sort({ episode: 1 })
                            .skip((page - 1) * limit)
                            .limit(limit)
                            .lean(),
                        Episode_1.EpisodeModel.countDocuments({ contentId: contentId }),
                    ])];
            case 4:
                _a = _b.sent(), epList = _a[0], epCount = _a[1];
                episodes = epList;
                total_1 = epCount;
                _b.label = 5;
            case 5: return [2 /*return*/, {
                    success: true,
                    data: {
                        content: mapContent(content, total_1, isMovie ? 'movie' : undefined),
                        episodeRanges: isMovie ? [] : Array.from({ length: Math.ceil(total_1 / 25) }, function (_, index) { return ({
                            label: "".concat(index * 25 + 1, "-").concat(Math.min((index + 1) * 25, total_1)),
                            start: index * 25 + 1,
                            end: Math.min((index + 1) * 25, total_1),
                        }); }),
                        episodes: episodes.map(mapEpisode),
                    },
                    pagination: {
                        page: page,
                        limit: limit,
                        total: total_1,
                        pages: isMovie ? 1 : Math.ceil(total_1 / limit),
                    },
                }];
            case 6:
                error_7 = _b.sent();
                console.error('Error getting banner show:', error_7);
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error', error: error_7.message })];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.getBannerShow = getBannerShow;
var getBannerById = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var bannerId, bannerRaw, populated, banner, episodeCount, _a, error_8;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                bannerId = request.params.bannerId;
                return [4 /*yield*/, Banner_1.BannerModel.findById(bannerId).lean()];
            case 1:
                bannerRaw = _b.sent();
                if (!bannerRaw) {
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'Banner not found' })];
                }
                return [4 /*yield*/, populateBannersContent([bannerRaw])];
            case 2:
                populated = _b.sent();
                banner = populated[0];
                if (!banner.contentId) return [3 /*break*/, 4];
                return [4 /*yield*/, Episode_1.EpisodeModel.countDocuments({ contentId: banner.contentId._id })];
            case 3:
                _a = _b.sent();
                return [3 /*break*/, 5];
            case 4:
                _a = 0;
                _b.label = 5;
            case 5:
                episodeCount = _a;
                return [2 /*return*/, {
                        success: true,
                        data: mapBanner(banner, episodeCount),
                    }];
            case 6:
                error_8 = _b.sent();
                console.error('Error getting banner:', error_8);
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error', error: error_8.message })];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.getBannerById = getBannerById;
var updateBanner = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var bannerId, existingBanner, existingContent, _a, _b, data, updateData, updatedBannerDoc, contentUpdate, isMovie, bannerRaw, populated, banner, episodeCount, _c, error_9;
    var _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 26, , 27]);
                bannerId = request.params.bannerId;
                return [4 /*yield*/, Banner_1.BannerModel.findById(bannerId)];
            case 1:
                existingBanner = _f.sent();
                if (!existingBanner) {
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'Banner not found' })];
                }
                if (!existingBanner.contentId) return [3 /*break*/, 5];
                return [4 /*yield*/, Content_1.ContentModel.findById(existingBanner.contentId).lean()];
            case 2:
                _b = (_f.sent());
                if (_b) return [3 /*break*/, 4];
                return [4 /*yield*/, Movie_1.MovieModel.findById(existingBanner.contentId).lean()];
            case 3:
                _b = (_f.sent());
                _f.label = 4;
            case 4:
                _a = (_b);
                return [3 /*break*/, 6];
            case 5:
                _a = null;
                _f.label = 6;
            case 6:
                existingContent = _a;
                return [4 /*yield*/, readBannerMultipart(request)];
            case 7:
                data = _f.sent();
                updateData = {};
                if (data.title !== undefined)
                    updateData.title = data.title;
                if (data.subtitle !== undefined)
                    updateData.subtitle = data.subtitle;
                if (data.description !== undefined)
                    updateData.description = data.description;
                if (data.position !== undefined && Number.isFinite(data.position))
                    updateData.position = data.position;
                if (data.isActive !== undefined)
                    updateData.isActive = data.isActive;
                if (data.ctaText !== undefined)
                    updateData.ctaText = data.ctaText;
                if (data.ctaLink !== undefined)
                    updateData.ctaLink = data.ctaLink;
                if (data.thumbnail !== undefined)
                    updateData.imageUrl = data.thumbnail;
                if ((_d = data.targetPlatforms) === null || _d === void 0 ? void 0 : _d.length)
                    updateData.targetPlatforms = data.targetPlatforms;
                if (data.startDate !== undefined)
                    updateData.startDate = data.startDate;
                if (data.endDate !== undefined)
                    updateData.endDate = data.endDate;
                return [4 /*yield*/, Banner_1.BannerModel.findByIdAndUpdate(bannerId, { $set: updateData }, { returnDocument: 'after' })];
            case 8:
                updatedBannerDoc = _f.sent();
                if (!updatedBannerDoc) {
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'Banner not found' })];
                }
                return [4 /*yield*/, resequenceBanners(updatedBannerDoc._id.toString(), updatedBannerDoc.position)];
            case 9:
                _f.sent();
                if (!existingBanner.contentId) return [3 /*break*/, 16];
                contentUpdate = {};
                if (data.title !== undefined)
                    contentUpdate.title = data.title;
                if (data.subtitle !== undefined)
                    contentUpdate.shortDescription = data.subtitle;
                if (data.description !== undefined)
                    contentUpdate.description = data.description;
                if (data.thumbnail !== undefined) {
                    contentUpdate.thumbnail = data.thumbnail;
                    contentUpdate.bannerImage = data.thumbnail;
                }
                if (data.genres !== undefined)
                    contentUpdate.genres = data.genres;
                if ((_e = data.languages) === null || _e === void 0 ? void 0 : _e.length)
                    contentUpdate.languages = data.languages;
                if (!(Object.keys(contentUpdate).length > 0)) return [3 /*break*/, 14];
                return [4 /*yield*/, Movie_1.MovieModel.exists({ _id: existingBanner.contentId })];
            case 10:
                isMovie = _f.sent();
                if (!isMovie) return [3 /*break*/, 12];
                return [4 /*yield*/, Movie_1.MovieModel.findByIdAndUpdate(existingBanner.contentId, { $set: contentUpdate })];
            case 11:
                _f.sent();
                return [3 /*break*/, 14];
            case 12: return [4 /*yield*/, Content_1.ContentModel.findByIdAndUpdate(existingBanner.contentId, { $set: contentUpdate })];
            case 13:
                _f.sent();
                _f.label = 14;
            case 14:
                if (!(data.thumbnail !== undefined)) return [3 /*break*/, 16];
                return [4 /*yield*/, Episode_1.EpisodeModel.updateMany({ contentId: existingBanner.contentId }, { $set: { thumbnail: data.thumbnail } })];
            case 15:
                _f.sent();
                _f.label = 16;
            case 16:
                if (!(data.thumbnail && existingBanner.imageUrl !== data.thumbnail)) return [3 /*break*/, 18];
                return [4 /*yield*/, uploadHandler_1.default.deleteUploadedFile(existingBanner.imageUrl)];
            case 17:
                _f.sent();
                _f.label = 18;
            case 18:
                if (!(data.thumbnail && (existingContent === null || existingContent === void 0 ? void 0 : existingContent.thumbnail) && existingContent.thumbnail !== data.thumbnail)) return [3 /*break*/, 20];
                return [4 /*yield*/, uploadHandler_1.default.deleteUploadedFile(existingContent.thumbnail)];
            case 19:
                _f.sent();
                _f.label = 20;
            case 20: return [4 /*yield*/, Banner_1.BannerModel.findById(bannerId).lean()];
            case 21:
                bannerRaw = _f.sent();
                if (!bannerRaw) {
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'Banner not found' })];
                }
                return [4 /*yield*/, populateBannersContent([bannerRaw])];
            case 22:
                populated = _f.sent();
                banner = populated[0];
                if (!banner.contentId) return [3 /*break*/, 24];
                return [4 /*yield*/, Episode_1.EpisodeModel.countDocuments({ contentId: banner.contentId._id })];
            case 23:
                _c = _f.sent();
                return [3 /*break*/, 25];
            case 24:
                _c = 0;
                _f.label = 25;
            case 25:
                episodeCount = _c;
                return [2 /*return*/, {
                        success: true,
                        data: mapBanner(banner, episodeCount),
                        message: 'Banner updated successfully',
                    }];
            case 26:
                error_9 = _f.sent();
                console.error('Error updating banner:', error_9);
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error', error: error_9.message })];
            case 27: return [2 /*return*/];
        }
    });
}); };
exports.updateBanner = updateBanner;
var deleteBanner = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var bannerId, banner, filesToDelete, _a, content, episodes, _i, episodes_1, episode, hlsFolder, _b, _c, filePath, error_10;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 10, , 11]);
                bannerId = request.params.bannerId;
                return [4 /*yield*/, Banner_1.BannerModel.findByIdAndDelete(bannerId).lean()];
            case 1:
                banner = _d.sent();
                if (!banner) {
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'Banner not found' })];
                }
                filesToDelete = new Set();
                if (banner.imageUrl)
                    filesToDelete.add(banner.imageUrl);
                if (!banner.contentId) return [3 /*break*/, 4];
                return [4 /*yield*/, Promise.all([
                        Content_1.ContentModel.findByIdAndDelete(banner.contentId).lean(),
                        Episode_1.EpisodeModel.find({ contentId: banner.contentId }).lean(),
                    ])];
            case 2:
                _a = _d.sent(), content = _a[0], episodes = _a[1];
                if (content === null || content === void 0 ? void 0 : content.thumbnail)
                    filesToDelete.add(content.thumbnail);
                if (content === null || content === void 0 ? void 0 : content.bannerImage)
                    filesToDelete.add(content.bannerImage);
                for (_i = 0, episodes_1 = episodes; _i < episodes_1.length; _i++) {
                    episode = episodes_1[_i];
                    if (episode.sourceVideoUrl)
                        filesToDelete.add(episode.sourceVideoUrl);
                }
                return [4 /*yield*/, Episode_1.EpisodeModel.deleteMany({ contentId: banner.contentId })];
            case 3:
                _d.sent();
                hlsFolder = path_1.default.join(uploadsRoot, 'hls', banner.contentId.toString());
                if (fs_1.default.existsSync(hlsFolder)) {
                    fs_1.default.rmSync(hlsFolder, { recursive: true, force: true });
                }
                _d.label = 4;
            case 4:
                _b = 0, _c = Array.from(filesToDelete);
                _d.label = 5;
            case 5:
                if (!(_b < _c.length)) return [3 /*break*/, 8];
                filePath = _c[_b];
                return [4 /*yield*/, uploadHandler_1.default.deleteUploadedFile(filePath)];
            case 6:
                _d.sent();
                _d.label = 7;
            case 7:
                _b++;
                return [3 /*break*/, 5];
            case 8: return [4 /*yield*/, resequenceBanners()];
            case 9:
                _d.sent();
                return [2 /*return*/, {
                        success: true,
                        message: 'Banner deleted successfully',
                    }];
            case 10:
                error_10 = _d.sent();
                console.error('Error deleting banner:', error_10);
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error', error: error_10.message })];
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.deleteBanner = deleteBanner;
var bulkDeleteBanners = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var ids, banners, _i, banners_3, banner, filesToDelete, _a, content, episodes, _b, episodes_2, episode, hlsFolder, _c, _d, filePath, result, error_11;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 13, , 14]);
                ids = request.body.ids;
                if (!Array.isArray(ids) || ids.length === 0) {
                    return [2 /*return*/, reply.status(400).send({ success: false, message: 'Invalid or empty ids array' })];
                }
                return [4 /*yield*/, Banner_1.BannerModel.find({ _id: { $in: ids } }).lean()];
            case 1:
                banners = _e.sent();
                _i = 0, banners_3 = banners;
                _e.label = 2;
            case 2:
                if (!(_i < banners_3.length)) return [3 /*break*/, 10];
                banner = banners_3[_i];
                filesToDelete = new Set();
                if (banner.imageUrl)
                    filesToDelete.add(banner.imageUrl);
                if (!banner.contentId) return [3 /*break*/, 5];
                return [4 /*yield*/, Promise.all([
                        Content_1.ContentModel.findByIdAndDelete(banner.contentId).lean(),
                        Episode_1.EpisodeModel.find({ contentId: banner.contentId }).lean(),
                    ])];
            case 3:
                _a = _e.sent(), content = _a[0], episodes = _a[1];
                if (content === null || content === void 0 ? void 0 : content.thumbnail)
                    filesToDelete.add(content.thumbnail);
                if (content === null || content === void 0 ? void 0 : content.bannerImage)
                    filesToDelete.add(content.bannerImage);
                for (_b = 0, episodes_2 = episodes; _b < episodes_2.length; _b++) {
                    episode = episodes_2[_b];
                    if (episode.sourceVideoUrl)
                        filesToDelete.add(episode.sourceVideoUrl);
                }
                return [4 /*yield*/, Episode_1.EpisodeModel.deleteMany({ contentId: banner.contentId })];
            case 4:
                _e.sent();
                hlsFolder = path_1.default.join(uploadsRoot, 'hls', banner.contentId.toString());
                if (fs_1.default.existsSync(hlsFolder)) {
                    fs_1.default.rmSync(hlsFolder, { recursive: true, force: true });
                }
                _e.label = 5;
            case 5:
                _c = 0, _d = Array.from(filesToDelete);
                _e.label = 6;
            case 6:
                if (!(_c < _d.length)) return [3 /*break*/, 9];
                filePath = _d[_c];
                return [4 /*yield*/, uploadHandler_1.default.deleteUploadedFile(filePath)];
            case 7:
                _e.sent();
                _e.label = 8;
            case 8:
                _c++;
                return [3 /*break*/, 6];
            case 9:
                _i++;
                return [3 /*break*/, 2];
            case 10: return [4 /*yield*/, Banner_1.BannerModel.deleteMany({ _id: { $in: ids } })];
            case 11:
                result = _e.sent();
                return [4 /*yield*/, resequenceBanners()];
            case 12:
                _e.sent();
                return [2 /*return*/, reply.send({
                        success: true,
                        message: "".concat(result.deletedCount, " banner(s) deleted successfully"),
                        deletedCount: result.deletedCount,
                    })];
            case 13:
                error_11 = _e.sent();
                console.error('Error bulk deleting banners:', error_11);
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error', error: error_11.message })];
            case 14: return [2 /*return*/];
        }
    });
}); };
exports.bulkDeleteBanners = bulkDeleteBanners;
var updateEpisodeLock = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var episodeId, body, isLocked, episode, error_12;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                episodeId = request.params.episodeId;
                body = request.body;
                isLocked = (_a = body.isLocked) !== null && _a !== void 0 ? _a : !body.isFree;
                return [4 /*yield*/, Episode_1.EpisodeModel.findByIdAndUpdate(episodeId, { isLocked: isLocked, isFree: !isLocked }, { returnDocument: 'after' }).lean()];
            case 1:
                episode = _b.sent();
                if (!episode) {
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'Episode not found' })];
                }
                return [2 /*return*/, { success: true, data: mapEpisode(episode) }];
            case 2:
                error_12 = _b.sent();
                console.error('Error updating episode lock:', error_12);
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error', error: error_12.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateEpisodeLock = updateEpisodeLock;
