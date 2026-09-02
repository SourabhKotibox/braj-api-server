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
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkDeleteSubscriptionPlans = exports.deleteSubscriptionPlan = exports.updateSubscriptionPlan = exports.createSubscriptionPlan = exports.getSubscriptionPlanById = exports.listSubscriptionPlans = void 0;
var SubscriptionPlan_1 = require("../models/SubscriptionPlan");
var listSubscriptionPlans = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var query, page, limit, _a, plans, total, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                query = request.query;
                page = Math.max(1, parseInt(query.page || '1', 10));
                limit = Math.min(100, Math.max(1, parseInt(query.limit || '20', 10)));
                return [4 /*yield*/, Promise.all([
                        SubscriptionPlan_1.SubscriptionPlanModel.find()
                            .sort({ level: 1, createdAt: -1 })
                            .skip((page - 1) * limit)
                            .limit(limit)
                            .lean(),
                        SubscriptionPlan_1.SubscriptionPlanModel.countDocuments(),
                    ])];
            case 1:
                _a = _b.sent(), plans = _a[0], total = _a[1];
                return [2 /*return*/, reply.send({
                        success: true,
                        data: plans.map(function (plan) { return ({
                            id: plan._id,
                            name: plan.name,
                            duration: plan.duration,
                            durationValue: plan.durationValue,
                            price: plan.price,
                            discount: plan.discount,
                            totalPrice: plan.totalPrice,
                            status: plan.status,
                            description: plan.description,
                            level: plan.level,
                            createdAt: plan.createdAt,
                            updatedAt: plan.updatedAt,
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
exports.listSubscriptionPlans = listSubscriptionPlans;
var getSubscriptionPlanById = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, plan, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = request.params.id;
                return [4 /*yield*/, SubscriptionPlan_1.SubscriptionPlanModel.findById(id).lean()];
            case 1:
                plan = _a.sent();
                if (!plan) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Plan not found' })];
                }
                return [2 /*return*/, reply.send({
                        success: true,
                        data: {
                            id: plan._id,
                            name: plan.name,
                            duration: plan.duration,
                            durationValue: plan.durationValue,
                            price: plan.price,
                            discount: plan.discount,
                            totalPrice: plan.totalPrice,
                            status: plan.status,
                            description: plan.description,
                            level: plan.level,
                            createdAt: plan.createdAt,
                            updatedAt: plan.updatedAt,
                        },
                    })];
            case 2:
                error_2 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_2.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getSubscriptionPlanById = getSubscriptionPlanById;
var createSubscriptionPlan = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var body, name_1, duration, durationValue, price, discount, status_1, description, level, numericPrice, numericDurationValue, numericLevel, numericDiscount, totalPrice, plan, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                body = request.body;
                name_1 = body.name, duration = body.duration, durationValue = body.durationValue, price = body.price, discount = body.discount, status_1 = body.status, description = body.description, level = body.level;
                if (!name_1 || !duration) {
                    return [2 /*return*/, reply.status(400).send({ success: false, error: 'Name and duration are required' })];
                }
                numericPrice = parseFloat(price);
                numericDurationValue = parseInt(durationValue || '1', 10);
                numericLevel = parseInt(level || '1', 10);
                numericDiscount = Math.max(0, Math.min(100, parseFloat(discount || '0')));
                totalPrice = numericPrice * (1 - numericDiscount / 100);
                return [4 /*yield*/, SubscriptionPlan_1.SubscriptionPlanModel.create({
                        name: name_1,
                        duration: duration,
                        durationValue: numericDurationValue,
                        price: numericPrice,
                        discount: numericDiscount,
                        totalPrice: Math.round(totalPrice * 100) / 100,
                        status: status_1 !== undefined ? !!status_1 : true,
                        description: description || '',
                        level: numericLevel,
                    })];
            case 1:
                plan = _a.sent();
                return [2 /*return*/, reply.status(201).send({
                        success: true,
                        data: {
                            id: plan._id,
                            name: plan.name,
                            duration: plan.duration,
                            durationValue: plan.durationValue,
                            price: plan.price,
                            discount: plan.discount,
                            totalPrice: plan.totalPrice,
                            status: plan.status,
                            description: plan.description,
                            level: plan.level,
                            createdAt: plan.createdAt,
                            updatedAt: plan.updatedAt,
                        },
                    })];
            case 2:
                error_3 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_3.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createSubscriptionPlan = createSubscriptionPlan;
var updateSubscriptionPlan = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, body, updateData, existingPlan, currentPrice, currentDiscount, plan, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                id = request.params.id;
                body = request.body;
                updateData = {};
                if (body.name !== undefined)
                    updateData.name = body.name;
                if (body.duration !== undefined)
                    updateData.duration = body.duration;
                if (body.durationValue !== undefined)
                    updateData.durationValue = parseInt(body.durationValue, 10);
                if (body.price !== undefined)
                    updateData.price = parseFloat(body.price);
                if (body.discount !== undefined)
                    updateData.discount = Math.max(0, Math.min(100, parseFloat(body.discount)));
                if (body.status !== undefined)
                    updateData.status = !!body.status;
                if (body.description !== undefined)
                    updateData.description = body.description;
                if (body.level !== undefined)
                    updateData.level = parseInt(body.level, 10);
                if (!(updateData.price !== undefined || updateData.discount !== undefined)) return [3 /*break*/, 2];
                return [4 /*yield*/, SubscriptionPlan_1.SubscriptionPlanModel.findById(id)];
            case 1:
                existingPlan = _a.sent();
                currentPrice = updateData.price !== undefined ? updateData.price : existingPlan === null || existingPlan === void 0 ? void 0 : existingPlan.price;
                currentDiscount = updateData.discount !== undefined ? updateData.discount : existingPlan === null || existingPlan === void 0 ? void 0 : existingPlan.discount;
                if (currentPrice !== undefined && currentDiscount !== undefined) {
                    updateData.totalPrice = Math.round(currentPrice * (1 - currentDiscount / 100) * 100) / 100;
                }
                _a.label = 2;
            case 2: return [4 /*yield*/, SubscriptionPlan_1.SubscriptionPlanModel.findByIdAndUpdate(id, { $set: updateData }, { returnDocument: 'after', runValidators: true }).lean()];
            case 3:
                plan = _a.sent();
                if (!plan) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Plan not found' })];
                }
                return [2 /*return*/, reply.send({
                        success: true,
                        data: {
                            id: plan._id,
                            name: plan.name,
                            duration: plan.duration,
                            durationValue: plan.durationValue,
                            price: plan.price,
                            discount: plan.discount,
                            totalPrice: plan.totalPrice,
                            status: plan.status,
                            description: plan.description,
                            level: plan.level,
                            createdAt: plan.createdAt,
                            updatedAt: plan.updatedAt,
                        },
                    })];
            case 4:
                error_4 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_4.message })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.updateSubscriptionPlan = updateSubscriptionPlan;
var deleteSubscriptionPlan = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, plan, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = request.params.id;
                return [4 /*yield*/, SubscriptionPlan_1.SubscriptionPlanModel.findByIdAndDelete(id)];
            case 1:
                plan = _a.sent();
                if (!plan) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Plan not found' })];
                }
                return [2 /*return*/, reply.send({
                        success: true,
                        message: 'Plan deleted successfully',
                    })];
            case 2:
                error_5 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_5.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteSubscriptionPlan = deleteSubscriptionPlan;
var bulkDeleteSubscriptionPlans = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var ids, result, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                ids = request.body.ids;
                if (!Array.isArray(ids) || ids.length === 0) {
                    return [2 /*return*/, reply.status(400).send({ success: false, message: 'Invalid or empty ids array' })];
                }
                return [4 /*yield*/, SubscriptionPlan_1.SubscriptionPlanModel.deleteMany({ _id: { $in: ids } })];
            case 1:
                result = _a.sent();
                return [2 /*return*/, reply.send({
                        success: true,
                        message: "".concat(result.deletedCount, " plans deleted successfully"),
                        deletedCount: result.deletedCount,
                    })];
            case 2:
                error_6 = _a.sent();
                console.error('Error bulk deleting plans:', error_6);
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error', error: error_6.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.bulkDeleteSubscriptionPlans = bulkDeleteSubscriptionPlans;
