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
exports.formatFileSize = exports.deleteUploadedFile = exports.saveFileFromPart = exports.validateFileType = exports.generateUniqueFileName = exports.ensureUploadDir = exports.UPLOAD_TYPES = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var crypto_1 = __importDefault(require("crypto"));
var url_1 = require("url");
var MediaFile_1 = require("../models/MediaFile");
var MediaFolder_1 = require("../models/MediaFolder");
var mongoose_1 = require("mongoose");
var hlsTranscoder_1 = require("./hlsTranscoder");
var logger_1 = require("./logger");
var __filename = (0, url_1.fileURLToPath)(import.meta.url);
var __dirname = path_1.default.dirname(__filename);
var UPLOADS_ROOT = path_1.default.join(__dirname, '../../uploads');
exports.UPLOAD_TYPES = {
    IMAGE: {
        name: 'image',
        allowedExts: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'],
        defaultDir: ''
    },
    VIDEO: {
        name: 'video',
        allowedExts: ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.flv'],
        defaultDir: 'videos'
    },
    AUDIO: {
        name: 'audio',
        allowedExts: ['.mp3', '.wav', '.ogg', '.flac', '.aac', '.m4a', '.wma'],
        defaultDir: 'audio'
    },
    VIDEO_MUSIC: {
        name: 'video-music',
        allowedExts: ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.flv'],
        defaultDir: 'video-music'
    },
    DOCUMENT: {
        name: 'document',
        allowedExts: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt'],
        defaultDir: 'documents'
    },
    CATEGORY_THUMBNAIL: {
        name: 'category-thumbnail',
        allowedExts: ['.jpg', '.jpeg', '.png', '.webp'],
        defaultDir: 'categories'
    },
    CATEGORY_BANNER: {
        name: 'category-banner',
        allowedExts: ['.jpg', '.jpeg', '.png', '.webp'],
        defaultDir: 'categories'
    },
    CATEGORY_ICON: {
        name: 'category-icon',
        allowedExts: ['.jpg', '.jpeg', '.png', '.webp', '.svg'],
        defaultDir: 'categories'
    },
    GENRE: {
        name: 'genre',
        allowedExts: ['.jpg', '.jpeg', '.png', '.webp'],
        defaultDir: 'genres'
    },
    ACTOR: {
        name: 'actor',
        allowedExts: ['.jpg', '.jpeg', '.png', '.webp'],
        defaultDir: 'actors'
    },
    DIRECTOR: {
        name: 'director',
        allowedExts: ['.jpg', '.jpeg', '.png', '.webp'],
        defaultDir: 'directors'
    },
    LANGUAGE: {
        name: 'language',
        allowedExts: ['.jpg', '.jpeg', '.png', '.webp', '.svg'],
        defaultDir: 'languages'
    },
    MEDIA_LIBRARY: {
        name: 'media-library',
        allowedExts: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.mp4', '.webm', '.mov', '.mkv', '.avi', '.flv', '.mp3', '.wav', '.ogg', '.flac', '.aac', '.m4a'],
        defaultDir: 'media'
    },
    BANNER: {
        name: 'banner',
        allowedExts: ['.jpg', '.jpeg', '.png', '.webp'],
        defaultDir: 'banners'
    },
    PROMOTION: {
        name: 'promotion',
        allowedExts: ['.jpg', '.jpeg', '.png', '.webp'],
        defaultDir: 'promotions'
    }
};
var ensureUploadDir = function (dirPath) {
    var fullPath = path_1.default.join(UPLOADS_ROOT, dirPath);
    if (!fs_1.default.existsSync(fullPath)) {
        fs_1.default.mkdirSync(fullPath, { recursive: true });
    }
    return fullPath;
};
exports.ensureUploadDir = ensureUploadDir;
var generateUniqueFileName = function (originalName) {
    var timestamp = Date.now();
    var randomString = Math.random().toString(36).substring(2, 10);
    var ext = path_1.default.extname(originalName).toLowerCase();
    var baseName = path_1.default.basename(originalName, ext)
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    return "".concat(timestamp, "-").concat(randomString).concat(baseName ? "-".concat(baseName) : '').concat(ext);
};
exports.generateUniqueFileName = generateUniqueFileName;
var validateFileType = function (fileName, uploadType) {
    var typeConfig = exports.UPLOAD_TYPES[uploadType];
    var ext = path_1.default.extname(fileName).toLowerCase();
    return typeConfig.allowedExts.includes(ext);
};
exports.validateFileType = validateFileType;
// Helper to check if a file is a video based on file extension or mimetype
var isVideoFile = function (fileName, mimeType) {
    var videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.flv', '.m4v', '.mpeg', '.mpg'];
    var ext = path_1.default.extname(fileName).toLowerCase();
    return videoExtensions.includes(ext) || mimeType.startsWith('video/');
};
var saveFileFromPart = function (part, request, uploadType, customDir, options) { return __awaiter(void 0, void 0, void 0, function () {
    var typeConfig, targetDir, resolvedFolderId, folderMatch, error_1, fileName, relativeFilePath, fullFilePath;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                typeConfig = exports.UPLOAD_TYPES[uploadType];
                targetDir = customDir || typeConfig.defaultDir;
                if (!(0, exports.validateFileType)(part.filename, uploadType)) {
                    throw new Error("Invalid file type for ".concat(typeConfig.name, ". Allowed types: ").concat(typeConfig.allowedExts.join(', ')));
                }
                resolvedFolderId = options === null || options === void 0 ? void 0 : options.folderId;
                if (!(!resolvedFolderId && typeConfig.defaultDir)) return [3 /*break*/, 4];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, MediaFolder_1.MediaFolderModel.findOne({ name: { $regex: new RegExp("^".concat(typeConfig.defaultDir, "$"), 'i') } })];
            case 2:
                folderMatch = _a.sent();
                if (folderMatch) {
                    resolvedFolderId = folderMatch._id.toString();
                }
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error('Error resolving folder ID:', error_1);
                return [3 /*break*/, 4];
            case 4:
                fileName = (0, exports.generateUniqueFileName)(part.filename);
                (0, exports.ensureUploadDir)(targetDir);
                relativeFilePath = path_1.default.join(targetDir, fileName);
                fullFilePath = path_1.default.join(UPLOADS_ROOT, relativeFilePath);
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
                        var writeStream;
                        return __generator(this, function (_a) {
                            writeStream = fs_1.default.createWriteStream(fullFilePath);
                            part.file.pipe(writeStream);
                            writeStream.on('finish', function () { return __awaiter(void 0, void 0, void 0, function () {
                                var stats, computeFileHash, contentHash, existingFile, needsUpdate, protocol, host, baseUrl, fileInfo, mediaFile_1, error_2;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            stats = fs_1.default.statSync(fullFilePath);
                                            computeFileHash = function (filePath) {
                                                return new Promise(function (res, rej) {
                                                    var h = crypto_1.default.createHash('sha256');
                                                    var stream = fs_1.default.createReadStream(filePath);
                                                    stream.on('data', function (chunk) { return h.update(chunk); });
                                                    stream.on('end', function () { return res(h.digest('hex')); });
                                                    stream.on('error', function (err) { return rej(err); });
                                                });
                                            };
                                            return [4 /*yield*/, computeFileHash(fullFilePath).catch(function () { return ''; })];
                                        case 1:
                                            contentHash = _a.sent();
                                            return [4 /*yield*/, MediaFile_1.MediaFileModel.findOne({
                                                    $or: [
                                                        { contentHash: contentHash },
                                                        { name: part.filename, fileSize: stats.size }
                                                    ]
                                                })];
                                        case 2:
                                            existingFile = _a.sent();
                                            if (!existingFile) return [3 /*break*/, 5];
                                            fs_1.default.unlinkSync(fullFilePath);
                                            needsUpdate = false;
                                            if (!existingFile.contentHash && contentHash) {
                                                existingFile.contentHash = contentHash;
                                                needsUpdate = true;
                                            }
                                            if ((options === null || options === void 0 ? void 0 : options.contentName) && !existingFile.contentName) {
                                                existingFile.contentName = options.contentName;
                                                needsUpdate = true;
                                            }
                                            if ((options === null || options === void 0 ? void 0 : options.contentType) && !existingFile.contentType) {
                                                existingFile.contentType = options.contentType;
                                                needsUpdate = true;
                                            }
                                            if (!needsUpdate) return [3 /*break*/, 4];
                                            return [4 /*yield*/, existingFile.save().catch(function (err) { return console.error("Error updating existing local file metadata:", err); })];
                                        case 3:
                                            _a.sent();
                                            _a.label = 4;
                                        case 4: return [2 /*return*/, resolve({
                                                originalName: existingFile.name,
                                                fileName: path_1.default.basename(existingFile.filePath || existingFile.url),
                                                filePath: existingFile.filePath || existingFile.url,
                                                url: existingFile.url,
                                                fileSize: existingFile.fileSize,
                                                mimeType: existingFile.fileType,
                                                uploadType: uploadType,
                                                storageType: existingFile.storageType,
                                                s3Key: existingFile.s3Key,
                                            })];
                                        case 5:
                                            protocol = request.protocol;
                                            host = request.headers.host;
                                            baseUrl = "".concat(protocol, "://").concat(host);
                                            fileInfo = {
                                                originalName: part.filename,
                                                fileName: fileName,
                                                filePath: "/uploads/".concat(relativeFilePath.replace(/\\/g, '/')),
                                                url: "".concat(baseUrl, "/uploads/").concat(relativeFilePath.replace(/\\/g, '/')),
                                                fileSize: stats.size,
                                                mimeType: part.mimetype || 'application/octet-stream',
                                                uploadType: uploadType,
                                                storageType: 'local'
                                            };
                                            if (!((options === null || options === void 0 ? void 0 : options.trackInMediaLibrary) !== false)) return [3 /*break*/, 9];
                                            _a.label = 6;
                                        case 6:
                                            _a.trys.push([6, 8, , 9]);
                                            return [4 /*yield*/, MediaFile_1.MediaFileModel.create({
                                                    name: part.filename,
                                                    url: fileInfo.url,
                                                    filePath: fileInfo.filePath,
                                                    fileSize: stats.size,
                                                    fileType: part.mimetype || 'application/octet-stream',
                                                    folder: resolvedFolderId ? new mongoose_1.Types.ObjectId(resolvedFolderId) : undefined,
                                                    source: (options === null || options === void 0 ? void 0 : options.source) || uploadType.toLowerCase(),
                                                    sourceId: (options === null || options === void 0 ? void 0 : options.sourceId) ? new mongoose_1.Types.ObjectId(options.sourceId) : undefined,
                                                    contentHash: contentHash,
                                                    contentName: options === null || options === void 0 ? void 0 : options.contentName,
                                                    contentType: options === null || options === void 0 ? void 0 : options.contentType,
                                                    storageType: 'local'
                                                })];
                                        case 7:
                                            mediaFile_1 = _a.sent();
                                            if (isVideoFile(part.filename, part.mimetype || '')) {
                                                (0, hlsTranscoder_1.transcodeToHls)(mediaFile_1._id.toString(), fullFilePath, baseUrl).catch(function (err) {
                                                    logger_1.logger.error({ err: err, mediaFileId: mediaFile_1._id }, 'Failed to transcode video to HLS (local)');
                                                });
                                            }
                                            return [3 /*break*/, 9];
                                        case 8:
                                            error_2 = _a.sent();
                                            console.error('Failed to track file in media library:', error_2);
                                            return [3 /*break*/, 9];
                                        case 9:
                                            resolve(fileInfo);
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                            writeStream.on('error', reject);
                            return [2 /*return*/];
                        });
                    }); })];
        }
    });
}); };
exports.saveFileFromPart = saveFileFromPart;
var deleteUploadedFile = function (relativeFilePath, storageType) { return __awaiter(void 0, void 0, void 0, function () {
    var fullPath;
    return __generator(this, function (_a) {
        if (!relativeFilePath)
            return [2 /*return*/];
        fullPath = path_1.default.join(UPLOADS_ROOT, relativeFilePath.replace(/^\/*uploads\//, '').replace(/^\/+/, ''));
        if (fs_1.default.existsSync(fullPath)) {
            fs_1.default.unlinkSync(fullPath);
        }
        return [2 /*return*/];
    });
}); };
exports.deleteUploadedFile = deleteUploadedFile;
var formatFileSize = function (bytes) {
    if (bytes === 0)
        return '0 Bytes';
    var k = 1024;
    var sizes = ['Bytes', 'KB', 'MB', 'GB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
exports.formatFileSize = formatFileSize;
exports.default = {
    UPLOAD_TYPES: exports.UPLOAD_TYPES,
    ensureUploadDir: exports.ensureUploadDir,
    generateUniqueFileName: exports.generateUniqueFileName,
    validateFileType: exports.validateFileType,
    saveFileFromPart: exports.saveFileFromPart,
    deleteUploadedFile: exports.deleteUploadedFile,
    formatFileSize: exports.formatFileSize
};
