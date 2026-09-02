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
exports.bulkDeleteGenres = exports.deleteGenre = exports.updateGenre = exports.createGenre = exports.getGenreById = exports.listGenres = void 0;
var Genre_1 = require("../models/Genre");
var uploadHandler_1 = __importDefault(require("../lib/uploadHandler"));
var readGenreMultipart = function (request) { return __awaiter(void 0, void 0, void 0, function () {
    var data, _a, _b, _c, part, uploadedFile, e_1_1;
    var _d, e_1, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                data = {};
                console.log('readGenreMultipart: Starting to read parts');
                _g.label = 1;
            case 1:
                _g.trys.push([1, 8, 9, 14]);
                _a = true, _b = __asyncValues(request.parts());
                _g.label = 2;
            case 2: return [4 /*yield*/, _b.next()];
            case 3:
                if (!(_c = _g.sent(), _d = _c.done, !_d)) return [3 /*break*/, 7];
                _f = _c.value;
                _a = false;
                part = _f;
                console.log('readGenreMultipart: Got part:', part.type, part.fieldname, part.type === 'field' ? part.value : 'file');
                if (!(part.type === 'field')) return [3 /*break*/, 4];
                if (part.fieldname === 'name')
                    data.name = part.value;
                if (part.fieldname === 'description')
                    data.description = part.value;
                if (part.fieldname === 'active')
                    data.active = part.value === 'true';
                if (part.fieldname === 'image')
                    data.image = part.value;
                return [3 /*break*/, 6];
            case 4:
                if (!(part.type === 'file')) return [3 /*break*/, 6];
                if (!(part.fieldname === 'imageFile')) return [3 /*break*/, 6];
                return [4 /*yield*/, uploadHandler_1.default.saveFileFromPart(part, request, 'GENRE')];
            case 5:
                uploadedFile = _g.sent();
                data.image = uploadedFile.filePath;
                _g.label = 6;
            case 6:
                _a = true;
                return [3 /*break*/, 2];
            case 7: return [3 /*break*/, 14];
            case 8:
                e_1_1 = _g.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 14];
            case 9:
                _g.trys.push([9, , 12, 13]);
                if (!(!_a && !_d && (_e = _b.return))) return [3 /*break*/, 11];
                return [4 /*yield*/, _e.call(_b)];
            case 10:
                _g.sent();
                _g.label = 11;
            case 11: return [3 /*break*/, 13];
            case 12:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 13: return [7 /*endfinally*/];
            case 14:
                console.log('readGenreMultipart returning data:', data);
                return [2 /*return*/, data];
        }
    });
}); };
var Content_1 = require("../models/Content");
var Movie_1 = require("../models/Movie");
var listGenres = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var query, page, limit, isAdminView, filter, _a, activeMovieGenres, activeContentGenres, activeGenreIds, _b, genres, total, error_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 4, , 5]);
                query = request.query;
                page = Math.max(1, parseInt(query.page || '1', 10));
                limit = Math.min(100, Math.max(1, parseInt(query.limit || '20', 10)));
                isAdminView = query.admin === 'true';
                filter = isAdminView ? {} : { active: true };
                if (!!isAdminView) return [3 /*break*/, 2];
                return [4 /*yield*/, Promise.all([
                        Movie_1.MovieModel.distinct('genres', { status: 'published' }),
                        Content_1.ContentModel.distinct('genres', { status: 'published' })
                    ])];
            case 1:
                _a = _c.sent(), activeMovieGenres = _a[0], activeContentGenres = _a[1];
                activeGenreIds = __spreadArray([], new Set(__spreadArray(__spreadArray([], activeMovieGenres, true), activeContentGenres, true).map(function (id) { return id === null || id === void 0 ? void 0 : id.toString(); }).filter(Boolean)), true);
                filter._id = { $in: activeGenreIds };
                _c.label = 2;
            case 2: return [4 /*yield*/, Promise.all([
                    Genre_1.GenreModel.find(filter)
                        .sort({ createdAt: -1 })
                        .skip((page - 1) * limit)
                        .limit(limit)
                        .lean(),
                    Genre_1.GenreModel.countDocuments(filter),
                ])];
            case 3:
                _b = _c.sent(), genres = _b[0], total = _b[1];
                return [2 /*return*/, reply.send({
                        success: true,
                        data: genres.map(function (genre) { return ({
                            id: genre._id,
                            name: genre.name,
                            description: genre.description,
                            image: genre.image,
                            active: genre.active,
                            createdAt: genre.createdAt,
                            updatedAt: genre.updatedAt,
                        }); }),
                        pagination: {
                            page: page,
                            limit: limit,
                            total: total,
                            pages: Math.ceil(total / limit),
                        },
                    })];
            case 4:
                error_1 = _c.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_1.message })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.listGenres = listGenres;
var getGenreById = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var genreId, genre, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                genreId = request.params.genreId;
                return [4 /*yield*/, Genre_1.GenreModel.findById(genreId).lean()];
            case 1:
                genre = _a.sent();
                if (!genre) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Genre not found' })];
                }
                return [2 /*return*/, reply.send({
                        success: true,
                        data: {
                            id: genre._id,
                            name: genre.name,
                            description: genre.description,
                            image: genre.image,
                            active: genre.active,
                            createdAt: genre.createdAt,
                            updatedAt: genre.updatedAt,
                        },
                    })];
            case 2:
                error_2 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_2.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getGenreById = getGenreById;
var createGenre = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var data, genre, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, readGenreMultipart(request)];
            case 1:
                data = _a.sent();
                if (!data.name) {
                    return [2 /*return*/, reply.status(400).send({ success: false, error: 'Name is required' })];
                }
                return [4 /*yield*/, Genre_1.GenreModel.create({
                        name: data.name,
                        description: data.description,
                        image: data.image,
                        active: data.active !== undefined ? data.active : true,
                    })];
            case 2:
                genre = _a.sent();
                return [2 /*return*/, reply.status(201).send({
                        success: true,
                        data: {
                            id: genre._id,
                            name: genre.name,
                            description: genre.description,
                            image: genre.image,
                            active: genre.active,
                            createdAt: genre.createdAt,
                            updatedAt: genre.updatedAt,
                        },
                    })];
            case 3:
                error_3 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_3.message })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.createGenre = createGenre;
var updateGenre = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var genreId, data, existingGenre, genre, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                genreId = request.params.genreId;
                return [4 /*yield*/, readGenreMultipart(request)];
            case 1:
                data = _a.sent();
                return [4 /*yield*/, Genre_1.GenreModel.findById(genreId)];
            case 2:
                existingGenre = _a.sent();
                if (!existingGenre) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Genre not found' })];
                }
                if (data.image && existingGenre.image) {
                    uploadHandler_1.default.deleteUploadedFile(existingGenre.image);
                }
                return [4 /*yield*/, Genre_1.GenreModel.findByIdAndUpdate(genreId, { $set: data }, { returnDocument: 'after', runValidators: true }).lean()];
            case 3:
                genre = _a.sent();
                return [2 /*return*/, reply.send({
                        success: true,
                        data: {
                            id: genre._id,
                            name: genre.name,
                            description: genre.description,
                            image: genre.image,
                            active: genre.active,
                            createdAt: genre.createdAt,
                            updatedAt: genre.updatedAt,
                        },
                    })];
            case 4:
                error_4 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_4.message })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.updateGenre = updateGenre;
var deleteGenre = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var genreId, genre, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                genreId = request.params.genreId;
                return [4 /*yield*/, Genre_1.GenreModel.findByIdAndDelete(genreId)];
            case 1:
                genre = _a.sent();
                if (!genre) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Genre not found' })];
                }
                if (genre.image) {
                    uploadHandler_1.default.deleteUploadedFile(genre.image);
                }
                return [2 /*return*/, reply.send({
                        success: true,
                        message: 'Genre deleted successfully',
                    })];
            case 2:
                error_5 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_5.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteGenre = deleteGenre;
var bulkDeleteGenres = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var ids, genres, _i, genres_1, genre, result, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                ids = request.body.ids;
                if (!Array.isArray(ids) || ids.length === 0) {
                    return [2 /*return*/, reply.status(400).send({ success: false, message: 'Invalid or empty ids array' })];
                }
                return [4 /*yield*/, Genre_1.GenreModel.find({ _id: { $in: ids } }).lean()];
            case 1:
                genres = _a.sent();
                for (_i = 0, genres_1 = genres; _i < genres_1.length; _i++) {
                    genre = genres_1[_i];
                    if (genre.image) {
                        uploadHandler_1.default.deleteUploadedFile(genre.image);
                    }
                }
                return [4 /*yield*/, Genre_1.GenreModel.deleteMany({ _id: { $in: ids } })];
            case 2:
                result = _a.sent();
                return [2 /*return*/, reply.send({
                        success: true,
                        message: "".concat(result.deletedCount, " genres deleted successfully"),
                        deletedCount: result.deletedCount,
                    })];
            case 3:
                error_6 = _a.sent();
                console.error('Error bulk deleting genres:', error_6);
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error', error: error_6.message })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.bulkDeleteGenres = bulkDeleteGenres;
