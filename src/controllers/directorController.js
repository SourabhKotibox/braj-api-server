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
exports.bulkDeleteDirectors = exports.deleteDirector = exports.updateDirector = exports.createDirector = exports.getDirectorById = exports.listDirectors = void 0;
var Director_1 = require("../models/Director");
var uploadHandler_1 = __importDefault(require("../lib/uploadHandler"));
var readDirectorMultipart = function (request) { return __awaiter(void 0, void 0, void 0, function () {
    var parts, data, _a, parts_1, parts_1_1, part, uploadedFile, e_1_1;
    var _b, e_1, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                parts = request.parts();
                data = {};
                _e.label = 1;
            case 1:
                _e.trys.push([1, 8, 9, 14]);
                _a = true, parts_1 = __asyncValues(parts);
                _e.label = 2;
            case 2: return [4 /*yield*/, parts_1.next()];
            case 3:
                if (!(parts_1_1 = _e.sent(), _b = parts_1_1.done, !_b)) return [3 /*break*/, 7];
                _d = parts_1_1.value;
                _a = false;
                part = _d;
                if (!(part.type === 'field')) return [3 /*break*/, 4];
                if (part.fieldname === 'name')
                    data.name = part.value;
                if (part.fieldname === 'designation')
                    data.designation = part.value;
                if (part.fieldname === 'dateOfBirth')
                    data.dateOfBirth = part.value;
                if (part.fieldname === 'birthPlace')
                    data.birthPlace = part.value;
                if (part.fieldname === 'status')
                    data.status = part.value === 'true';
                if (part.fieldname === 'image')
                    data.image = part.value;
                return [3 /*break*/, 6];
            case 4:
                if (!(part.type === 'file' && part.fieldname === 'imageFile')) return [3 /*break*/, 6];
                return [4 /*yield*/, uploadHandler_1.default.saveFileFromPart(part, request, 'DIRECTOR')];
            case 5:
                uploadedFile = _e.sent();
                data.image = uploadedFile.filePath;
                _e.label = 6;
            case 6:
                _a = true;
                return [3 /*break*/, 2];
            case 7: return [3 /*break*/, 14];
            case 8:
                e_1_1 = _e.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 14];
            case 9:
                _e.trys.push([9, , 12, 13]);
                if (!(!_a && !_b && (_c = parts_1.return))) return [3 /*break*/, 11];
                return [4 /*yield*/, _c.call(parts_1)];
            case 10:
                _e.sent();
                _e.label = 11;
            case 11: return [3 /*break*/, 13];
            case 12:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 13: return [7 /*endfinally*/];
            case 14: return [2 /*return*/, data];
        }
    });
}); };
var listDirectors = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var query, page, limit, isAdminView, filter, _a, directors, total, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                query = request.query;
                page = Math.max(1, parseInt(query.page || '1', 10));
                limit = Math.min(100, Math.max(1, parseInt(query.limit || '20', 10)));
                isAdminView = query.admin === 'true';
                filter = isAdminView ? {} : { status: true };
                return [4 /*yield*/, Promise.all([
                        Director_1.DirectorModel.find(filter)
                            .sort({ createdAt: -1 })
                            .skip((page - 1) * limit)
                            .limit(limit)
                            .lean(),
                        Director_1.DirectorModel.countDocuments(filter),
                    ])];
            case 1:
                _a = _b.sent(), directors = _a[0], total = _a[1];
                return [2 /*return*/, reply.send({
                        success: true,
                        data: directors.map(function (director) { return ({
                            id: director._id,
                            name: director.name,
                            designation: director.designation,
                            image: director.image,
                            dateOfBirth: director.dateOfBirth,
                            birthPlace: director.birthPlace,
                            status: director.status,
                            createdAt: director.createdAt,
                            updatedAt: director.updatedAt,
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
exports.listDirectors = listDirectors;
var getDirectorById = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var directorId, director, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                directorId = request.params.directorId;
                return [4 /*yield*/, Director_1.DirectorModel.findById(directorId).lean()];
            case 1:
                director = _a.sent();
                if (!director) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Director not found' })];
                }
                return [2 /*return*/, reply.send({
                        success: true,
                        data: {
                            id: director._id,
                            name: director.name,
                            designation: director.designation,
                            image: director.image,
                            dateOfBirth: director.dateOfBirth,
                            birthPlace: director.birthPlace,
                            status: director.status,
                            createdAt: director.createdAt,
                            updatedAt: director.updatedAt,
                        },
                    })];
            case 2:
                error_2 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_2.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getDirectorById = getDirectorById;
var createDirector = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var data, director, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, readDirectorMultipart(request)];
            case 1:
                data = _a.sent();
                if (!data.name || !data.designation) {
                    return [2 /*return*/, reply.status(400).send({ success: false, error: 'Name and designation are required' })];
                }
                return [4 /*yield*/, Director_1.DirectorModel.create({
                        name: data.name,
                        designation: data.designation,
                        image: data.image,
                        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
                        birthPlace: data.birthPlace,
                        status: data.status !== undefined ? data.status : true,
                    })];
            case 2:
                director = _a.sent();
                return [2 /*return*/, reply.status(201).send({
                        success: true,
                        data: {
                            id: director._id,
                            name: director.name,
                            designation: director.designation,
                            image: director.image,
                            dateOfBirth: director.dateOfBirth,
                            birthPlace: director.birthPlace,
                            status: director.status,
                            createdAt: director.createdAt,
                            updatedAt: director.updatedAt,
                        },
                    })];
            case 3:
                error_3 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_3.message })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.createDirector = createDirector;
var updateDirector = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var directorId, data, existingDirector, updateData, director, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                directorId = request.params.directorId;
                return [4 /*yield*/, readDirectorMultipart(request)];
            case 1:
                data = _a.sent();
                return [4 /*yield*/, Director_1.DirectorModel.findById(directorId)];
            case 2:
                existingDirector = _a.sent();
                if (!existingDirector) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Director not found' })];
                }
                if (data.image && existingDirector.image) {
                    uploadHandler_1.default.deleteUploadedFile(existingDirector.image);
                }
                updateData = {};
                if (data.name)
                    updateData.name = data.name;
                if (data.designation)
                    updateData.designation = data.designation;
                if (data.image)
                    updateData.image = data.image;
                if (data.dateOfBirth)
                    updateData.dateOfBirth = new Date(data.dateOfBirth);
                if (data.birthPlace)
                    updateData.birthPlace = data.birthPlace;
                if (data.status !== undefined)
                    updateData.status = data.status;
                return [4 /*yield*/, Director_1.DirectorModel.findByIdAndUpdate(directorId, { $set: updateData }, { returnDocument: 'after', runValidators: true }).lean()];
            case 3:
                director = _a.sent();
                return [2 /*return*/, reply.send({
                        success: true,
                        data: {
                            id: director._id,
                            name: director.name,
                            designation: director.designation,
                            image: director.image,
                            dateOfBirth: director.dateOfBirth,
                            birthPlace: director.birthPlace,
                            status: director.status,
                            createdAt: director.createdAt,
                            updatedAt: director.updatedAt,
                        },
                    })];
            case 4:
                error_4 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_4.message })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.updateDirector = updateDirector;
var deleteDirector = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var directorId, director, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                directorId = request.params.directorId;
                return [4 /*yield*/, Director_1.DirectorModel.findByIdAndDelete(directorId)];
            case 1:
                director = _a.sent();
                if (!director) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Director not found' })];
                }
                if (director.image) {
                    uploadHandler_1.default.deleteUploadedFile(director.image);
                }
                return [2 /*return*/, reply.send({
                        success: true,
                        message: 'Director deleted successfully',
                    })];
            case 2:
                error_5 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_5.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteDirector = deleteDirector;
var bulkDeleteDirectors = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var ids, directors, result, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                ids = request.body.ids;
                if (!Array.isArray(ids) || ids.length === 0) {
                    return [2 /*return*/, reply.status(400).send({ success: false, message: 'Invalid or empty ids array' })];
                }
                return [4 /*yield*/, Director_1.DirectorModel.find({ _id: { $in: ids } })];
            case 1:
                directors = _a.sent();
                // Delete files associated with directors
                directors.forEach(function (director) {
                    if (director.image)
                        uploadHandler_1.default.deleteUploadedFile(director.image);
                });
                return [4 /*yield*/, Director_1.DirectorModel.deleteMany({ _id: { $in: ids } })];
            case 2:
                result = _a.sent();
                return [2 /*return*/, {
                        success: true,
                        message: "".concat(result.deletedCount, " directors deleted successfully"),
                        deletedCount: result.deletedCount,
                    }];
            case 3:
                error_6 = _a.sent();
                console.error('Error bulk deleting directors:', error_6);
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error', error: error_6.message })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.bulkDeleteDirectors = bulkDeleteDirectors;
