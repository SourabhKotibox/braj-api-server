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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.uploadFilesToFolder = exports.getAllMediaFiles = exports.getFilesByFolder = exports.deleteFolder = exports.createFolder = exports.getFolders = exports.seedDefaultFolders = void 0;
var MediaFolder_1 = require("../models/MediaFolder");
var MediaFile_1 = require("../models/MediaFile");
var mongoose_1 = require("mongoose");
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var url_1 = require("url");
var logger_1 = require("../lib/logger");
var uploadHandler_1 = __importDefault(require("../lib/uploadHandler"));
var __filename = (0, url_1.fileURLToPath)(import.meta.url);
var __dirname = path_1.default.dirname(__filename);
var uploadsRoot = path_1.default.join(__dirname, '../../uploads');
var mediaUploadDir = path_1.default.join(uploadsRoot, 'media');
// Utility functions
var ensureDir = function (dir) {
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
};
// Seed default folders
var seedDefaultFolders = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, defaultFolderNames, _i, defaultFolderNames_1, name_1, folder, subfolders, _b, subfolders_1, subName;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                return [4 /*yield*/, MediaFolder_1.MediaFolderModel.collection.dropIndex('name_1')];
            case 1:
                _c.sent();
                logger_1.logger.info('Dropped stale name_1 index from mediafolders');
                return [3 /*break*/, 3];
            case 2:
                _a = _c.sent();
                return [3 /*break*/, 3];
            case 3:
                defaultFolderNames = [
                    'Ads',
                    'Banner',
                    'Cast & Crew',
                    'Constant',
                    'Genres',
                    'Logos',
                    'Movie',
                    'Short Drama',
                    'TV Show',
                    'Users',
                    'Video',
                ];
                _i = 0, defaultFolderNames_1 = defaultFolderNames;
                _c.label = 4;
            case 4:
                if (!(_i < defaultFolderNames_1.length)) return [3 /*break*/, 10];
                name_1 = defaultFolderNames_1[_i];
                return [4 /*yield*/, MediaFolder_1.MediaFolderModel.findOneAndUpdate({ name: name_1, parentFolder: null }, { $setOnInsert: { name: name_1, parentFolder: null } }, { upsert: true, returnDocument: 'after' })];
            case 5:
                folder = _c.sent();
                if (!(['Movie', 'TV Show', 'Short Drama'].includes(name_1) && folder)) return [3 /*break*/, 9];
                subfolders = ['Images', 'Videos'];
                _b = 0, subfolders_1 = subfolders;
                _c.label = 6;
            case 6:
                if (!(_b < subfolders_1.length)) return [3 /*break*/, 9];
                subName = subfolders_1[_b];
                return [4 /*yield*/, MediaFolder_1.MediaFolderModel.findOneAndUpdate({ name: subName, parentFolder: folder._id }, { $setOnInsert: { name: subName, parentFolder: folder._id } }, { upsert: true, returnDocument: 'after' })];
            case 7:
                _c.sent();
                _c.label = 8;
            case 8:
                _b++;
                return [3 /*break*/, 6];
            case 9:
                _i++;
                return [3 /*break*/, 4];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.seedDefaultFolders = seedDefaultFolders;
// Get all folders
var getFolders = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var query, filter, folders, foldersWithCount, _i, folders_1, folder, subFolders, subFolderIds, count, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                query = request.query;
                filter = { parentFolder: null };
                if (query.parentFolder) {
                    if (query.parentFolder === 'all') {
                        filter = {};
                    }
                    else if (mongoose_1.Types.ObjectId.isValid(query.parentFolder)) {
                        filter = { parentFolder: new mongoose_1.Types.ObjectId(query.parentFolder) };
                    }
                }
                return [4 /*yield*/, MediaFolder_1.MediaFolderModel.find(filter).sort({ name: 1 }).lean()];
            case 1:
                folders = _a.sent();
                foldersWithCount = [];
                _i = 0, folders_1 = folders;
                _a.label = 2;
            case 2:
                if (!(_i < folders_1.length)) return [3 /*break*/, 6];
                folder = folders_1[_i];
                return [4 /*yield*/, MediaFolder_1.MediaFolderModel.find({ parentFolder: folder._id })];
            case 3:
                subFolders = _a.sent();
                subFolderIds = subFolders.map(function (sf) { return sf._id; });
                return [4 /*yield*/, MediaFile_1.MediaFileModel.countDocuments({
                        folder: { $in: __spreadArray([folder._id], subFolderIds, true) }
                    })];
            case 4:
                count = _a.sent();
                foldersWithCount.push({
                    _id: folder._id,
                    name: folder.name,
                    parentFolder: folder.parentFolder,
                    count: count,
                });
                _a.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 2];
            case 6: return [2 /*return*/, reply.send({
                    success: true,
                    data: foldersWithCount,
                })];
            case 7:
                error_1 = _a.sent();
                logger_1.logger.error({ error: error_1 }, 'Error getting folders');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_1.message })];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.getFolders = getFolders;
// Create folder
var createFolder = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_2, parentFolder, parentId, existing, folder, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = request.body, name_2 = _a.name, parentFolder = _a.parentFolder;
                if (!name_2) {
                    return [2 /*return*/, reply.status(400).send({ success: false, error: 'Folder name is required' })];
                }
                parentId = parentFolder && mongoose_1.Types.ObjectId.isValid(parentFolder)
                    ? new mongoose_1.Types.ObjectId(parentFolder)
                    : null;
                return [4 /*yield*/, MediaFolder_1.MediaFolderModel.findOne({ name: name_2, parentFolder: parentId })];
            case 1:
                existing = _b.sent();
                if (existing) {
                    return [2 /*return*/, reply.status(400).send({ success: false, error: 'Folder already exists at this level' })];
                }
                return [4 /*yield*/, MediaFolder_1.MediaFolderModel.create({ name: name_2, parentFolder: parentId })];
            case 2:
                folder = _b.sent();
                return [2 /*return*/, reply.status(201).send({
                        success: true,
                        data: folder,
                    })];
            case 3:
                error_2 = _b.sent();
                logger_1.logger.error({ error: error_2 }, 'Error creating folder');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_2.message })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.createFolder = createFolder;
// Delete folder
var deleteFolder = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, folder, files, _i, files_1, file, folderPath, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 9, , 10]);
                id = request.params.id;
                if (!mongoose_1.Types.ObjectId.isValid(id)) {
                    return [2 /*return*/, reply.status(400).send({ success: false, error: 'Invalid folder ID' })];
                }
                return [4 /*yield*/, MediaFolder_1.MediaFolderModel.findById(id)];
            case 1:
                folder = _a.sent();
                if (!folder) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Folder not found' })];
                }
                return [4 /*yield*/, MediaFile_1.MediaFileModel.find({ folder: id })];
            case 2:
                files = _a.sent();
                _i = 0, files_1 = files;
                _a.label = 3;
            case 3:
                if (!(_i < files_1.length)) return [3 /*break*/, 6];
                file = files_1[_i];
                return [4 /*yield*/, uploadHandler_1.default.deleteUploadedFile(file.s3Key || file.filePath, file.storageType)];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6: 
            // Delete files from DB
            return [4 /*yield*/, MediaFile_1.MediaFileModel.deleteMany({ folder: id })];
            case 7:
                // Delete files from DB
                _a.sent();
                // Delete folder from DB
                return [4 /*yield*/, MediaFolder_1.MediaFolderModel.findByIdAndDelete(id)];
            case 8:
                // Delete folder from DB
                _a.sent();
                folderPath = path_1.default.join(mediaUploadDir, id);
                if (fs_1.default.existsSync(folderPath)) {
                    fs_1.default.rmSync(folderPath, { recursive: true, force: true });
                }
                return [2 /*return*/, reply.send({ success: true, message: 'Folder deleted successfully' })];
            case 9:
                error_3 = _a.sent();
                logger_1.logger.error({ error: error_3 }, 'Error deleting folder');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_3.message })];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.deleteFolder = deleteFolder;
// Helper to ensure file path has /uploads/ prefix
var ensureUploadPath = function (path) {
    if (!path)
        return path;
    if (path.startsWith('/uploads/'))
        return path;
    if (path.startsWith('uploads/'))
        return "/".concat(path);
    if (path.startsWith('/'))
        return "/uploads".concat(path);
    return "/uploads/".concat(path);
};
// Get files by folder
var getFilesByFolder = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id_1, folder, files, filesWithSize, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id_1 = request.params.id;
                if (!mongoose_1.Types.ObjectId.isValid(id_1)) {
                    return [2 /*return*/, reply.status(400).send({ success: false, error: 'Invalid folder ID' })];
                }
                return [4 /*yield*/, MediaFolder_1.MediaFolderModel.findById(id_1)];
            case 1:
                folder = _a.sent();
                if (!folder) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Folder not found' })];
                }
                return [4 /*yield*/, MediaFile_1.MediaFileModel.find({ folder: id_1 }).sort({ createdAt: -1 }).lean()];
            case 2:
                files = _a.sent();
                filesWithSize = files.map(function (file) {
                    var _a;
                    var fileUrl = file.url;
                    var filePath = file.filePath;
                    if (file.storageType !== 's3') {
                        var normalizedPath = ensureUploadPath(file.filePath);
                        var protocol = request.protocol;
                        var host = request.headers.host;
                        fileUrl = "".concat(protocol, "://").concat(host).concat(normalizedPath);
                        filePath = normalizedPath;
                    }
                    return {
                        _id: file._id,
                        id: file._id.toString(),
                        name: file.name,
                        url: fileUrl,
                        filePath: filePath,
                        size: uploadHandler_1.default.formatFileSize(file.fileSize),
                        fileSize: file.fileSize,
                        fileType: file.fileType,
                        folder: id_1,
                        source: file.source,
                        sourceId: (_a = file.sourceId) === null || _a === void 0 ? void 0 : _a.toString(),
                        storageType: file.storageType,
                        s3Key: file.s3Key,
                        isHls: file.isHls,
                        hlsMasterPlaylistUrl: file.hlsMasterPlaylistUrl,
                        hlsMasterPlaylistPath: file.hlsMasterPlaylistPath,
                        hlsQualities: file.hlsQualities,
                        hlsStatus: file.hlsStatus,
                        hlsError: file.hlsError,
                        duration: file.duration,
                        createdAt: file.createdAt,
                        updatedAt: file.updatedAt,
                    };
                });
                return [2 /*return*/, reply.send({
                        success: true,
                        data: filesWithSize,
                    })];
            case 3:
                error_4 = _a.sent();
                logger_1.logger.error({ error: error_4 }, 'Error getting files');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_4.message })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getFilesByFolder = getFilesByFolder;
// Get all media files (with optional filtering)
var getAllMediaFiles = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var query, page, limit, skip, filter, _a, files, total, filesWithSize, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                query = request.query;
                page = Math.max(1, Number(query.page || 1));
                limit = Math.min(100, Math.max(1, Number(query.limit || 50)));
                skip = (page - 1) * limit;
                filter = {};
                if (query.source)
                    filter.source = query.source;
                if (query.fileType)
                    filter.fileType = new RegExp(query.fileType, 'i');
                if (query.search)
                    filter.name = new RegExp(query.search, 'i');
                return [4 /*yield*/, Promise.all([
                        MediaFile_1.MediaFileModel.find(filter)
                            .sort({ createdAt: -1 })
                            .skip(skip)
                            .limit(limit)
                            .lean(),
                        MediaFile_1.MediaFileModel.countDocuments(filter)
                    ])];
            case 1:
                _a = _b.sent(), files = _a[0], total = _a[1];
                filesWithSize = files.map(function (file) {
                    var _a, _b;
                    var fileUrl = file.url;
                    var filePath = file.filePath;
                    if (file.storageType !== 's3') {
                        var normalizedPath = ensureUploadPath(file.filePath);
                        var protocol = request.protocol;
                        var host = request.headers.host;
                        fileUrl = "".concat(protocol, "://").concat(host).concat(normalizedPath);
                        filePath = normalizedPath;
                    }
                    return {
                        _id: file._id,
                        id: file._id.toString(),
                        name: file.name,
                        url: fileUrl,
                        filePath: filePath,
                        size: uploadHandler_1.default.formatFileSize(file.fileSize),
                        fileSize: file.fileSize,
                        fileType: file.fileType,
                        folder: (_a = file.folder) === null || _a === void 0 ? void 0 : _a.toString(),
                        source: file.source,
                        sourceId: (_b = file.sourceId) === null || _b === void 0 ? void 0 : _b.toString(),
                        storageType: file.storageType,
                        s3Key: file.s3Key,
                        isHls: file.isHls,
                        hlsMasterPlaylistUrl: file.hlsMasterPlaylistUrl,
                        hlsMasterPlaylistPath: file.hlsMasterPlaylistPath,
                        hlsQualities: file.hlsQualities,
                        hlsStatus: file.hlsStatus,
                        hlsError: file.hlsError,
                        duration: file.duration,
                        createdAt: file.createdAt,
                        updatedAt: file.updatedAt,
                    };
                });
                return [2 /*return*/, reply.send({
                        success: true,
                        data: filesWithSize,
                        pagination: {
                            page: page,
                            limit: limit,
                            total: total,
                            pages: Math.ceil(total / limit),
                        },
                    })];
            case 2:
                error_5 = _b.sent();
                logger_1.logger.error({ error: error_5 }, 'Error getting all media files');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_5.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllMediaFiles = getAllMediaFiles;
// Upload file to folder
var uploadFilesToFolder = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, folder, savedFiles, source, subfolders, imagesSubfolder, videosSubfolder, parts, _a, parts_1, parts_1_1, part, targetFolderId, isVideo, isImage, customDir, uploadedFile, e_1_1, error_6;
    var _b, e_1, _c, _d;
    var _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                _g.trys.push([0, 17, , 18]);
                id = request.params.id;
                if (!mongoose_1.Types.ObjectId.isValid(id)) {
                    return [2 /*return*/, reply.status(400).send({ success: false, error: 'Invalid folder ID' })];
                }
                return [4 /*yield*/, MediaFolder_1.MediaFolderModel.findById(id)];
            case 1:
                folder = _g.sent();
                if (!folder) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Folder not found' })];
                }
                savedFiles = [];
                source = 'media-library';
                return [4 /*yield*/, MediaFolder_1.MediaFolderModel.find({ parentFolder: folder._id })];
            case 2:
                subfolders = _g.sent();
                imagesSubfolder = subfolders.find(function (sf) { return sf.name.toLowerCase() === 'images'; });
                videosSubfolder = subfolders.find(function (sf) { return sf.name.toLowerCase() === 'videos'; });
                parts = request.parts();
                _g.label = 3;
            case 3:
                _g.trys.push([3, 10, 11, 16]);
                _a = true, parts_1 = __asyncValues(parts);
                _g.label = 4;
            case 4: return [4 /*yield*/, parts_1.next()];
            case 5:
                if (!(parts_1_1 = _g.sent(), _b = parts_1_1.done, !_b)) return [3 /*break*/, 9];
                _d = parts_1_1.value;
                _a = false;
                part = _d;
                if (!(part.type === 'file' && part.fieldname === 'file')) return [3 /*break*/, 7];
                targetFolderId = id;
                isVideo = ((_e = part.mimetype) === null || _e === void 0 ? void 0 : _e.startsWith('video/')) || part.filename.match(/\.(mp4|webm|mov|mkv|avi|flv)$/i);
                isImage = ((_f = part.mimetype) === null || _f === void 0 ? void 0 : _f.startsWith('image/')) || part.filename.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i);
                if (isVideo && videosSubfolder) {
                    targetFolderId = videosSubfolder._id.toString();
                }
                else if (isImage && imagesSubfolder) {
                    targetFolderId = imagesSubfolder._id.toString();
                }
                customDir = "media/".concat(targetFolderId);
                return [4 /*yield*/, uploadHandler_1.default.saveFileFromPart(part, request, 'MEDIA_LIBRARY', customDir, {
                        trackInMediaLibrary: true,
                        source: source,
                        folderId: targetFolderId,
                    })];
            case 6:
                uploadedFile = _g.sent();
                savedFiles.push(uploadedFile);
                return [3 /*break*/, 8];
            case 7:
                if (part.type === 'field' && part.fieldname === 'source') {
                    source = part.value;
                }
                _g.label = 8;
            case 8:
                _a = true;
                return [3 /*break*/, 4];
            case 9: return [3 /*break*/, 16];
            case 10:
                e_1_1 = _g.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 16];
            case 11:
                _g.trys.push([11, , 14, 15]);
                if (!(!_a && !_b && (_c = parts_1.return))) return [3 /*break*/, 13];
                return [4 /*yield*/, _c.call(parts_1)];
            case 12:
                _g.sent();
                _g.label = 13;
            case 13: return [3 /*break*/, 15];
            case 14:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 15: return [7 /*endfinally*/];
            case 16: return [2 /*return*/, reply.status(201).send({
                    success: true,
                    data: savedFiles,
                })];
            case 17:
                error_6 = _g.sent();
                logger_1.logger.error({ error: error_6 }, 'Error uploading files');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_6.message })];
            case 18: return [2 /*return*/];
        }
    });
}); };
exports.uploadFilesToFolder = uploadFilesToFolder;
// Delete file
var deleteFile = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, file, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                id = request.params.id;
                if (!mongoose_1.Types.ObjectId.isValid(id)) {
                    return [2 /*return*/, reply.status(400).send({ success: false, error: 'Invalid file ID' })];
                }
                return [4 /*yield*/, MediaFile_1.MediaFileModel.findById(id)];
            case 1:
                file = _a.sent();
                if (!file) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'File not found' })];
                }
                if (file.sourceId && file.contentName) {
                    return [2 /*return*/, reply.status(400).send({
                            success: false,
                            error: "This file is currently in use by \"".concat(file.contentName, "\" (").concat(file.contentType, "). Please update or remove that content before deleting this file.")
                        })];
                }
                // Delete file from storage
                return [4 /*yield*/, uploadHandler_1.default.deleteUploadedFile(file.s3Key || file.filePath, file.storageType)];
            case 2:
                // Delete file from storage
                _a.sent();
                // Delete from DB
                return [4 /*yield*/, MediaFile_1.MediaFileModel.findByIdAndDelete(id)];
            case 3:
                // Delete from DB
                _a.sent();
                return [2 /*return*/, reply.send({ success: true, message: 'File deleted successfully' })];
            case 4:
                error_7 = _a.sent();
                logger_1.logger.error({ error: error_7 }, 'Error deleting file');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_7.message })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.deleteFile = deleteFile;
