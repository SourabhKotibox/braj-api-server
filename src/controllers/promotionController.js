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
exports.bulkDeletePromotions = exports.deletePromotion = exports.updatePromotion = exports.createPromotion = exports.getActivePromotion = exports.getPromotion = exports.listPromotions = void 0;
var Promotion_1 = require("../models/Promotion");
var uploadHandler_1 = __importDefault(require("../lib/uploadHandler"));
var listPromotions = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var q, page, limit, total, defaultPromotion, promotions, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                q = request.query;
                page = Math.max(1, parseInt(q.page || '1'));
                limit = Math.min(100, Math.max(1, parseInt(q.limit || '20')));
                return [4 /*yield*/, Promotion_1.PromotionModel.countDocuments()];
            case 1:
                total = _a.sent();
                if (!(total === 0)) return [3 /*break*/, 3];
                defaultPromotion = new Promotion_1.PromotionModel({
                    title: 'Start Trial for ₹99',
                    subtitle: '₹1',
                    videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=450&fit=crop&q=80',
                    features: [
                        {
                            icon: 'lock',
                            title: 'Start your Trial Plan',
                            description: 'Pay ₹1 and unlock all dramas',
                        },
                        {
                            icon: 'star',
                            title: 'Watch new dramas for 2 days',
                            description: 'Romance, revenge and much more',
                        },
                        {
                            icon: 'calendar',
                            title: 'Notified before autopay',
                            description: 'Pay ₹399/1 month after 2 days',
                        }
                    ],
                    buttonText: 'Start Trial',
                    secondaryButtonText: 'Cancel the plan anytime',
                    isActive: true,
                    order: 0,
                });
                return [4 /*yield*/, defaultPromotion.save()];
            case 2:
                _a.sent();
                total = 1;
                _a.label = 3;
            case 3: return [4 /*yield*/, Promotion_1.PromotionModel.find()
                    .sort({ order: 1, createdAt: -1 })
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .lean()];
            case 4:
                promotions = _a.sent();
                return [2 /*return*/, {
                        success: true,
                        data: promotions.map(function (p) { return ({
                            id: p._id.toString(),
                            title: p.title,
                            subtitle: p.subtitle,
                            videoUrl: p.videoUrl,
                            thumbnailUrl: p.thumbnailUrl,
                            features: p.features,
                            buttonText: p.buttonText,
                            secondaryButtonText: p.secondaryButtonText,
                            isActive: p.isActive,
                            order: p.order,
                        }); }),
                        pagination: {
                            page: page,
                            limit: limit,
                            total: total,
                            pages: Math.ceil(total / limit),
                        },
                    }];
            case 5:
                error_1 = _a.sent();
                console.error(error_1);
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error' })];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.listPromotions = listPromotions;
var getPromotion = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, promotion, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = request.params.id;
                return [4 /*yield*/, Promotion_1.PromotionModel.findById(id).lean()];
            case 1:
                promotion = _a.sent();
                if (!promotion) {
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'Promotion not found' })];
                }
                return [2 /*return*/, {
                        success: true,
                        data: {
                            id: promotion._id.toString(),
                            title: promotion.title,
                            subtitle: promotion.subtitle,
                            videoUrl: promotion.videoUrl,
                            thumbnailUrl: promotion.thumbnailUrl,
                            features: promotion.features,
                            buttonText: promotion.buttonText,
                            secondaryButtonText: promotion.secondaryButtonText,
                            isActive: promotion.isActive,
                            order: promotion.order,
                        },
                    }];
            case 2:
                error_2 = _a.sent();
                console.error(error_2);
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error' })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getPromotion = getPromotion;
var getActivePromotion = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var promotion, count, defaultPromotion, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4 /*yield*/, Promotion_1.PromotionModel.findOne({ isActive: true }).sort({ order: 1, createdAt: -1 }).lean()];
            case 1:
                promotion = _a.sent();
                if (!!promotion) return [3 /*break*/, 4];
                return [4 /*yield*/, Promotion_1.PromotionModel.countDocuments()];
            case 2:
                count = _a.sent();
                if (!(count === 0)) return [3 /*break*/, 4];
                defaultPromotion = new Promotion_1.PromotionModel({
                    title: 'Start Trial for ₹99',
                    subtitle: '₹1',
                    videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=450&fit=crop&q=80',
                    features: [
                        {
                            icon: 'lock',
                            title: 'Start your Trial Plan',
                            description: 'Pay ₹1 and unlock all dramas',
                        },
                        {
                            icon: 'star',
                            title: 'Watch new dramas for 2 days',
                            description: 'Romance, revenge and much more',
                        },
                        {
                            icon: 'calendar',
                            title: 'Notified before autopay',
                            description: 'Pay ₹399/1 month after 2 days',
                        }
                    ],
                    buttonText: 'Start Trial',
                    secondaryButtonText: 'Cancel the plan anytime',
                    isActive: true,
                    order: 0,
                });
                return [4 /*yield*/, defaultPromotion.save()];
            case 3:
                _a.sent();
                promotion = defaultPromotion.toObject();
                _a.label = 4;
            case 4:
                if (!promotion) {
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'No active promotion found' })];
                }
                return [2 /*return*/, {
                        success: true,
                        data: {
                            id: promotion._id.toString(),
                            title: promotion.title,
                            subtitle: promotion.subtitle,
                            videoUrl: promotion.videoUrl,
                            thumbnailUrl: promotion.thumbnailUrl,
                            features: promotion.features,
                            buttonText: promotion.buttonText,
                            secondaryButtonText: promotion.secondaryButtonText,
                            isActive: promotion.isActive,
                            order: promotion.order,
                        },
                    }];
            case 5:
                error_3 = _a.sent();
                console.error(error_3);
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error' })];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.getActivePromotion = getActivePromotion;
var createPromotion = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var parts, data, _a, parts_1, parts_1_1, part, match, index, field, uploadedFile, uploadedFile, e_1_1, promotion, error_4;
    var _b, e_1, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 18, , 19]);
                parts = request.parts();
                data = {
                    features: [],
                };
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
                if (part.fieldname === 'title')
                    data.title = part.value;
                if (part.fieldname === 'subtitle')
                    data.subtitle = part.value;
                if (part.fieldname === 'videoUrl')
                    data.videoUrl = part.value;
                if (part.fieldname === 'thumbnailUrl')
                    data.thumbnailUrl = part.value;
                if (part.fieldname === 'buttonText')
                    data.buttonText = part.value;
                if (part.fieldname === 'secondaryButtonText')
                    data.secondaryButtonText = part.value;
                if (part.fieldname === 'isActive')
                    data.isActive = part.value === 'true';
                if (part.fieldname === 'order')
                    data.order = parseInt(part.value);
                if (part.fieldname.startsWith('features[')) {
                    match = part.fieldname.match(/features\[(\d+)\]\[(\w+)\]/);
                    if (match) {
                        index = parseInt(match[1]);
                        field = match[2];
                        if (!data.features[index]) {
                            data.features[index] = {};
                        }
                        data.features[index][field] = part.value;
                    }
                }
                return [3 /*break*/, 8];
            case 4:
                if (!(part.type === 'file')) return [3 /*break*/, 8];
                if (!(part.fieldname === 'thumbnailFile')) return [3 /*break*/, 6];
                return [4 /*yield*/, uploadHandler_1.default.saveFileFromPart(part, request, 'PROMOTION')];
            case 5:
                uploadedFile = _e.sent();
                data.thumbnailUrl = uploadedFile.filePath;
                return [3 /*break*/, 8];
            case 6:
                if (!(part.fieldname === 'videoFile')) return [3 /*break*/, 8];
                return [4 /*yield*/, uploadHandler_1.default.saveFileFromPart(part, request, 'VIDEO')];
            case 7:
                uploadedFile = _e.sent();
                data.videoUrl = uploadedFile.filePath;
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
            case 16:
                data.features = data.features.filter(Boolean);
                promotion = new Promotion_1.PromotionModel(data);
                return [4 /*yield*/, promotion.save()];
            case 17:
                _e.sent();
                return [2 /*return*/, reply.status(201).send({
                        success: true,
                        data: {
                            id: promotion._id.toString(),
                            title: promotion.title,
                            subtitle: promotion.subtitle,
                            videoUrl: promotion.videoUrl,
                            thumbnailUrl: promotion.thumbnailUrl,
                            features: promotion.features,
                            buttonText: promotion.buttonText,
                            secondaryButtonText: promotion.secondaryButtonText,
                            isActive: promotion.isActive,
                            order: promotion.order,
                        },
                    })];
            case 18:
                error_4 = _e.sent();
                console.error('Error creating promotion:', error_4);
                return [2 /*return*/, reply.status(500).send({
                        success: false,
                        message: 'Internal server error',
                        error: error_4.message,
                    })];
            case 19: return [2 /*return*/];
        }
    });
}); };
exports.createPromotion = createPromotion;
var updatePromotion = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, existingPromotion, parts, data, _a, parts_2, parts_2_1, part, match, index, field, uploadedFile, uploadedFile, e_2_1, promotion, error_5;
    var _b, e_2, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 19, , 20]);
                id = request.params.id;
                return [4 /*yield*/, Promotion_1.PromotionModel.findById(id)];
            case 1:
                existingPromotion = _e.sent();
                if (!existingPromotion) {
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'Promotion not found' })];
                }
                parts = request.parts();
                data = {};
                _e.label = 2;
            case 2:
                _e.trys.push([2, 11, 12, 17]);
                _a = true, parts_2 = __asyncValues(parts);
                _e.label = 3;
            case 3: return [4 /*yield*/, parts_2.next()];
            case 4:
                if (!(parts_2_1 = _e.sent(), _b = parts_2_1.done, !_b)) return [3 /*break*/, 10];
                _d = parts_2_1.value;
                _a = false;
                part = _d;
                if (!(part.type === 'field')) return [3 /*break*/, 5];
                if (part.fieldname === 'title')
                    data.title = part.value;
                if (part.fieldname === 'subtitle')
                    data.subtitle = part.value;
                if (part.fieldname === 'videoUrl')
                    data.videoUrl = part.value;
                if (part.fieldname === 'thumbnailUrl')
                    data.thumbnailUrl = part.value;
                if (part.fieldname === 'buttonText')
                    data.buttonText = part.value;
                if (part.fieldname === 'secondaryButtonText')
                    data.secondaryButtonText = part.value;
                if (part.fieldname === 'isActive')
                    data.isActive = part.value === 'true';
                if (part.fieldname === 'order')
                    data.order = parseInt(part.value);
                if (part.fieldname.startsWith('features[')) {
                    if (!data.features)
                        data.features = [];
                    match = part.fieldname.match(/features\[(\d+)\]\[(\w+)\]/);
                    if (match) {
                        index = parseInt(match[1]);
                        field = match[2];
                        if (!data.features[index]) {
                            data.features[index] = {};
                        }
                        data.features[index][field] = part.value;
                    }
                }
                return [3 /*break*/, 9];
            case 5:
                if (!(part.type === 'file')) return [3 /*break*/, 9];
                if (!(part.fieldname === 'thumbnailFile')) return [3 /*break*/, 7];
                return [4 /*yield*/, uploadHandler_1.default.saveFileFromPart(part, request, 'PROMOTION')];
            case 6:
                uploadedFile = _e.sent();
                uploadHandler_1.default.deleteUploadedFile(existingPromotion.thumbnailUrl);
                data.thumbnailUrl = uploadedFile.filePath;
                return [3 /*break*/, 9];
            case 7:
                if (!(part.fieldname === 'videoFile')) return [3 /*break*/, 9];
                return [4 /*yield*/, uploadHandler_1.default.saveFileFromPart(part, request, 'VIDEO')];
            case 8:
                uploadedFile = _e.sent();
                uploadHandler_1.default.deleteUploadedFile(existingPromotion.videoUrl);
                data.videoUrl = uploadedFile.filePath;
                _e.label = 9;
            case 9:
                _a = true;
                return [3 /*break*/, 3];
            case 10: return [3 /*break*/, 17];
            case 11:
                e_2_1 = _e.sent();
                e_2 = { error: e_2_1 };
                return [3 /*break*/, 17];
            case 12:
                _e.trys.push([12, , 15, 16]);
                if (!(!_a && !_b && (_c = parts_2.return))) return [3 /*break*/, 14];
                return [4 /*yield*/, _c.call(parts_2)];
            case 13:
                _e.sent();
                _e.label = 14;
            case 14: return [3 /*break*/, 16];
            case 15:
                if (e_2) throw e_2.error;
                return [7 /*endfinally*/];
            case 16: return [7 /*endfinally*/];
            case 17:
                if (data.features) {
                    data.features = data.features.filter(Boolean);
                }
                return [4 /*yield*/, Promotion_1.PromotionModel.findByIdAndUpdate(id, { $set: data }, { returnDocument: 'after' }).lean()];
            case 18:
                promotion = _e.sent();
                return [2 /*return*/, {
                        success: true,
                        data: {
                            id: promotion._id.toString(),
                            title: promotion.title,
                            subtitle: promotion.subtitle,
                            videoUrl: promotion.videoUrl,
                            thumbnailUrl: promotion.thumbnailUrl,
                            features: promotion.features,
                            buttonText: promotion.buttonText,
                            secondaryButtonText: promotion.secondaryButtonText,
                            isActive: promotion.isActive,
                            order: promotion.order,
                        },
                    }];
            case 19:
                error_5 = _e.sent();
                console.error('Error updating promotion:', error_5);
                return [2 /*return*/, reply.status(500).send({
                        success: false,
                        message: 'Internal server error',
                        error: error_5.message,
                    })];
            case 20: return [2 /*return*/];
        }
    });
}); };
exports.updatePromotion = updatePromotion;
var deletePromotion = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, promotion, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = request.params.id;
                return [4 /*yield*/, Promotion_1.PromotionModel.findByIdAndDelete(id)];
            case 1:
                promotion = _a.sent();
                if (!promotion) {
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'Promotion not found' })];
                }
                uploadHandler_1.default.deleteUploadedFile(promotion.thumbnailUrl);
                uploadHandler_1.default.deleteUploadedFile(promotion.videoUrl);
                return [2 /*return*/, reply.status(200).send({
                        success: true,
                        message: 'Promotion deleted successfully',
                    })];
            case 2:
                error_6 = _a.sent();
                console.error(error_6);
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error' })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deletePromotion = deletePromotion;
var bulkDeletePromotions = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var ids, promotions, result, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                ids = request.body.ids;
                if (!Array.isArray(ids) || ids.length === 0) {
                    return [2 /*return*/, reply.status(400).send({ success: false, message: 'Invalid or empty ids array' })];
                }
                return [4 /*yield*/, Promotion_1.PromotionModel.find({ _id: { $in: ids } })];
            case 1:
                promotions = _a.sent();
                // Delete files associated with promotions
                promotions.forEach(function (promotion) {
                    uploadHandler_1.default.deleteUploadedFile(promotion.thumbnailUrl);
                    uploadHandler_1.default.deleteUploadedFile(promotion.videoUrl);
                });
                return [4 /*yield*/, Promotion_1.PromotionModel.deleteMany({ _id: { $in: ids } })];
            case 2:
                result = _a.sent();
                return [2 /*return*/, {
                        success: true,
                        message: "".concat(result.deletedCount, " promotions deleted successfully"),
                        deletedCount: result.deletedCount,
                    }];
            case 3:
                error_7 = _a.sent();
                console.error('Error bulk deleting promotions:', error_7);
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error', error: error_7.message })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.bulkDeletePromotions = bulkDeletePromotions;
