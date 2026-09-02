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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkDeleteAudioAlbums = exports.deleteAudioAlbum = exports.updateAudioAlbum = exports.createAudioAlbum = exports.getAudioAlbumById = exports.listAudioAlbums = void 0;
var AudioAlbum_1 = require("../models/AudioAlbum");
var uploadHandler_1 = __importDefault(require("../lib/uploadHandler"));
var readAlbumMultipart = function (request) { return __awaiter(void 0, void 0, void 0, function () {
    var parts, data, _a, parts_1, parts_1_1, part, uploadedFile, uploadedFile, e_1_1;
    var _b, e_1, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                parts = request.parts();
                data = {};
                _e.label = 1;
            case 1:
                _e.trys.push([1, 10, 11, 16]);
                _a = true, parts_1 = __asyncValues(parts);
                _e.label = 2;
            case 2: return [4 /*yield*/, parts_1.next()];
            case 3:
                if (!(parts_1_1 = _e.sent(), _b = parts_1_1.done, !_b)) return [3 /*break*/, 9];
                _d = parts_1_1.value;
                _a = false;
                part = _d;
                if (!(part.type === 'field')) return [3 /*break*/, 4];
                if (part.fieldname === 'name')
                    data.name = part.value;
                if (part.fieldname === 'artist')
                    data.artist = part.value;
                if (part.fieldname === 'artistId')
                    data.artistId = part.value;
                if (part.fieldname === 'genre')
                    data.genre = part.value;
                if (part.fieldname === 'description')
                    data.description = part.value;
                if (part.fieldname === 'releaseDate')
                    data.releaseDate = part.value;
                if (part.fieldname === 'status')
                    data.status = part.value === 'true';
                if (part.fieldname === 'image')
                    data.image = part.value;
                if (part.fieldname === 'coverImage')
                    data.coverImage = part.value;
                if (part.fieldname === 'songs') {
                    try {
                        data.songs = JSON.parse(part.value);
                    }
                    catch (_f) {
                        data.songs = [];
                    }
                }
                return [3 /*break*/, 8];
            case 4:
                if (!(part.type === 'file')) return [3 /*break*/, 8];
                if (!(part.fieldname === 'imageFile')) return [3 /*break*/, 6];
                return [4 /*yield*/, uploadHandler_1.default.saveFileFromPart(part, request, 'ALBUM')];
            case 5:
                uploadedFile = _e.sent();
                data.image = uploadedFile.filePath;
                return [3 /*break*/, 8];
            case 6:
                if (!(part.fieldname === 'coverImageFile')) return [3 /*break*/, 8];
                return [4 /*yield*/, uploadHandler_1.default.saveFileFromPart(part, request, 'ALBUM')];
            case 7:
                uploadedFile = _e.sent();
                data.coverImage = uploadedFile.filePath;
                _e.label = 8;
            case 8:
                _a = true;
                return [3 /*break*/, 2];
            case 9: return [3 /*break*/, 16];
            case 10:
                e_1_1 = _e.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 16];
            case 11:
                _e.trys.push([11, , 14, 15]);
                if (!(!_a && !_b && (_c = parts_1.return))) return [3 /*break*/, 13];
                return [4 /*yield*/, _c.call(parts_1)];
            case 12:
                _e.sent();
                _e.label = 13;
            case 13: return [3 /*break*/, 15];
            case 14:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 15: return [7 /*endfinally*/];
            case 16: return [2 /*return*/, data];
        }
    });
}); };
var listAudioAlbums = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var query, page, limit, search, filter, _a, albums, total, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                query = request.query;
                page = Math.max(1, parseInt(query.page || '1', 10));
                limit = Math.min(100, Math.max(1, parseInt(query.limit || '20', 10)));
                search = query.search || '';
                filter = {};
                if (search) {
                    filter.name = new RegExp(search, 'i');
                }
                return [4 /*yield*/, Promise.all([
                        AudioAlbum_1.AudioAlbumModel.find(filter)
                            .sort({ createdAt: -1 })
                            .skip((page - 1) * limit)
                            .limit(limit)
                            .lean(),
                        AudioAlbum_1.AudioAlbumModel.countDocuments(filter),
                    ])];
            case 1:
                _a = _b.sent(), albums = _a[0], total = _a[1];
                return [2 /*return*/, reply.send({
                        success: true,
                        data: albums.map(function (album) { return ({
                            id: album._id,
                            name: album.name,
                            artist: album.artist,
                            artistId: album.artistId,
                            image: album.image,
                            coverImage: album.coverImage,
                            description: album.description,
                            genre: album.genre,
                            releaseDate: album.releaseDate,
                            totalTracks: album.songs ? album.songs.length : 0,
                            status: album.status,
                            createdAt: album.createdAt,
                            updatedAt: album.updatedAt,
                        }); }),
                        pagination: {
                            page: page,
                            limit: limit,
                            total: total,
                            pages: Math.ceil(total / limit),
                        },
                    })];
            case 2:
                error_1 = _b.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_1.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.listAudioAlbums = listAudioAlbums;
var getAudioAlbumById = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var albumId, album, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                albumId = request.params.albumId;
                return [4 /*yield*/, AudioAlbum_1.AudioAlbumModel.findById(albumId).lean()];
            case 1:
                album = _a.sent();
                if (!album) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Album not found' })];
                }
                return [2 /*return*/, reply.send({
                        success: true,
                        data: {
                            id: album._id,
                            name: album.name,
                            artist: album.artist,
                            artistId: album.artistId,
                            image: album.image,
                            coverImage: album.coverImage,
                            description: album.description,
                            genre: album.genre,
                            releaseDate: album.releaseDate,
                            songs: album.songs || [],
                            totalTracks: album.songs ? album.songs.length : 0,
                            status: album.status,
                            createdAt: album.createdAt,
                            updatedAt: album.updatedAt,
                        },
                    })];
            case 2:
                error_2 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_2.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAudioAlbumById = getAudioAlbumById;
var createAudioAlbum = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var data, album, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, readAlbumMultipart(request)];
            case 1:
                data = _a.sent();
                if (!data.name) {
                    return [2 /*return*/, reply.status(400).send({ success: false, error: 'Album name is required' })];
                }
                return [4 /*yield*/, AudioAlbum_1.AudioAlbumModel.create({
                        name: data.name,
                        artist: data.artist,
                        artistId: data.artistId,
                        image: data.image,
                        coverImage: data.coverImage,
                        description: data.description,
                        genre: data.genre,
                        releaseDate: data.releaseDate ? new Date(data.releaseDate) : undefined,
                        songs: data.songs || [],
                        status: data.status !== undefined ? data.status : true,
                    })];
            case 2:
                album = _a.sent();
                return [2 /*return*/, reply.status(201).send({
                        success: true,
                        data: {
                            id: album._id,
                            name: album.name,
                            artist: album.artist,
                            artistId: album.artistId,
                            image: album.image,
                            coverImage: album.coverImage,
                            description: album.description,
                            genre: album.genre,
                            releaseDate: album.releaseDate,
                            songs: album.songs,
                            status: album.status,
                            createdAt: album.createdAt,
                            updatedAt: album.updatedAt,
                        },
                    })];
            case 3:
                error_3 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_3.message })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.createAudioAlbum = createAudioAlbum;
var updateAudioAlbum = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var albumId, data, existingAlbum, updateData, album, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                albumId = request.params.albumId;
                return [4 /*yield*/, readAlbumMultipart(request)];
            case 1:
                data = _a.sent();
                return [4 /*yield*/, AudioAlbum_1.AudioAlbumModel.findById(albumId)];
            case 2:
                existingAlbum = _a.sent();
                if (!existingAlbum) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Album not found' })];
                }
                if (data.image && existingAlbum.image) {
                    uploadHandler_1.default.deleteUploadedFile(existingAlbum.image);
                }
                if (data.coverImage && existingAlbum.coverImage) {
                    uploadHandler_1.default.deleteUploadedFile(existingAlbum.coverImage);
                }
                updateData = {};
                if (data.name)
                    updateData.name = data.name;
                if (data.artist !== undefined)
                    updateData.artist = data.artist;
                if (data.artistId !== undefined)
                    updateData.artistId = data.artistId;
                if (data.genre !== undefined)
                    updateData.genre = data.genre;
                if (data.description !== undefined)
                    updateData.description = data.description;
                if (data.image)
                    updateData.image = data.image;
                if (data.coverImage)
                    updateData.coverImage = data.coverImage;
                if (data.releaseDate)
                    updateData.releaseDate = new Date(data.releaseDate);
                if (data.songs)
                    updateData.songs = data.songs;
                if (data.status !== undefined)
                    updateData.status = data.status;
                return [4 /*yield*/, AudioAlbum_1.AudioAlbumModel.findByIdAndUpdate(albumId, { $set: updateData }, { returnDocument: 'after', runValidators: true }).lean()];
            case 3:
                album = _a.sent();
                return [2 /*return*/, reply.send({
                        success: true,
                        data: {
                            id: album._id,
                            name: album.name,
                            artist: album.artist,
                            artistId: album.artistId,
                            image: album.image,
                            coverImage: album.coverImage,
                            description: album.description,
                            genre: album.genre,
                            releaseDate: album.releaseDate,
                            songs: album.songs || [],
                            status: album.status,
                            createdAt: album.createdAt,
                            updatedAt: album.updatedAt,
                        },
                    })];
            case 4:
                error_4 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_4.message })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.updateAudioAlbum = updateAudioAlbum;
var deleteAudioAlbum = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var albumId, album, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                albumId = request.params.albumId;
                return [4 /*yield*/, AudioAlbum_1.AudioAlbumModel.findByIdAndDelete(albumId)];
            case 1:
                album = _a.sent();
                if (!album) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Album not found' })];
                }
                if (album.image) {
                    uploadHandler_1.default.deleteUploadedFile(album.image);
                }
                if (album.coverImage) {
                    uploadHandler_1.default.deleteUploadedFile(album.coverImage);
                }
                return [2 /*return*/, reply.send({
                        success: true,
                        message: 'Album deleted successfully',
                    })];
            case 2:
                error_5 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_5.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteAudioAlbum = deleteAudioAlbum;
var bulkDeleteAudioAlbums = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var ids, albums, result, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                ids = request.body.ids;
                if (!Array.isArray(ids) || ids.length === 0) {
                    return [2 /*return*/, reply.status(400).send({ success: false, message: 'Invalid or empty ids array' })];
                }
                return [4 /*yield*/, AudioAlbum_1.AudioAlbumModel.find({ _id: { $in: ids } })];
            case 1:
                albums = _a.sent();
                albums.forEach(function (album) {
                    if (album.image)
                        uploadHandler_1.default.deleteUploadedFile(album.image);
                    if (album.coverImage)
                        uploadHandler_1.default.deleteUploadedFile(album.coverImage);
                });
                return [4 /*yield*/, AudioAlbum_1.AudioAlbumModel.deleteMany({ _id: { $in: ids } })];
            case 2:
                result = _a.sent();
                return [2 /*return*/, {
                        success: true,
                        message: "".concat(result.deletedCount, " albums deleted successfully"),
                        deletedCount: result.deletedCount,
                    }];
            case 3:
                error_6 = _a.sent();
                console.error('Error bulk deleting albums:', error_6);
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error', error: error_6.message })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.bulkDeleteAudioAlbums = bulkDeleteAudioAlbums;
