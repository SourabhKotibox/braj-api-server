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
exports.bulkDeletePlanLimits = exports.deletePlanLimit = exports.updatePlanLimit = exports.createPlanLimit = exports.getPlanLimitById = exports.listPlanLimits = void 0;
var PlanLimit_1 = require("../models/PlanLimit");
var listPlanLimits = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var query, page, limit, filter, _a, planLimits, total, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                query = request.query;
                page = Math.max(1, parseInt(query.page || '1', 10));
                limit = Math.min(100, Math.max(1, parseInt(query.limit || '20', 10)));
                filter = {};
                if (query.planId) {
                    filter.planId = query.planId;
                }
                return [4 /*yield*/, Promise.all([
                        PlanLimit_1.PlanLimitModel.find(filter)
                            .populate('planId', 'name')
                            .sort({ createdAt: -1 })
                            .skip((page - 1) * limit)
                            .limit(limit)
                            .lean(),
                        PlanLimit_1.PlanLimitModel.countDocuments(filter),
                    ])];
            case 1:
                _a = _b.sent(), planLimits = _a[0], total = _a[1];
                return [2 /*return*/, reply.send({
                        success: true,
                        data: planLimits.map(function (planLimit) {
                            var plan = planLimit.planId;
                            return {
                                id: planLimit._id,
                                planId: planLimit.planId._id || planLimit.planId,
                                planName: (plan === null || plan === void 0 ? void 0 : plan.name) || '',
                                videoCast: planLimit.videoCast,
                                ads: planLimit.ads,
                                deviceLimit: planLimit.deviceLimit,
                                deviceLimitCount: planLimit.deviceLimitCount,
                                downloadStatus: planLimit.downloadStatus,
                                supportedDeviceType: planLimit.supportedDeviceType,
                                supportedDevices: planLimit.supportedDevices,
                                profileLimit: planLimit.profileLimit,
                                profileLimitCount: planLimit.profileLimitCount,
                                q480p: planLimit.q480p,
                                q720p: planLimit.q720p,
                                q1080p: planLimit.q1080p,
                                q1440p: planLimit.q1440p,
                                q2k: planLimit.q2k,
                                q4k: planLimit.q4k,
                                createdAt: planLimit.createdAt,
                                updatedAt: planLimit.updatedAt,
                            };
                        }),
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
exports.listPlanLimits = listPlanLimits;
var getPlanLimitById = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, planLimit, plan, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = request.params.id;
                return [4 /*yield*/, PlanLimit_1.PlanLimitModel.findById(id).populate('planId', 'name').lean()];
            case 1:
                planLimit = _a.sent();
                if (!planLimit) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Plan limit not found' })];
                }
                plan = planLimit.planId;
                return [2 /*return*/, reply.send({
                        success: true,
                        data: {
                            id: planLimit._id,
                            planId: planLimit.planId._id || planLimit.planId,
                            planName: (plan === null || plan === void 0 ? void 0 : plan.name) || '',
                            videoCast: planLimit.videoCast,
                            ads: planLimit.ads,
                            deviceLimit: planLimit.deviceLimit,
                            deviceLimitCount: planLimit.deviceLimitCount,
                            downloadStatus: planLimit.downloadStatus,
                            supportedDeviceType: planLimit.supportedDeviceType,
                            supportedDevices: planLimit.supportedDevices,
                            profileLimit: planLimit.profileLimit,
                            profileLimitCount: planLimit.profileLimitCount,
                            q480p: planLimit.q480p,
                            q720p: planLimit.q720p,
                            q1080p: planLimit.q1080p,
                            q1440p: planLimit.q1440p,
                            q2k: planLimit.q2k,
                            q4k: planLimit.q4k,
                            createdAt: planLimit.createdAt,
                            updatedAt: planLimit.updatedAt,
                        },
                    })];
            case 2:
                error_2 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_2.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getPlanLimitById = getPlanLimitById;
var createPlanLimit = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var body, planId, videoCast, ads, deviceLimit, deviceLimitCount, downloadStatus, supportedDeviceType, supportedDevices, profileLimit, profileLimitCount, q480p, q720p, q1080p, q1440p, q2k, q4k, existing, planLimit, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                body = request.body;
                planId = body.planId, videoCast = body.videoCast, ads = body.ads, deviceLimit = body.deviceLimit, deviceLimitCount = body.deviceLimitCount, downloadStatus = body.downloadStatus, supportedDeviceType = body.supportedDeviceType, supportedDevices = body.supportedDevices, profileLimit = body.profileLimit, profileLimitCount = body.profileLimitCount, q480p = body.q480p, q720p = body.q720p, q1080p = body.q1080p, q1440p = body.q1440p, q2k = body.q2k, q4k = body.q4k;
                if (!planId) {
                    return [2 /*return*/, reply.status(400).send({ success: false, error: 'Plan ID is required' })];
                }
                return [4 /*yield*/, PlanLimit_1.PlanLimitModel.findOne({ planId: planId })];
            case 1:
                existing = _a.sent();
                if (existing) {
                    return [2 /*return*/, reply.status(400).send({ success: false, error: 'Plan limit for this plan already exists' })];
                }
                return [4 /*yield*/, PlanLimit_1.PlanLimitModel.create({
                        planId: planId,
                        videoCast: !!videoCast,
                        ads: !!ads,
                        deviceLimit: !!deviceLimit,
                        deviceLimitCount: deviceLimitCount !== undefined ? parseInt(deviceLimitCount, 10) : 1,
                        downloadStatus: !!downloadStatus,
                        supportedDeviceType: !!supportedDeviceType,
                        supportedDevices: supportedDevices || [],
                        profileLimit: !!profileLimit,
                        profileLimitCount: profileLimitCount !== undefined ? parseInt(profileLimitCount, 10) : 1,
                        q480p: !!q480p,
                        q720p: !!q720p,
                        q1080p: !!q1080p,
                        q1440p: !!q1440p,
                        q2k: !!q2k,
                        q4k: !!q4k,
                    })];
            case 2:
                planLimit = _a.sent();
                return [2 /*return*/, reply.status(201).send({
                        success: true,
                        data: {
                            id: planLimit._id,
                            planId: planLimit.planId,
                            planName: '',
                            videoCast: planLimit.videoCast,
                            ads: planLimit.ads,
                            deviceLimit: planLimit.deviceLimit,
                            deviceLimitCount: planLimit.deviceLimitCount,
                            downloadStatus: planLimit.downloadStatus,
                            supportedDeviceType: planLimit.supportedDeviceType,
                            supportedDevices: planLimit.supportedDevices,
                            profileLimit: planLimit.profileLimit,
                            profileLimitCount: planLimit.profileLimitCount,
                            q480p: planLimit.q480p,
                            q720p: planLimit.q720p,
                            q1080p: planLimit.q1080p,
                            q1440p: planLimit.q1440p,
                            q2k: planLimit.q2k,
                            q4k: planLimit.q4k,
                            createdAt: planLimit.createdAt,
                            updatedAt: planLimit.updatedAt,
                        },
                    })];
            case 3:
                error_3 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_3.message })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.createPlanLimit = createPlanLimit;
var updatePlanLimit = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, body, updateData, planLimit, plan, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = request.params.id;
                body = request.body;
                updateData = {};
                if (body.planId !== undefined)
                    updateData.planId = body.planId;
                if (body.videoCast !== undefined)
                    updateData.videoCast = !!body.videoCast;
                if (body.ads !== undefined)
                    updateData.ads = !!body.ads;
                if (body.deviceLimit !== undefined)
                    updateData.deviceLimit = !!body.deviceLimit;
                if (body.deviceLimitCount !== undefined)
                    updateData.deviceLimitCount = parseInt(body.deviceLimitCount, 10);
                if (body.downloadStatus !== undefined)
                    updateData.downloadStatus = !!body.downloadStatus;
                if (body.supportedDeviceType !== undefined)
                    updateData.supportedDeviceType = !!body.supportedDeviceType;
                if (body.supportedDevices !== undefined)
                    updateData.supportedDevices = body.supportedDevices;
                if (body.profileLimit !== undefined)
                    updateData.profileLimit = !!body.profileLimit;
                if (body.profileLimitCount !== undefined)
                    updateData.profileLimitCount = parseInt(body.profileLimitCount, 10);
                if (body.q480p !== undefined)
                    updateData.q480p = !!body.q480p;
                if (body.q720p !== undefined)
                    updateData.q720p = !!body.q720p;
                if (body.q1080p !== undefined)
                    updateData.q1080p = !!body.q1080p;
                if (body.q1440p !== undefined)
                    updateData.q1440p = !!body.q1440p;
                if (body.q2k !== undefined)
                    updateData.q2k = !!body.q2k;
                if (body.q4k !== undefined)
                    updateData.q4k = !!body.q4k;
                return [4 /*yield*/, PlanLimit_1.PlanLimitModel.findByIdAndUpdate(id, { $set: updateData }, { returnDocument: 'after', runValidators: true }).populate('planId', 'name').lean()];
            case 1:
                planLimit = _a.sent();
                if (!planLimit) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Plan limit not found' })];
                }
                plan = planLimit.planId;
                return [2 /*return*/, reply.send({
                        success: true,
                        data: {
                            id: planLimit._id,
                            planId: planLimit.planId._id || planLimit.planId,
                            planName: (plan === null || plan === void 0 ? void 0 : plan.name) || '',
                            videoCast: planLimit.videoCast,
                            ads: planLimit.ads,
                            deviceLimit: planLimit.deviceLimit,
                            deviceLimitCount: planLimit.deviceLimitCount,
                            downloadStatus: planLimit.downloadStatus,
                            supportedDeviceType: planLimit.supportedDeviceType,
                            supportedDevices: planLimit.supportedDevices,
                            profileLimit: planLimit.profileLimit,
                            profileLimitCount: planLimit.profileLimitCount,
                            q480p: planLimit.q480p,
                            q720p: planLimit.q720p,
                            q1080p: planLimit.q1080p,
                            q1440p: planLimit.q1440p,
                            q2k: planLimit.q2k,
                            q4k: planLimit.q4k,
                            createdAt: planLimit.createdAt,
                            updatedAt: planLimit.updatedAt,
                        },
                    })];
            case 2:
                error_4 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_4.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updatePlanLimit = updatePlanLimit;
var deletePlanLimit = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, planLimit, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = request.params.id;
                return [4 /*yield*/, PlanLimit_1.PlanLimitModel.findByIdAndDelete(id)];
            case 1:
                planLimit = _a.sent();
                if (!planLimit) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Plan limit not found' })];
                }
                return [2 /*return*/, reply.send({
                        success: true,
                        message: 'Plan limit deleted successfully',
                    })];
            case 2:
                error_5 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_5.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deletePlanLimit = deletePlanLimit;
var bulkDeletePlanLimits = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var ids, result, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                ids = request.body.ids;
                if (!Array.isArray(ids) || ids.length === 0) {
                    return [2 /*return*/, reply.status(400).send({ success: false, message: 'Invalid or empty ids array' })];
                }
                return [4 /*yield*/, PlanLimit_1.PlanLimitModel.deleteMany({ _id: { $in: ids } })];
            case 1:
                result = _a.sent();
                return [2 /*return*/, reply.send({
                        success: true,
                        message: "".concat(result.deletedCount, " plan limits deleted successfully"),
                        deletedCount: result.deletedCount,
                    })];
            case 2:
                error_6 = _a.sent();
                console.error('Error bulk deleting plan limits:', error_6);
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error', error: error_6.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.bulkDeletePlanLimits = bulkDeletePlanLimits;
