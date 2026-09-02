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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRewardClaims = exports.deleteRewardDefinition = exports.updateRewardDefinition = exports.createRewardDefinition = exports.getAdminRewardDefinitions = exports.getRewardStatus = exports.claimDailyReward = exports.claimRewardById = exports.getPublicRewardDefinitions = void 0;
var Reward_1 = require("../models/Reward");
var RewardDefinition_1 = require("../models/RewardDefinition");
var User_1 = require("../models/User");
var AdminUser_1 = require("../models/AdminUser");
var UnlockedEpisode_1 = require("../models/UnlockedEpisode");
var getModel = function (role) { return role === 'user' ? User_1.UserModel : AdminUser_1.AdminUserModel; };
var Transaction_1 = require("../models/Transaction");
var logger_1 = require("../lib/logger");
var mongoose_1 = __importDefault(require("mongoose"));
/**
 * Helper: Check if a user has completed a task for a reward definition.
 * Returns { completed: boolean, progress?: number, required?: number }
 */
function checkTaskCompletion(userId, def) {
    return __awaiter(this, void 0, void 0, function () {
        var requiredCount, _a, count, user, completed;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    requiredCount = def.requiredCount || 1;
                    _a = def.type;
                    switch (_a) {
                        case 'watch_episodes': return [3 /*break*/, 1];
                        case 'profile_complete': return [3 /*break*/, 3];
                        case 'signup': return [3 /*break*/, 5];
                        case 'share_content': return [3 /*break*/, 6];
                        case 'custom': return [3 /*break*/, 6];
                    }
                    return [3 /*break*/, 7];
                case 1: return [4 /*yield*/, UnlockedEpisode_1.UnlockedEpisodeModel.countDocuments({ userId: userId })];
                case 2:
                    count = _b.sent();
                    return [2 /*return*/, { completed: count >= requiredCount, progress: count, required: requiredCount }];
                case 3: return [4 /*yield*/, User_1.UserModel.findById(userId).select('name avatar phone email').lean()];
                case 4:
                    user = _b.sent();
                    if (!user)
                        return [2 /*return*/, { completed: false }];
                    completed = !!(user.name && user.email && user.avatar && user.phone);
                    return [2 /*return*/, { completed: completed }];
                case 5:
                    {
                        // Sign-up is always "completed" if the user exists
                        return [2 /*return*/, { completed: true }];
                    }
                    _b.label = 6;
                case 6:
                    {
                        // Cannot verify server-side — treat as one-time claimable (admin trusts the user)
                        return [2 /*return*/, { completed: true }];
                    }
                    _b.label = 7;
                case 7: return [2 /*return*/, { completed: true }];
            }
        });
    });
}
// ─── USER-FACING ──────────────────────────────────────────────────────────────
/**
 * GET /app/rewards
 * Returns all active reward definitions for the app (with user's claim status).
 */
var getPublicRewardDefinitions = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var user_1, definitions, enriched, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                user_1 = request.user;
                return [4 /*yield*/, RewardDefinition_1.RewardDefinitionModel.find({ isActive: true })
                        .sort({ order: 1, createdAt: 1 })
                        .lean()];
            case 1:
                definitions = _a.sent();
                if (!user_1) {
                    return [2 /*return*/, reply.send({ success: true, data: definitions.map(function (d) { return (__assign(__assign({}, d), { canClaim: false, isClaimed: false })); }) })];
                }
                return [4 /*yield*/, Promise.all(definitions.map(function (def) { return __awaiter(void 0, void 0, void 0, function () {
                        var defId, twentyFourHoursAgo, lastClaim, canClaim, nextClaimTime, existingClaim, taskStatus, existingRecurringClaim, recurringTaskStatus;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    defId = def._id;
                                    if (!(def.type === 'daily_login')) return [3 /*break*/, 2];
                                    twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
                                    return [4 /*yield*/, Reward_1.RewardModel.findOne({
                                            userId: user_1.id,
                                            type: 'daily_login',
                                            claimedAt: { $gte: twentyFourHoursAgo },
                                        })];
                                case 1:
                                    lastClaim = _a.sent();
                                    canClaim = !lastClaim;
                                    nextClaimTime = lastClaim
                                        ? new Date(lastClaim.claimedAt.getTime() + 24 * 60 * 60 * 1000)
                                        : null;
                                    return [2 /*return*/, __assign(__assign({}, def), { canClaim: canClaim, isClaimed: !canClaim, nextClaimTime: nextClaimTime })];
                                case 2:
                                    if (!def.isOneTime) return [3 /*break*/, 5];
                                    return [4 /*yield*/, Reward_1.RewardModel.findOne({
                                            userId: user_1.id,
                                            rewardDefinitionId: defId,
                                        })];
                                case 3:
                                    existingClaim = _a.sent();
                                    if (existingClaim) {
                                        return [2 /*return*/, __assign(__assign({}, def), { canClaim: false, isClaimed: true })];
                                    }
                                    return [4 /*yield*/, checkTaskCompletion(user_1.id, def)];
                                case 4:
                                    taskStatus = _a.sent();
                                    return [2 /*return*/, __assign(__assign({}, def), { canClaim: taskStatus.completed, isClaimed: false, taskCompleted: taskStatus.completed, progress: taskStatus.progress, required: taskStatus.required })];
                                case 5: return [4 /*yield*/, Reward_1.RewardModel.findOne({
                                        userId: user_1.id,
                                        rewardDefinitionId: defId,
                                    })];
                                case 6:
                                    existingRecurringClaim = _a.sent();
                                    if (existingRecurringClaim) {
                                        return [2 /*return*/, __assign(__assign({}, def), { canClaim: false, isClaimed: true })];
                                    }
                                    return [4 /*yield*/, checkTaskCompletion(user_1.id, def)];
                                case 7:
                                    recurringTaskStatus = _a.sent();
                                    return [2 /*return*/, __assign(__assign({}, def), { canClaim: recurringTaskStatus.completed, isClaimed: false, taskCompleted: recurringTaskStatus.completed, progress: recurringTaskStatus.progress, required: recurringTaskStatus.required })];
                            }
                        });
                    }); }))];
            case 2:
                enriched = _a.sent();
                return [2 /*return*/, reply.send({ success: true, data: enriched })];
            case 3:
                error_1 = _a.sent();
                logger_1.logger.error({ error: error_1 }, 'Error fetching public reward definitions');
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error' })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getPublicRewardDefinitions = getPublicRewardDefinitions;
/**
 * POST /app/rewards/claim/:id
 * User claims a specific reward definition.
 */
var claimRewardById = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var user, id, definition, twentyFourHoursAgo, lastClaim, nextClaimTime, existingClaim, taskStatus, coinsToAward, rewardType, _a, updatedUser, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 9, , 10]);
                user = request.user;
                if (!user)
                    return [2 /*return*/, reply.status(401).send({ success: false, message: 'Unauthorized' })];
                id = request.params.id;
                if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                    return [2 /*return*/, reply.status(400).send({ success: false, message: 'Invalid reward ID' })];
                }
                return [4 /*yield*/, RewardDefinition_1.RewardDefinitionModel.findById(id)];
            case 1:
                definition = _b.sent();
                if (!definition || !definition.isActive) {
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'Reward not found or inactive' })];
                }
                if (!(definition.type === 'daily_login')) return [3 /*break*/, 3];
                twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
                return [4 /*yield*/, Reward_1.RewardModel.findOne({
                        userId: user.id,
                        type: 'daily_login',
                        claimedAt: { $gte: twentyFourHoursAgo },
                    })];
            case 2:
                lastClaim = _b.sent();
                if (lastClaim) {
                    nextClaimTime = new Date(lastClaim.claimedAt.getTime() + 24 * 60 * 60 * 1000);
                    return [2 /*return*/, reply.status(400).send({
                            success: false,
                            message: 'Daily reward already claimed. Try again later.',
                            nextClaimTime: nextClaimTime,
                        })];
                }
                return [3 /*break*/, 6];
            case 3: return [4 /*yield*/, Reward_1.RewardModel.findOne({
                    userId: user.id,
                    rewardDefinitionId: definition._id,
                })];
            case 4:
                existingClaim = _b.sent();
                if (existingClaim) {
                    return [2 /*return*/, reply.status(400).send({ success: false, message: 'You have already claimed this reward.' })];
                }
                return [4 /*yield*/, checkTaskCompletion(user.id, definition)];
            case 5:
                taskStatus = _b.sent();
                if (!taskStatus.completed) {
                    return [2 /*return*/, reply.status(400).send({
                            success: false,
                            message: 'Complete the task before claiming this reward.',
                            progress: taskStatus.progress,
                            required: taskStatus.required,
                        })];
                }
                _b.label = 6;
            case 6:
                coinsToAward = definition.coinsReward;
                rewardType = definition.type === 'daily_login' ? 'daily_login' :
                    definition.type === 'signup' ? 'signup_bonus' : 'task_reward';
                return [4 /*yield*/, Promise.all([
                        Reward_1.RewardModel.create({
                            userId: user.id,
                            rewardDefinitionId: definition._id,
                            type: rewardType,
                            coinsAmount: coinsToAward,
                            claimedAt: new Date(),
                        }),
                        getModel(user.role).findByIdAndUpdate(user.id, { $inc: { walletBalance: coinsToAward } }, { returnDocument: 'after' }),
                    ])];
            case 7:
                _a = _b.sent(), updatedUser = _a[1];
                return [4 /*yield*/, Transaction_1.TransactionModel.create({
                        userId: user.id,
                        type: 'reward_claim',
                        amount: 0,
                        coins: coinsToAward,
                        referenceId: definition._id.toString(),
                        status: 'completed',
                    })];
            case 8:
                _b.sent();
                return [2 /*return*/, reply.send({
                        success: true,
                        message: "You earned ".concat(coinsToAward, " coins!"),
                        data: {
                            coinsAwarded: coinsToAward,
                            newBalance: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.walletBalance,
                        },
                    })];
            case 9:
                error_2 = _b.sent();
                logger_1.logger.error({ error: error_2 }, 'Error claiming reward by ID');
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error' })];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.claimRewardById = claimRewardById;
/**
 * POST /app/rewards/claim-daily
 * Legacy daily reward claim (kept for backward compatibility).
 */
var claimDailyReward = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var user, twentyFourHoursAgo, lastClaim, nextClaimTime, dailyDef, coinsToAward, dbUser, error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                user = request.user;
                if (!user)
                    return [2 /*return*/, reply.status(401).send({ success: false, message: 'Unauthorized' })];
                twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
                return [4 /*yield*/, Reward_1.RewardModel.findOne({
                        userId: user.id,
                        type: 'daily_login',
                        claimedAt: { $gte: twentyFourHoursAgo },
                    })];
            case 1:
                lastClaim = _b.sent();
                if (lastClaim) {
                    nextClaimTime = new Date(lastClaim.claimedAt.getTime() + 24 * 60 * 60 * 1000);
                    return [2 /*return*/, reply.status(400).send({
                            success: false,
                            message: 'Daily reward already claimed. Try again later.',
                            nextClaimTime: nextClaimTime,
                        })];
                }
                return [4 /*yield*/, RewardDefinition_1.RewardDefinitionModel.findOne({ type: 'daily_login', isActive: true })];
            case 2:
                dailyDef = _b.sent();
                coinsToAward = (_a = dailyDef === null || dailyDef === void 0 ? void 0 : dailyDef.coinsReward) !== null && _a !== void 0 ? _a : 50;
                return [4 /*yield*/, Reward_1.RewardModel.create({
                        userId: user.id,
                        rewardDefinitionId: dailyDef === null || dailyDef === void 0 ? void 0 : dailyDef._id,
                        type: 'daily_login',
                        coinsAmount: coinsToAward,
                        claimedAt: new Date(),
                    })];
            case 3:
                _b.sent();
                return [4 /*yield*/, getModel(user.role).findByIdAndUpdate(user.id, { $inc: { walletBalance: coinsToAward } }, { returnDocument: 'after' })];
            case 4:
                dbUser = _b.sent();
                return [4 /*yield*/, Transaction_1.TransactionModel.create({
                        userId: user.id,
                        type: 'daily_reward',
                        amount: 0,
                        coins: coinsToAward,
                        referenceId: 'daily_login',
                        status: 'completed',
                    })];
            case 5:
                _b.sent();
                return [2 /*return*/, reply.send({
                        success: true,
                        message: 'Daily reward claimed successfully!',
                        data: {
                            coinsAwarded: coinsToAward,
                            newBalance: dbUser === null || dbUser === void 0 ? void 0 : dbUser.walletBalance,
                        },
                    })];
            case 6:
                error_3 = _b.sent();
                logger_1.logger.error({ error: error_3 }, 'Error claiming daily reward');
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error' })];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.claimDailyReward = claimDailyReward;
/**
 * GET /app/rewards/status
 * Returns daily reward claim status (legacy endpoint).
 */
var getRewardStatus = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var user, twentyFourHoursAgo, lastClaim, canClaim, nextClaimTime, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                user = request.user;
                if (!user)
                    return [2 /*return*/, reply.status(401).send({ success: false, message: 'Unauthorized' })];
                twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
                return [4 /*yield*/, Reward_1.RewardModel.findOne({
                        userId: user.id,
                        type: 'daily_login',
                        claimedAt: { $gte: twentyFourHoursAgo },
                    })];
            case 1:
                lastClaim = _a.sent();
                canClaim = !lastClaim;
                nextClaimTime = lastClaim
                    ? new Date(lastClaim.claimedAt.getTime() + 24 * 60 * 60 * 1000)
                    : null;
                return [2 /*return*/, reply.send({ success: true, data: { canClaim: canClaim, nextClaimTime: nextClaimTime } })];
            case 2:
                error_4 = _a.sent();
                logger_1.logger.error({ error: error_4 }, 'Error getting reward status');
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error' })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getRewardStatus = getRewardStatus;
// ─── ADMIN-FACING ─────────────────────────────────────────────────────────────
/**
 * GET /admin/rewards
 * Returns all reward definitions (including inactive) for admin management.
 */
var getAdminRewardDefinitions = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var definitions, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, RewardDefinition_1.RewardDefinitionModel.find()
                        .sort({ order: 1, createdAt: -1 })
                        .lean()];
            case 1:
                definitions = _a.sent();
                return [2 /*return*/, reply.send({ success: true, data: definitions })];
            case 2:
                error_5 = _a.sent();
                logger_1.logger.error({ error: error_5 }, 'Error fetching admin reward definitions');
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error' })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAdminRewardDefinitions = getAdminRewardDefinitions;
/**
 * POST /admin/rewards
 * Create a new reward definition.
 */
var createRewardDefinition = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var data, definition, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = request.body;
                return [4 /*yield*/, RewardDefinition_1.RewardDefinitionModel.create(data)];
            case 1:
                definition = _a.sent();
                return [2 /*return*/, reply.status(201).send({ success: true, data: definition })];
            case 2:
                error_6 = _a.sent();
                logger_1.logger.error({ error: error_6 }, 'Error creating reward definition');
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error' })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createRewardDefinition = createRewardDefinition;
/**
 * PUT /admin/rewards/:id
 * Update an existing reward definition.
 */
var updateRewardDefinition = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, data, updated, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = request.params.id;
                data = request.body;
                return [4 /*yield*/, RewardDefinition_1.RewardDefinitionModel.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true })];
            case 1:
                updated = _a.sent();
                if (!updated)
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'Reward definition not found' })];
                return [2 /*return*/, reply.send({ success: true, data: updated })];
            case 2:
                error_7 = _a.sent();
                logger_1.logger.error({ error: error_7 }, 'Error updating reward definition');
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error' })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateRewardDefinition = updateRewardDefinition;
/**
 * DELETE /admin/rewards/:id
 * Delete a reward definition.
 */
var deleteRewardDefinition = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, deleted, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = request.params.id;
                return [4 /*yield*/, RewardDefinition_1.RewardDefinitionModel.findByIdAndDelete(id)];
            case 1:
                deleted = _a.sent();
                if (!deleted)
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'Reward definition not found' })];
                return [2 /*return*/, reply.send({ success: true, message: 'Reward definition deleted' })];
            case 2:
                error_8 = _a.sent();
                logger_1.logger.error({ error: error_8 }, 'Error deleting reward definition');
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error' })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteRewardDefinition = deleteRewardDefinition;
/**
 * GET /admin/rewards/:id/claims
 * Get all user claims for a specific reward definition (admin analytics).
 */
var getRewardClaims = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, page, limit, skip, _a, claims, total, error_9;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                id = request.params.id;
                page = parseInt(request.query.page || '1');
                limit = parseInt(request.query.limit || '20');
                skip = (page - 1) * limit;
                return [4 /*yield*/, Promise.all([
                        Reward_1.RewardModel.find({ rewardDefinitionId: id })
                            .populate('userId', 'name email')
                            .sort({ claimedAt: -1 })
                            .skip(skip)
                            .limit(limit)
                            .lean(),
                        Reward_1.RewardModel.countDocuments({ rewardDefinitionId: id }),
                    ])];
            case 1:
                _a = _b.sent(), claims = _a[0], total = _a[1];
                return [2 /*return*/, reply.send({
                        success: true,
                        data: claims,
                        pagination: { page: page, limit: limit, total: total, pages: Math.ceil(total / limit) },
                    })];
            case 2:
                error_9 = _b.sent();
                logger_1.logger.error({ error: error_9 }, 'Error fetching reward claims');
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error' })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getRewardClaims = getRewardClaims;
