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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var Audio_1 = require("../models/Audio");
var VideoMusic_1 = require("../models/VideoMusic");
var AudioArtist_1 = require("../models/AudioArtist");
var AudioAlbum_1 = require("../models/AudioAlbum");
var musicApiRoutes = function (fastify) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        // ─── Get All Songs (Audio) ──────────────────────────────────────────
        // GET /api/songs?page=1&limit=20&trending=true&featured=true&genre=xxx&search=xxx
        fastify.get('/songs', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
            var query, page, limit, filter, _a, songs, total, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        query = request.query;
                        page = Math.max(1, Number(query.page || 1));
                        limit = Math.min(50, Math.max(1, Number(query.limit || 20)));
                        filter = { status: 'published' };
                        if (query.trending === 'true')
                            filter.trending = true;
                        if (query.featured === 'true')
                            filter.featured = true;
                        if (query.new === 'true')
                            filter.isNewContent = true;
                        if (query.genre)
                            filter.genre = query.genre;
                        if (query.artist)
                            filter.artist = new RegExp(query.artist, 'i');
                        if (query.album)
                            filter.album = new RegExp(query.album, 'i');
                        if (query.search) {
                            filter.$or = [
                                { title: new RegExp(query.search, 'i') },
                                { artist: new RegExp(query.search, 'i') },
                                { album: new RegExp(query.search, 'i') },
                            ];
                        }
                        return [4 /*yield*/, Promise.all([
                                Audio_1.AudioModel.find(filter)
                                    .populate('genre', 'name')
                                    .sort(query.trending === 'true' ? { views: -1 } : { createdAt: -1 })
                                    .skip((page - 1) * limit)
                                    .limit(limit)
                                    .lean(),
                                Audio_1.AudioModel.countDocuments(filter),
                            ])];
                    case 1:
                        _a = _b.sent(), songs = _a[0], total = _a[1];
                        return [2 /*return*/, reply.send({
                                success: true,
                                data: songs.map(formatSong),
                                pagination: { page: page, limit: limit, total: total, pages: Math.ceil(total / limit) },
                            })];
                    case 2:
                        error_1 = _b.sent();
                        return [2 /*return*/, reply.status(500).send({ success: false, error: error_1.message })];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        // ─── Get Song Detail ────────────────────────────────────────────────
        // GET /api/songs/:id
        fastify.get('/songs/:id', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
            var id, song, related, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        id = request.params.id;
                        return [4 /*yield*/, Audio_1.AudioModel.findById(id)
                                .populate('genre', 'name')
                                .populate('artistId', 'name image')
                                .populate('albumId', 'name image')
                                .lean()];
                    case 1:
                        song = _a.sent();
                        if (!song) {
                            return [2 /*return*/, reply.status(404).send({ success: false, error: 'Song not found' })];
                        }
                        // Increment views
                        Audio_1.AudioModel.findByIdAndUpdate(id, { $inc: { views: 1 } }).exec();
                        return [4 /*yield*/, Audio_1.AudioModel.find({
                                status: 'published',
                                _id: { $ne: song._id },
                                $or: __spreadArray(__spreadArray([], (song.artist ? [{ artist: song.artist }] : []), true), (song.genre ? [{ genre: song.genre }] : []), true),
                            })
                                .sort({ views: -1 })
                                .limit(10)
                                .lean()];
                    case 2:
                        related = _a.sent();
                        return [2 /*return*/, reply.send({
                                success: true,
                                data: __assign(__assign({}, formatSong(song)), { description: song.description, shortDescription: song.shortDescription, coverImage: song.coverImage, lyrics: song.lyrics, releaseDate: song.releaseDate, tags: song.tags, audioQualities: song.audioQualities, hlsUrl: song.hlsUrl, downloadAllowed: song.downloadAllowed, related: related.map(formatSong) }),
                            })];
                    case 3:
                        error_2 = _a.sent();
                        return [2 /*return*/, reply.status(500).send({ success: false, error: error_2.message })];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        // ─── Get All Video Music ────────────────────────────────────────────
        // GET /api/videos?page=1&limit=20&trending=true&featured=true&search=xxx
        fastify.get('/videos', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
            var query, page, limit, filter, _a, videos, total, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        query = request.query;
                        page = Math.max(1, Number(query.page || 1));
                        limit = Math.min(50, Math.max(1, Number(query.limit || 20)));
                        filter = { status: 'published' };
                        if (query.trending === 'true')
                            filter.trending = true;
                        if (query.featured === 'true')
                            filter.featured = true;
                        if (query.new === 'true')
                            filter.isNewContent = true;
                        if (query.genre)
                            filter.genre = query.genre;
                        if (query.artist)
                            filter.artist = new RegExp(query.artist, 'i');
                        if (query.search) {
                            filter.$or = [
                                { title: new RegExp(query.search, 'i') },
                                { artist: new RegExp(query.search, 'i') },
                                { album: new RegExp(query.search, 'i') },
                            ];
                        }
                        return [4 /*yield*/, Promise.all([
                                VideoMusic_1.VideoMusicModel.find(filter)
                                    .populate('genre', 'name')
                                    .sort(query.trending === 'true' ? { views: -1 } : { createdAt: -1 })
                                    .skip((page - 1) * limit)
                                    .limit(limit)
                                    .lean(),
                                VideoMusic_1.VideoMusicModel.countDocuments(filter),
                            ])];
                    case 1:
                        _a = _b.sent(), videos = _a[0], total = _a[1];
                        return [2 /*return*/, reply.send({
                                success: true,
                                data: videos.map(formatVideo),
                                pagination: { page: page, limit: limit, total: total, pages: Math.ceil(total / limit) },
                            })];
                    case 2:
                        error_3 = _b.sent();
                        return [2 /*return*/, reply.status(500).send({ success: false, error: error_3.message })];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        // ─── Get Video Detail ───────────────────────────────────────────────
        // GET /api/videos/:id
        fastify.get('/videos/:id', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
            var id, video, related, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        id = request.params.id;
                        return [4 /*yield*/, VideoMusic_1.VideoMusicModel.findById(id)
                                .populate('genre', 'name')
                                .populate('artistId', 'name image')
                                .lean()];
                    case 1:
                        video = _a.sent();
                        if (!video) {
                            return [2 /*return*/, reply.status(404).send({ success: false, error: 'Video not found' })];
                        }
                        // Increment views
                        VideoMusic_1.VideoMusicModel.findByIdAndUpdate(id, { $inc: { views: 1 } }).exec();
                        return [4 /*yield*/, VideoMusic_1.VideoMusicModel.find({
                                status: 'published',
                                _id: { $ne: video._id },
                                $or: __spreadArray(__spreadArray([], (video.artist ? [{ artist: video.artist }] : []), true), (video.genre ? [{ genre: video.genre }] : []), true),
                            })
                                .sort({ views: -1 })
                                .limit(10)
                                .lean()];
                    case 2:
                        related = _a.sent();
                        return [2 /*return*/, reply.send({
                                success: true,
                                data: __assign(__assign({}, formatVideo(video)), { description: video.description, coverImage: video.coverImage, releaseDate: video.releaseDate, tags: video.tags, videoQualities: video.videoQualities, hlsUrl: video.hlsUrl, downloadAllowed: video.downloadAllowed, related: related.map(formatVideo) }),
                            })];
                    case 3:
                        error_4 = _a.sent();
                        return [2 /*return*/, reply.status(500).send({ success: false, error: error_4.message })];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        // ─── Get All Artists ────────────────────────────────────────────────
        // GET /api/artists?page=1&limit=20&search=xxx
        fastify.get('/artists', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
            var query, page, limit, filter, _a, artists, total, error_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        query = request.query;
                        page = Math.max(1, Number(query.page || 1));
                        limit = Math.min(50, Math.max(1, Number(query.limit || 20)));
                        filter = { status: true };
                        if (query.search) {
                            filter.name = new RegExp(query.search, 'i');
                        }
                        return [4 /*yield*/, Promise.all([
                                AudioArtist_1.AudioArtistModel.find(filter)
                                    .sort({ createdAt: -1 })
                                    .skip((page - 1) * limit)
                                    .limit(limit)
                                    .lean(),
                                AudioArtist_1.AudioArtistModel.countDocuments(filter),
                            ])];
                    case 1:
                        _a = _b.sent(), artists = _a[0], total = _a[1];
                        return [2 /*return*/, reply.send({
                                success: true,
                                data: artists.map(function (a) { return ({
                                    id: a._id,
                                    name: a.name,
                                    image: a.image,
                                    coverImage: a.coverImage,
                                    bio: a.bio,
                                    genre: a.genre,
                                    country: a.country,
                                }); }),
                                pagination: { page: page, limit: limit, total: total, pages: Math.ceil(total / limit) },
                            })];
                    case 2:
                        error_5 = _b.sent();
                        return [2 /*return*/, reply.status(500).send({ success: false, error: error_5.message })];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        // ─── Get Artist Detail with Songs ───────────────────────────────────
        // GET /api/artists/:id
        fastify.get('/artists/:id', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
            var id, artist, songs, albums, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        id = request.params.id;
                        return [4 /*yield*/, AudioArtist_1.AudioArtistModel.findById(id).lean()];
                    case 1:
                        artist = _a.sent();
                        if (!artist) {
                            return [2 /*return*/, reply.status(404).send({ success: false, error: 'Artist not found' })];
                        }
                        return [4 /*yield*/, Audio_1.AudioModel.find({ artistId: id, status: 'published' })
                                .sort({ views: -1 })
                                .lean()];
                    case 2:
                        songs = _a.sent();
                        return [4 /*yield*/, AudioAlbum_1.AudioAlbumModel.find({ artistId: id, status: true })
                                .sort({ createdAt: -1 })
                                .lean()];
                    case 3:
                        albums = _a.sent();
                        return [2 /*return*/, reply.send({
                                success: true,
                                data: {
                                    id: artist._id,
                                    name: artist.name,
                                    image: artist.image,
                                    coverImage: artist.coverImage,
                                    bio: artist.bio,
                                    genre: artist.genre,
                                    country: artist.country,
                                    songs: songs.map(formatSong),
                                    albums: albums.map(function (a) {
                                        var _a;
                                        return ({
                                            id: a._id,
                                            name: a.name,
                                            image: a.image,
                                            totalTracks: ((_a = a.songs) === null || _a === void 0 ? void 0 : _a.length) || 0,
                                        });
                                    }),
                                },
                            })];
                    case 4:
                        error_6 = _a.sent();
                        return [2 /*return*/, reply.status(500).send({ success: false, error: error_6.message })];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
        // ─── Get All Albums ─────────────────────────────────────────────────
        // GET /api/albums?page=1&limit=20&search=xxx
        fastify.get('/albums', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
            var query, page, limit, filter, _a, albums, total, error_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        query = request.query;
                        page = Math.max(1, Number(query.page || 1));
                        limit = Math.min(50, Math.max(1, Number(query.limit || 20)));
                        filter = { status: true };
                        if (query.search) {
                            filter.name = new RegExp(query.search, 'i');
                        }
                        return [4 /*yield*/, Promise.all([
                                AudioAlbum_1.AudioAlbumModel.find(filter)
                                    .populate('artistId', 'name image')
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
                                data: albums.map(function (a) {
                                    var _a, _b, _c;
                                    return ({
                                        id: a._id,
                                        name: a.name,
                                        image: a.image,
                                        coverImage: a.coverImage,
                                        artist: a.artist,
                                        artistId: ((_a = a.artistId) === null || _a === void 0 ? void 0 : _a._id) || a.artistId,
                                        artistName: (_b = a.artistId) === null || _b === void 0 ? void 0 : _b.name,
                                        description: a.description,
                                        genre: a.genre,
                                        releaseDate: a.releaseDate,
                                        totalTracks: ((_c = a.songs) === null || _c === void 0 ? void 0 : _c.length) || 0,
                                    });
                                }),
                                pagination: { page: page, limit: limit, total: total, pages: Math.ceil(total / limit) },
                            })];
                    case 2:
                        error_7 = _b.sent();
                        return [2 /*return*/, reply.status(500).send({ success: false, error: error_7.message })];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        // ─── Get Album Detail with Songs ────────────────────────────────────
        // GET /api/albums/:id
        fastify.get('/albums/:id', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
            var id, album, trackIds, songs, error_8;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 3, , 4]);
                        id = request.params.id;
                        return [4 /*yield*/, AudioAlbum_1.AudioAlbumModel.findById(id)
                                .populate('artistId', 'name image bio')
                                .lean()];
                    case 1:
                        album = _d.sent();
                        if (!album) {
                            return [2 /*return*/, reply.status(404).send({ success: false, error: 'Album not found' })];
                        }
                        trackIds = album.songs || [];
                        return [4 /*yield*/, Audio_1.AudioModel.find({ _id: { $in: trackIds }, status: 'published' }).lean()];
                    case 2:
                        songs = _d.sent();
                        return [2 /*return*/, reply.send({
                                success: true,
                                data: {
                                    id: album._id,
                                    name: album.name,
                                    image: album.image,
                                    coverImage: album.coverImage,
                                    description: album.description,
                                    genre: album.genre,
                                    releaseDate: album.releaseDate,
                                    artist: {
                                        id: ((_a = album.artistId) === null || _a === void 0 ? void 0 : _a._id) || album.artistId,
                                        name: (_b = album.artistId) === null || _b === void 0 ? void 0 : _b.name,
                                        image: (_c = album.artistId) === null || _c === void 0 ? void 0 : _c.image,
                                    },
                                    songs: songs.map(formatSong),
                                },
                            })];
                    case 3:
                        error_8 = _d.sent();
                        return [2 /*return*/, reply.status(500).send({ success: false, error: error_8.message })];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        // ─── Search Songs/Videos/Artists/Albums ─────────────────────────────
        // GET /api/search?q=xxx&type=songs|videos|artists|albums|all
        fastify.get('/search', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
            var _a, q, type, searchRegex, limit, results, _b, _c, _d, _e, error_9;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _f.trys.push([0, 9, , 10]);
                        _a = request.query, q = _a.q, type = _a.type;
                        if (!q) {
                            return [2 /*return*/, reply.status(400).send({ success: false, error: 'Query parameter q is required' })];
                        }
                        searchRegex = new RegExp(q, 'i');
                        limit = 20;
                        results = {};
                        if (!(!type || type === 'all' || type === 'songs')) return [3 /*break*/, 2];
                        _b = results;
                        return [4 /*yield*/, Audio_1.AudioModel.find({
                                status: 'published',
                                $or: [
                                    { title: searchRegex },
                                    { artist: searchRegex },
                                    { album: searchRegex },
                                ],
                            }).limit(limit).lean()];
                    case 1:
                        _b.songs = _f.sent();
                        _f.label = 2;
                    case 2:
                        if (!(!type || type === 'all' || type === 'videos')) return [3 /*break*/, 4];
                        _c = results;
                        return [4 /*yield*/, VideoMusic_1.VideoMusicModel.find({
                                status: 'published',
                                $or: [
                                    { title: searchRegex },
                                    { artist: searchRegex },
                                    { album: searchRegex },
                                ],
                            }).limit(limit).lean()];
                    case 3:
                        _c.videos = _f.sent();
                        _f.label = 4;
                    case 4:
                        if (!(!type || type === 'all' || type === 'artists')) return [3 /*break*/, 6];
                        _d = results;
                        return [4 /*yield*/, AudioArtist_1.AudioArtistModel.find({
                                status: true,
                                name: searchRegex,
                            }).limit(limit).lean()];
                    case 5:
                        _d.artists = _f.sent();
                        _f.label = 6;
                    case 6:
                        if (!(!type || type === 'all' || type === 'albums')) return [3 /*break*/, 8];
                        _e = results;
                        return [4 /*yield*/, AudioAlbum_1.AudioAlbumModel.find({
                                status: true,
                                name: searchRegex,
                            }).limit(limit).lean()];
                    case 7:
                        _e.albums = _f.sent();
                        _f.label = 8;
                    case 8: return [2 /*return*/, reply.send({
                            success: true,
                            data: {
                                songs: (results.songs || []).map(formatSong),
                                videos: (results.videos || []).map(formatVideo),
                                artists: (results.artists || []).map(function (a) { return ({
                                    id: a._id,
                                    name: a.name,
                                    image: a.image,
                                }); }),
                                albums: (results.albums || []).map(function (a) { return ({
                                    id: a._id,
                                    name: a.name,
                                    image: a.image,
                                    artist: a.artist,
                                }); }),
                            },
                        })];
                    case 9:
                        error_9 = _f.sent();
                        return [2 /*return*/, reply.status(500).send({ success: false, error: error_9.message })];
                    case 10: return [2 /*return*/];
                }
            });
        }); });
        // ─── Like Song ──────────────────────────────────────────────────────
        // POST /api/songs/:id/like
        fastify.post('/songs/:id/like', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
            var id, song, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = request.params.id;
                        return [4 /*yield*/, Audio_1.AudioModel.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { returnDocument: 'after' })
                                .select('likes').lean()];
                    case 1:
                        song = _a.sent();
                        if (!song)
                            return [2 /*return*/, reply.status(404).send({ success: false, error: 'Song not found' })];
                        return [2 /*return*/, reply.send({ success: true, data: { likes: song.likes, isLiked: true } })];
                    case 2:
                        error_10 = _a.sent();
                        return [2 /*return*/, reply.status(500).send({ success: false, error: error_10.message })];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        // ─── Like Video ─────────────────────────────────────────────────────
        // POST /api/videos/:id/like
        fastify.post('/videos/:id/like', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
            var id, video, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = request.params.id;
                        return [4 /*yield*/, VideoMusic_1.VideoMusicModel.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { returnDocument: 'after' })
                                .select('likes').lean()];
                    case 1:
                        video = _a.sent();
                        if (!video)
                            return [2 /*return*/, reply.status(404).send({ success: false, error: 'Video not found' })];
                        return [2 /*return*/, reply.send({ success: true, data: { likes: video.likes, isLiked: true } })];
                    case 2:
                        error_11 = _a.sent();
                        return [2 /*return*/, reply.status(500).send({ success: false, error: error_11.message })];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        // ─── Share Song ─────────────────────────────────────────────────────
        // POST /api/songs/:id/share
        fastify.post('/songs/:id/share', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
            var id, song, error_12;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        id = request.params.id;
                        return [4 /*yield*/, Audio_1.AudioModel.findByIdAndUpdate(id, { $inc: { shares: 1 } }, { returnDocument: 'after' })
                                .select('shares').lean()];
                    case 1:
                        song = _b.sent();
                        return [2 /*return*/, reply.send({ success: true, data: { shares: (_a = song === null || song === void 0 ? void 0 : song.shares) !== null && _a !== void 0 ? _a : 1 } })];
                    case 2:
                        error_12 = _b.sent();
                        return [2 /*return*/, reply.status(500).send({ success: false, error: error_12.message })];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        // ─── Share Video ────────────────────────────────────────────────────
        // POST /api/videos/:id/share
        fastify.post('/videos/:id/share', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
            var id, video, error_13;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        id = request.params.id;
                        return [4 /*yield*/, VideoMusic_1.VideoMusicModel.findByIdAndUpdate(id, { $inc: { shares: 1 } }, { returnDocument: 'after' })
                                .select('shares').lean()];
                    case 1:
                        video = _b.sent();
                        return [2 /*return*/, reply.send({ success: true, data: { shares: (_a = video === null || video === void 0 ? void 0 : video.shares) !== null && _a !== void 0 ? _a : 1 } })];
                    case 2:
                        error_13 = _b.sent();
                        return [2 /*return*/, reply.status(500).send({ success: false, error: error_13.message })];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); };
// ─── Helper Functions ─────────────────────────────────────────────────
function formatSong(song) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return {
        id: ((_a = song._id) === null || _a === void 0 ? void 0 : _a.toString()) || song.id,
        title: song.title,
        artist: song.artist,
        artistId: ((_c = (_b = song.artistId) === null || _b === void 0 ? void 0 : _b._id) === null || _c === void 0 ? void 0 : _c.toString()) || song.artistId,
        artistName: ((_d = song.artistId) === null || _d === void 0 ? void 0 : _d.name) || song.artist,
        album: song.album,
        albumId: ((_f = (_e = song.albumId) === null || _e === void 0 ? void 0 : _e._id) === null || _f === void 0 ? void 0 : _f.toString()) || song.albumId,
        thumbnail: song.thumbnail,
        duration: song.duration,
        views: song.views || 0,
        likes: song.likes || 0,
        trending: song.trending || false,
        featured: song.featured || false,
        isNew: song.isNewContent || false,
        audioUrl: ((_h = (_g = song.audioQualities) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.url) || song.audioUrl,
        hlsUrl: song.hlsUrl,
        planRequired: song.planRequired || 'free',
        createdAt: song.createdAt,
    };
}
function formatVideo(video) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return {
        id: ((_a = video._id) === null || _a === void 0 ? void 0 : _a.toString()) || video.id,
        title: video.title,
        artist: video.artist,
        artistId: ((_c = (_b = video.artistId) === null || _b === void 0 ? void 0 : _b._id) === null || _c === void 0 ? void 0 : _c.toString()) || video.artistId,
        artistName: ((_d = video.artistId) === null || _d === void 0 ? void 0 : _d.name) || video.artist,
        album: video.album,
        albumId: ((_f = (_e = video.albumId) === null || _e === void 0 ? void 0 : _e._id) === null || _f === void 0 ? void 0 : _f.toString()) || video.albumId,
        thumbnail: video.thumbnail,
        duration: video.duration,
        views: video.views || 0,
        likes: video.likes || 0,
        trending: video.trending || false,
        featured: video.featured || false,
        isNew: video.isNewContent || false,
        videoUrl: ((_h = (_g = video.videoQualities) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.url) || video.videoUrl,
        hlsUrl: video.hlsUrl,
        planRequired: video.planRequired || 'free',
        createdAt: video.createdAt,
    };
}
exports.default = musicApiRoutes;
