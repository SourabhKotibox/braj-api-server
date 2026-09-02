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
exports.deleteLanguage = exports.updateLanguage = exports.createLanguage = exports.getLanguage = exports.listLanguages = void 0;
var Language_1 = require("../models/Language");
var uploadHandler_1 = __importDefault(require("../lib/uploadHandler"));
// Helper function to get full image URL
function getImageUrl(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var rel;
        return __generator(this, function (_a) {
            if (!filePath)
                return [2 /*return*/, null];
            if (filePath.startsWith('http'))
                return [2 /*return*/, filePath];
            rel = filePath;
            if (!rel.startsWith('/uploads/')) {
                rel = rel.startsWith('uploads/') ? "/".concat(rel) : "/uploads/".concat(rel.replace(/^\//, ''));
            }
            return [2 /*return*/, rel];
        });
    });
}
var listLanguages = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var query, includeSkip, languages, filteredLanguages, data, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                query = request.query;
                includeSkip = query.includeSkip === 'true';
                return [4 /*yield*/, Language_1.LanguageModel.find({ isActive: true }).sort({ order: 1, createdAt: -1 }).lean()];
            case 1:
                languages = _a.sent();
                return [4 /*yield*/, Promise.all(languages.map(function (lang) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {
                                        id: lang._id.toString(),
                                        name: lang.name,
                                        code: lang.code
                                    };
                                    return [4 /*yield*/, getImageUrl(lang.image)];
                                case 1: return [2 /*return*/, (_a.image = _b.sent(),
                                        _a.isActive = lang.isActive,
                                        _a.order = lang.order,
                                        _a.createdAt = lang.createdAt,
                                        _a.updatedAt = lang.updatedAt,
                                        _a)];
                            }
                        });
                    }); }))];
            case 2:
                filteredLanguages = _a.sent();
                data = includeSkip
                    ? __spreadArray([
                        {
                            id: 'skip',
                            name: 'Skip',
                            code: 'skip',
                            image: null,
                            isActive: true,
                            order: -1,
                            createdAt: null,
                            updatedAt: null,
                            isSkippable: true,
                        }
                    ], filteredLanguages, true) : filteredLanguages;
                return [2 /*return*/, {
                        success: true,
                        data: data
                    }];
            case 3:
                error_1 = _a.sent();
                console.error('Error in listLanguages:', error_1);
                return [2 /*return*/, reply.status(500).send({
                        success: false,
                        message: 'Internal server error',
                        error: error_1.message
                    })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.listLanguages = listLanguages;
var getLanguage = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, language, error_2;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                id = request.params.id;
                return [4 /*yield*/, Language_1.LanguageModel.findById(id).lean()];
            case 1:
                language = _c.sent();
                if (!language) {
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'Language not found' })];
                }
                _a = {
                    success: true
                };
                _b = {
                    id: language._id.toString(),
                    name: language.name,
                    code: language.code
                };
                return [4 /*yield*/, getImageUrl(language.image)];
            case 2: return [2 /*return*/, (_a.data = (_b.image = _c.sent(),
                    _b.isActive = language.isActive,
                    _b.order = language.order,
                    _b.createdAt = language.createdAt,
                    _b.updatedAt = language.updatedAt,
                    _b),
                    _a)];
            case 3:
                error_2 = _c.sent();
                console.error('Error getting language:', error_2);
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error' })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getLanguage = getLanguage;
var createLanguage = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var parts, name_1, code, imagePath, _a, parts_1, parts_1_1, part, uploadedFile, e_1_1, language, _b, _c, error_3;
    var _d, _e;
    var _f, e_1, _g, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                _j.trys.push([0, 17, , 18]);
                parts = request.parts();
                code = void 0;
                imagePath = void 0;
                _j.label = 1;
            case 1:
                _j.trys.push([1, 8, 9, 14]);
                _a = true, parts_1 = __asyncValues(parts);
                _j.label = 2;
            case 2: return [4 /*yield*/, parts_1.next()];
            case 3:
                if (!(parts_1_1 = _j.sent(), _f = parts_1_1.done, !_f)) return [3 /*break*/, 7];
                _h = parts_1_1.value;
                _a = false;
                part = _h;
                if (!(part.type === 'field')) return [3 /*break*/, 4];
                if (part.fieldname === 'name')
                    name_1 = part.value;
                if (part.fieldname === 'code')
                    code = part.value;
                if (part.fieldname === 'image')
                    imagePath = part.value;
                return [3 /*break*/, 6];
            case 4:
                if (!(part.type === 'file')) return [3 /*break*/, 6];
                return [4 /*yield*/, uploadHandler_1.default.saveFileFromPart(part, request, 'LANGUAGE')];
            case 5:
                uploadedFile = _j.sent();
                imagePath = uploadedFile.filePath;
                _j.label = 6;
            case 6:
                _a = true;
                return [3 /*break*/, 2];
            case 7: return [3 /*break*/, 14];
            case 8:
                e_1_1 = _j.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 14];
            case 9:
                _j.trys.push([9, , 12, 13]);
                if (!(!_a && !_f && (_g = parts_1.return))) return [3 /*break*/, 11];
                return [4 /*yield*/, _g.call(parts_1)];
            case 10:
                _j.sent();
                _j.label = 11;
            case 11: return [3 /*break*/, 13];
            case 12:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 13: return [7 /*endfinally*/];
            case 14:
                if (!name_1 || !code) {
                    return [2 /*return*/, reply.status(400).send({
                            success: false,
                            message: 'Name and code are required'
                        })];
                }
                language = new Language_1.LanguageModel({ name: name_1, code: code, image: imagePath });
                return [4 /*yield*/, language.save()];
            case 15:
                _j.sent();
                _c = (_b = reply.status(201)).send;
                _d = {
                    success: true
                };
                _e = {
                    id: language._id.toString(),
                    name: language.name,
                    code: language.code
                };
                return [4 /*yield*/, getImageUrl(language.image)];
            case 16: return [2 /*return*/, _c.apply(_b, [(_d.data = (_e.image = _j.sent(),
                        _e.isActive = language.isActive,
                        _e.order = language.order,
                        _e),
                        _d)])];
            case 17:
                error_3 = _j.sent();
                console.error('Error creating language:', error_3.message, error_3.stack);
                return [2 /*return*/, reply.status(500).send({
                        success: false,
                        message: 'Internal server error',
                        error: error_3.message
                    })];
            case 18: return [2 /*return*/];
        }
    });
}); };
exports.createLanguage = createLanguage;
var updateLanguage = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, parts, updateData, oldImage, existingLang, _a, parts_2, parts_2_1, part, uploadedFile, e_2_1, language, error_4;
    var _b, _c;
    var _d, e_2, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                _g.trys.push([0, 18, , 19]);
                id = request.params.id;
                parts = request.parts();
                updateData = {};
                oldImage = void 0;
                return [4 /*yield*/, Language_1.LanguageModel.findById(id)];
            case 1:
                existingLang = _g.sent();
                if (!existingLang) {
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'Language not found' })];
                }
                oldImage = existingLang.image;
                _g.label = 2;
            case 2:
                _g.trys.push([2, 9, 10, 15]);
                _a = true, parts_2 = __asyncValues(parts);
                _g.label = 3;
            case 3: return [4 /*yield*/, parts_2.next()];
            case 4:
                if (!(parts_2_1 = _g.sent(), _d = parts_2_1.done, !_d)) return [3 /*break*/, 8];
                _f = parts_2_1.value;
                _a = false;
                part = _f;
                if (!(part.type === 'field')) return [3 /*break*/, 5];
                if (part.fieldname === 'name')
                    updateData.name = part.value;
                if (part.fieldname === 'code')
                    updateData.code = part.value;
                if (part.fieldname === 'isActive')
                    updateData.isActive = part.value === 'true';
                if (part.fieldname === 'order')
                    updateData.order = parseInt(part.value);
                if (part.fieldname === 'image')
                    updateData.image = part.value;
                return [3 /*break*/, 7];
            case 5:
                if (!(part.type === 'file')) return [3 /*break*/, 7];
                return [4 /*yield*/, uploadHandler_1.default.saveFileFromPart(part, request, 'LANGUAGE')];
            case 6:
                uploadedFile = _g.sent();
                updateData.image = uploadedFile.filePath;
                // Delete old image if it exists
                if (oldImage) {
                    uploadHandler_1.default.deleteUploadedFile(oldImage);
                }
                _g.label = 7;
            case 7:
                _a = true;
                return [3 /*break*/, 3];
            case 8: return [3 /*break*/, 15];
            case 9:
                e_2_1 = _g.sent();
                e_2 = { error: e_2_1 };
                return [3 /*break*/, 15];
            case 10:
                _g.trys.push([10, , 13, 14]);
                if (!(!_a && !_d && (_e = parts_2.return))) return [3 /*break*/, 12];
                return [4 /*yield*/, _e.call(parts_2)];
            case 11:
                _g.sent();
                _g.label = 12;
            case 12: return [3 /*break*/, 14];
            case 13:
                if (e_2) throw e_2.error;
                return [7 /*endfinally*/];
            case 14: return [7 /*endfinally*/];
            case 15: return [4 /*yield*/, Language_1.LanguageModel.findByIdAndUpdate(id, { $set: updateData }, { returnDocument: 'after' }).lean()];
            case 16:
                language = _g.sent();
                if (!language) {
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'Language not found' })];
                }
                _b = {
                    success: true
                };
                _c = {
                    id: language._id.toString(),
                    name: language.name,
                    code: language.code
                };
                return [4 /*yield*/, getImageUrl(language.image)];
            case 17: return [2 /*return*/, (_b.data = (_c.image = _g.sent(),
                    _c.isActive = language.isActive,
                    _c.order = language.order,
                    _c),
                    _b)];
            case 18:
                error_4 = _g.sent();
                console.error('Error updating language:', error_4);
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error' })];
            case 19: return [2 /*return*/];
        }
    });
}); };
exports.updateLanguage = updateLanguage;
var deleteLanguage = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, language, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id = request.params.id;
                return [4 /*yield*/, Language_1.LanguageModel.findById(id)];
            case 1:
                language = _a.sent();
                if (!language) {
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'Language not found' })];
                }
                // Delete image file if it exists
                if (language.image) {
                    uploadHandler_1.default.deleteUploadedFile(language.image);
                }
                return [4 /*yield*/, Language_1.LanguageModel.findByIdAndDelete(id)];
            case 2:
                _a.sent();
                return [2 /*return*/, reply.status(200).send({
                        success: true,
                        message: 'Language deleted successfully'
                    })];
            case 3:
                error_5 = _a.sent();
                console.error('Error deleting language:', error_5);
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error' })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteLanguage = deleteLanguage;
