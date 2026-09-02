"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.verifyRazorpayPayment = exports.createRazorpayOrder = exports.bulkDeleteSubscriptions = exports.deleteSubscription = exports.updateSubscription = exports.createSubscription = exports.getSubscriptionById = exports.listSubscriptions = void 0;
var Subscription_1 = require("../models/Subscription");
var SubscriptionPlan_1 = require("../models/SubscriptionPlan");
var User_1 = require("../models/User");
var roundCurrency = function (value) { return Math.round(value * 100) / 100; };
var toNumber = function (value, fallback) {
    if (fallback === void 0) { fallback = 0; }
    var numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : fallback;
};
var formatDate = function (value) {
    var date = value instanceof Date ? value : new Date(value);
    return date.toISOString().split('T')[0];
};
var formatDurationLabel = function (duration, durationValue) {
    if (!duration)
        return '';
    if (/\d/.test(duration))
        return duration;
    if (durationValue <= 1)
        return "".concat(durationValue, " ").concat(duration);
    return "".concat(durationValue, " ").concat(duration.endsWith('s') ? duration : "".concat(duration, "s"));
};
var addDuration = function (start, duration, durationValue) {
    var end = new Date(start);
    var normalized = duration.toLowerCase();
    if (normalized.includes('day')) {
        end.setDate(end.getDate() + durationValue);
        return end;
    }
    if (normalized.includes('week')) {
        end.setDate(end.getDate() + durationValue * 7);
        return end;
    }
    if (normalized.includes('year')) {
        end.setFullYear(end.getFullYear() + durationValue);
        return end;
    }
    end.setMonth(end.getMonth() + durationValue);
    return end;
};
var serializeSubscription = function (subscription) {
    var user = subscription.userId && typeof subscription.userId === 'object' ? subscription.userId : null;
    var plan = subscription.planId && typeof subscription.planId === 'object' ? subscription.planId : null;
    return {
        id: String(subscription._id),
        userId: (user === null || user === void 0 ? void 0 : user._id) ? String(user._id) : String(subscription.userId || ''),
        userName: (user === null || user === void 0 ? void 0 : user.name) || '',
        userEmail: (user === null || user === void 0 ? void 0 : user.email) || '',
        planId: (plan === null || plan === void 0 ? void 0 : plan._id) ? String(plan._id) : String(subscription.planId || ''),
        plan: subscription.plan,
        duration: subscription.duration,
        durationValue: subscription.durationValue || 1,
        durationLabel: formatDurationLabel(subscription.duration, subscription.durationValue || 1),
        paymentMethod: subscription.paymentMethod,
        startDate: formatDate(subscription.startDate),
        endDate: formatDate(subscription.endDate),
        price: subscription.price,
        discount: subscription.discount,
        couponDiscount: subscription.couponDiscount,
        tax: subscription.tax,
        totalAmount: subscription.totalAmount,
        status: subscription.status,
        createdAt: subscription.createdAt,
        updatedAt: subscription.updatedAt,
    };
};
var buildSubscriptionPayload = function (body, existing) { return __awaiter(void 0, void 0, void 0, function () {
    var resolvedPlanId, plan, _a, duration, durationValue, startDate, endDate, price, discountPercent, calculatedDiscount, discount, couponDiscount, tax, totalAmount;
    var _b, _c, _d, _e, _f, _g, _h, _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                resolvedPlanId = body.planId || (existing === null || existing === void 0 ? void 0 : existing.planId);
                if (!resolvedPlanId) return [3 /*break*/, 2];
                return [4 /*yield*/, SubscriptionPlan_1.SubscriptionPlanModel.findById(resolvedPlanId).lean()];
            case 1:
                _a = _k.sent();
                return [3 /*break*/, 3];
            case 2:
                _a = null;
                _k.label = 3;
            case 3:
                plan = _a;
                if (!plan && !existing) {
                    throw new Error('Plan not found');
                }
                duration = body.duration || (plan === null || plan === void 0 ? void 0 : plan.duration) || (existing === null || existing === void 0 ? void 0 : existing.duration) || 'Month';
                durationValue = Math.max(1, Math.trunc(toNumber(body.durationValue, (plan === null || plan === void 0 ? void 0 : plan.durationValue) || (existing === null || existing === void 0 ? void 0 : existing.durationValue) || 1)));
                startDate = new Date(body.startDate || body.paymentDate || (existing === null || existing === void 0 ? void 0 : existing.startDate) || new Date());
                endDate = body.endDate
                    ? new Date(body.endDate)
                    : addDuration(startDate, duration, durationValue);
                price = roundCurrency(toNumber((_b = body.price) !== null && _b !== void 0 ? _b : body.amount, (_d = (_c = plan === null || plan === void 0 ? void 0 : plan.price) !== null && _c !== void 0 ? _c : existing === null || existing === void 0 ? void 0 : existing.price) !== null && _d !== void 0 ? _d : 0));
                discountPercent = (plan === null || plan === void 0 ? void 0 : plan.discount) || 0;
                calculatedDiscount = price * (discountPercent / 100);
                discount = roundCurrency(toNumber(body.discount, (_e = existing === null || existing === void 0 ? void 0 : existing.discount) !== null && _e !== void 0 ? _e : calculatedDiscount));
                couponDiscount = roundCurrency(toNumber(body.couponDiscount, (_f = existing === null || existing === void 0 ? void 0 : existing.couponDiscount) !== null && _f !== void 0 ? _f : 0));
                tax = roundCurrency(toNumber(body.tax, (_g = existing === null || existing === void 0 ? void 0 : existing.tax) !== null && _g !== void 0 ? _g : 0));
                totalAmount = roundCurrency(body.totalAmount !== undefined
                    ? toNumber(body.totalAmount, 0)
                    : price - discount - couponDiscount + tax);
                return [2 /*return*/, {
                        userId: body.userId || (existing === null || existing === void 0 ? void 0 : existing.userId),
                        planId: resolvedPlanId,
                        plan: (plan === null || plan === void 0 ? void 0 : plan.name) || (existing === null || existing === void 0 ? void 0 : existing.plan),
                        duration: duration,
                        durationValue: durationValue,
                        paymentMethod: (_j = (_h = body.paymentMethod) !== null && _h !== void 0 ? _h : existing === null || existing === void 0 ? void 0 : existing.paymentMethod) !== null && _j !== void 0 ? _j : '-',
                        startDate: startDate,
                        endDate: endDate,
                        price: price,
                        discount: discount,
                        couponDiscount: couponDiscount,
                        tax: tax,
                        totalAmount: totalAmount,
                        status: body.status || (existing === null || existing === void 0 ? void 0 : existing.status) || 'active',
                    }];
        }
    });
}); };
var listSubscriptions = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var query, page, limit, filter, endOfDay, searchRegex, _a, subscriptions, total, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                query = request.query;
                page = Math.max(1, parseInt(query.page || '1', 10));
                limit = Math.min(100, Math.max(1, parseInt(query.limit || '20', 10)));
                filter = {};
                if (query.plan && query.plan !== 'All Plans') {
                    filter.plan = query.plan;
                }
                if (query.dateFrom || query.dateTo) {
                    filter.startDate = {};
                    if (query.dateFrom)
                        filter.startDate.$gte = new Date(query.dateFrom);
                    if (query.dateTo) {
                        endOfDay = new Date(query.dateTo);
                        endOfDay.setHours(23, 59, 59, 999);
                        filter.startDate.$lte = endOfDay;
                    }
                }
                if (query.search) {
                    searchRegex = new RegExp(query.search, 'i');
                    filter.$or = [{ plan: searchRegex }, { paymentMethod: searchRegex }];
                }
                return [4 /*yield*/, Promise.all([
                        Subscription_1.SubscriptionModel.find(filter)
                            .populate('userId', 'name email')
                            .populate('planId', 'name')
                            .sort({ createdAt: -1 })
                            .skip((page - 1) * limit)
                            .limit(limit)
                            .lean(),
                        Subscription_1.SubscriptionModel.countDocuments(filter),
                    ])];
            case 1:
                _a = _b.sent(), subscriptions = _a[0], total = _a[1];
                return [2 /*return*/, reply.send({
                        success: true,
                        data: subscriptions.map(serializeSubscription),
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
exports.listSubscriptions = listSubscriptions;
var getSubscriptionById = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, subscription, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = request.params.id;
                return [4 /*yield*/, Subscription_1.SubscriptionModel.findById(id)
                        .populate('userId', 'name email')
                        .populate('planId', 'name')
                        .lean()];
            case 1:
                subscription = _a.sent();
                if (!subscription) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Subscription not found' })];
                }
                return [2 /*return*/, reply.send({ success: true, data: serializeSubscription(subscription) })];
            case 2:
                error_2 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_2.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getSubscriptionById = getSubscriptionById;
var createSubscription = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var body, payload, subscription, created, error_3, statusCode;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                body = request.body;
                if (!body.userId || !body.planId || !(body.startDate || body.paymentDate)) {
                    return [2 /*return*/, reply.status(400).send({
                            success: false,
                            error: 'User, plan, and start date are required',
                        })];
                }
                return [4 /*yield*/, buildSubscriptionPayload(body)];
            case 1:
                payload = _a.sent();
                return [4 /*yield*/, Subscription_1.SubscriptionModel.create(payload)];
            case 2:
                subscription = _a.sent();
                // Update user's subscription fields
                return [4 /*yield*/, User_1.UserModel.findByIdAndUpdate(payload.userId, {
                        $set: {
                            subscriptionPlan: payload.plan,
                            subscriptionStatus: payload.status,
                            subscriptionExpiry: payload.endDate,
                            subscriptionPlanId: payload.planId
                        }
                    })];
            case 3:
                // Update user's subscription fields
                _a.sent();
                return [4 /*yield*/, Subscription_1.SubscriptionModel.findById(subscription._id)
                        .populate('userId', 'name email')
                        .populate('planId', 'name')
                        .lean()];
            case 4:
                created = _a.sent();
                return [2 /*return*/, reply.status(201).send({
                        success: true,
                        data: created ? serializeSubscription(created) : serializeSubscription(subscription),
                    })];
            case 5:
                error_3 = _a.sent();
                statusCode = error_3.message === 'Plan not found' ? 404 : 500;
                return [2 /*return*/, reply.status(statusCode).send({ success: false, error: error_3.message })];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.createSubscription = createSubscription;
var updateSubscription = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, body, existing, payload, updated, error_4, statusCode;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                id = request.params.id;
                body = request.body;
                return [4 /*yield*/, Subscription_1.SubscriptionModel.findById(id).lean()];
            case 1:
                existing = _a.sent();
                if (!existing) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Subscription not found' })];
                }
                return [4 /*yield*/, buildSubscriptionPayload(body, existing)];
            case 2:
                payload = _a.sent();
                return [4 /*yield*/, Subscription_1.SubscriptionModel.findByIdAndUpdate(id, { $set: payload }, { returnDocument: 'after', runValidators: true })
                        .populate('userId', 'name email')
                        .populate('planId', 'name')
                        .lean()];
            case 3:
                updated = _a.sent();
                return [2 /*return*/, reply.send({
                        success: true,
                        data: updated ? serializeSubscription(updated) : null,
                    })];
            case 4:
                error_4 = _a.sent();
                statusCode = error_4.message === 'Plan not found' ? 404 : 500;
                return [2 /*return*/, reply.status(statusCode).send({ success: false, error: error_4.message })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.updateSubscription = updateSubscription;
var deleteSubscription = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, subscription, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = request.params.id;
                return [4 /*yield*/, Subscription_1.SubscriptionModel.findByIdAndDelete(id)];
            case 1:
                subscription = _a.sent();
                if (!subscription) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Subscription not found' })];
                }
                return [2 /*return*/, reply.send({ success: true, message: 'Subscription deleted successfully' })];
            case 2:
                error_5 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_5.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteSubscription = deleteSubscription;
var bulkDeleteSubscriptions = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var ids, result, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                ids = request.body.ids;
                if (!Array.isArray(ids) || ids.length === 0) {
                    return [2 /*return*/, reply.status(400).send({ success: false, error: 'Invalid or empty ids array' })];
                }
                return [4 /*yield*/, Subscription_1.SubscriptionModel.deleteMany({ _id: { $in: ids } })];
            case 1:
                result = _a.sent();
                return [2 /*return*/, reply.send({
                        success: true,
                        message: "".concat(result.deletedCount, " subscription(s) deleted successfully"),
                        deletedCount: result.deletedCount,
                    })];
            case 2:
                error_6 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_6.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.bulkDeleteSubscriptions = bulkDeleteSubscriptions;
var razorpay_1 = __importDefault(require("razorpay"));
var crypto_1 = __importDefault(require("crypto"));
var Settings_1 = require("../models/Settings");
var createRazorpayOrder = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var planId, plan, settings, instance, amountInPaise, userId, body, payload, subscription, UserModel_1, order, error_7, errorMsg;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 9, , 10]);
                planId = request.body.planId;
                return [4 /*yield*/, SubscriptionPlan_1.SubscriptionPlanModel.findById(planId).lean()];
            case 1:
                plan = _c.sent();
                if (!plan) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Plan not found' })];
                }
                return [4 /*yield*/, Settings_1.SettingsModel.findOne().lean()];
            case 2:
                settings = _c.sent();
                if (!(settings === null || settings === void 0 ? void 0 : settings.razorpayEnabled) || !(settings === null || settings === void 0 ? void 0 : settings.razorpayKeyId) || !(settings === null || settings === void 0 ? void 0 : settings.razorpayKeySecret)) {
                    return [2 /*return*/, reply.status(400).send({ success: false, error: 'Razorpay is not configured or enabled' })];
                }
                instance = new razorpay_1.default({
                    key_id: settings.razorpayKeyId,
                    key_secret: settings.razorpayKeySecret,
                });
                amountInPaise = Math.round((plan.totalPrice || 0) * 100);
                if (!(amountInPaise === 0)) return [3 /*break*/, 7];
                userId = ((_a = request.user) === null || _a === void 0 ? void 0 : _a.id) || request.body.userId;
                if (!userId) {
                    return [2 /*return*/, reply.status(400).send({ success: false, error: 'User ID is required for free plans' })];
                }
                body = {
                    userId: userId,
                    planId: planId,
                    paymentMethod: 'Free',
                    status: 'active',
                    price: 0,
                    totalAmount: 0,
                    duration: plan.duration,
                    durationValue: plan.durationValue
                };
                return [4 /*yield*/, buildSubscriptionPayload(body)];
            case 3:
                payload = _c.sent();
                return [4 /*yield*/, Subscription_1.SubscriptionModel.create(payload)];
            case 4:
                subscription = _c.sent();
                return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../models/User')); })];
            case 5:
                UserModel_1 = (_c.sent()).UserModel;
                return [4 /*yield*/, UserModel_1.findByIdAndUpdate(userId, {
                        $set: {
                            subscriptionPlan: payload.plan,
                            subscriptionStatus: payload.status,
                            subscriptionExpiry: payload.endDate,
                            subscriptionPlanId: payload.planId
                        }
                    })];
            case 6:
                _c.sent();
                return [2 /*return*/, reply.send({
                        success: true,
                        isFree: true,
                        message: 'Free plan activated successfully',
                        subscriptionId: subscription._id
                    })];
            case 7: return [4 /*yield*/, instance.orders.create({
                    amount: amountInPaise,
                    currency: settings.currencyCode || 'INR',
                    receipt: "receipt_".concat(Date.now()),
                })];
            case 8:
                order = _c.sent();
                return [2 /*return*/, reply.send({
                        success: true,
                        order: order,
                        keyId: settings.razorpayKeyId,
                    })];
            case 9:
                error_7 = _c.sent();
                console.error('Razorpay Create Order Error:', error_7);
                errorMsg = ((_b = error_7 === null || error_7 === void 0 ? void 0 : error_7.error) === null || _b === void 0 ? void 0 : _b.description) || (error_7 === null || error_7 === void 0 ? void 0 : error_7.message) || 'Failed to create Razorpay order';
                return [2 /*return*/, reply.status(400).send({ success: false, error: errorMsg })];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.createRazorpayOrder = createRazorpayOrder;
var verifyRazorpayPayment = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, razorpay_order_id, razorpay_payment_id, razorpay_signature, planId, bodyUserId, userId, settings, text, generated_signature, plan, body, payload, subscription, error_8;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 6, , 7]);
                _a = request.body, razorpay_order_id = _a.razorpay_order_id, razorpay_payment_id = _a.razorpay_payment_id, razorpay_signature = _a.razorpay_signature, planId = _a.planId, bodyUserId = _a.userId;
                userId = ((_b = request.user) === null || _b === void 0 ? void 0 : _b.id) || bodyUserId;
                if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !planId || !userId) {
                    return [2 /*return*/, reply.status(400).send({ success: false, error: 'Missing payment details or plan details' })];
                }
                return [4 /*yield*/, Settings_1.SettingsModel.findOne().lean()];
            case 1:
                settings = _c.sent();
                if (!(settings === null || settings === void 0 ? void 0 : settings.razorpayEnabled) || !(settings === null || settings === void 0 ? void 0 : settings.razorpayKeySecret)) {
                    return [2 /*return*/, reply.status(400).send({ success: false, error: 'Razorpay is not configured' })];
                }
                text = "".concat(razorpay_order_id, "|").concat(razorpay_payment_id);
                generated_signature = crypto_1.default
                    .createHmac('sha256', settings.razorpayKeySecret)
                    .update(text)
                    .digest('hex');
                if (generated_signature !== razorpay_signature) {
                    return [2 /*return*/, reply.status(400).send({ success: false, error: 'Invalid payment signature' })];
                }
                return [4 /*yield*/, SubscriptionPlan_1.SubscriptionPlanModel.findById(planId).lean()];
            case 2:
                plan = _c.sent();
                if (!plan) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Plan not found' })];
                }
                body = {
                    userId: userId,
                    planId: planId,
                    paymentMethod: 'Razorpay',
                    status: 'active',
                    price: plan.totalPrice,
                    totalAmount: plan.totalPrice,
                    duration: plan.duration,
                    durationValue: plan.durationValue
                };
                return [4 /*yield*/, buildSubscriptionPayload(body)];
            case 3:
                payload = _c.sent();
                return [4 /*yield*/, Subscription_1.SubscriptionModel.create(payload)];
            case 4:
                subscription = _c.sent();
                return [4 /*yield*/, User_1.UserModel.findByIdAndUpdate(userId, {
                        $set: {
                            subscriptionPlan: payload.plan,
                            subscriptionStatus: payload.status,
                            subscriptionExpiry: payload.endDate,
                            subscriptionPlanId: payload.planId
                        }
                    })];
            case 5:
                _c.sent();
                return [2 /*return*/, reply.send({
                        success: true,
                        message: 'Payment verified and subscription activated successfully',
                        subscriptionId: subscription._id
                    })];
            case 6:
                error_8 = _c.sent();
                console.error('Razorpay Verify Error:', error_8);
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_8.message })];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.verifyRazorpayPayment = verifyRazorpayPayment;
