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
exports.deleteCoinPackage = exports.updateCoinPackage = exports.createCoinPackage = exports.clearTransactions = exports.deleteTransaction = exports.verifyWalletRazorpayPayment = exports.createWalletRazorpayOrder = exports.getUnlockedEpisodes = exports.unlockEpisode = exports.topUpWallet = exports.getCoinPackages = exports.getWalletData = void 0;
var User_1 = require("../models/User");
var AdminUser_1 = require("../models/AdminUser");
var getModel = function (role) { return role === 'user' ? User_1.UserModel : AdminUser_1.AdminUserModel; };
var CoinPackage_1 = require("../models/CoinPackage");
var Transaction_1 = require("../models/Transaction");
var Episode_1 = require("../models/Episode");
var UnlockedEpisode_1 = require("../models/UnlockedEpisode");
var Settings_1 = require("../models/Settings");
var logger_1 = require("../lib/logger");
var razorpay_1 = __importDefault(require("razorpay"));
var crypto_1 = __importDefault(require("crypto"));
var getWalletData = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var user, dbUser, transactions, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                user = request.user;
                if (!user)
                    return [2 /*return*/, reply.status(401).send({ success: false, message: 'Unauthorized' })];
                return [4 /*yield*/, getModel(user.role).findById(user.id).select('walletBalance').lean()];
            case 1:
                dbUser = _a.sent();
                if (!dbUser)
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'User not found' })];
                return [4 /*yield*/, Transaction_1.TransactionModel.find({ userId: user.id })
                        .sort({ createdAt: -1 })
                        .limit(20)
                        .lean()];
            case 2:
                transactions = _a.sent();
                return [2 /*return*/, reply.send({
                        success: true,
                        data: {
                            balance: dbUser.walletBalance || 0,
                            transactions: transactions,
                        },
                    })];
            case 3:
                error_1 = _a.sent();
                logger_1.logger.error({ error: error_1 }, 'Error fetching wallet data');
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error' })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getWalletData = getWalletData;
var getCoinPackages = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var packages, settings, currencySymbol_1, dataWithCurrency, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, CoinPackage_1.CoinPackageModel.find({ isActive: true }).sort({ price: 1 }).lean()];
            case 1:
                packages = _a.sent();
                return [4 /*yield*/, Settings_1.SettingsModel.findOne().lean()];
            case 2:
                settings = _a.sent();
                currencySymbol_1 = (settings === null || settings === void 0 ? void 0 : settings.currencySymbol) || '₹';
                dataWithCurrency = packages.map(function (p) { return (__assign(__assign({}, p), { currencySymbol: currencySymbol_1 })); });
                return [2 /*return*/, reply.send({
                        success: true,
                        data: dataWithCurrency,
                    })];
            case 3:
                error_2 = _a.sent();
                logger_1.logger.error({ error: error_2 }, 'Error fetching coin packages');
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error' })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getCoinPackages = getCoinPackages;
var topUpWallet = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var user, packageId, coinPackage, totalCoinsToAdd, dbUser, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                user = request.user;
                if (!user)
                    return [2 /*return*/, reply.status(401).send({ success: false, message: 'Unauthorized' })];
                packageId = request.body.packageId;
                return [4 /*yield*/, CoinPackage_1.CoinPackageModel.findById(packageId)];
            case 1:
                coinPackage = _a.sent();
                if (!coinPackage || !coinPackage.isActive) {
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'Coin package not found or inactive' })];
                }
                totalCoinsToAdd = coinPackage.coins + coinPackage.bonusCoins;
                return [4 /*yield*/, getModel(user.role).findByIdAndUpdate(user.id, { $inc: { walletBalance: totalCoinsToAdd } }, { returnDocument: 'after' })];
            case 2:
                dbUser = _a.sent();
                return [4 /*yield*/, Transaction_1.TransactionModel.create({
                        userId: user.id,
                        type: 'coin_topup',
                        amount: coinPackage.price,
                        coins: totalCoinsToAdd,
                        referenceId: coinPackage._id.toString(),
                        status: 'completed',
                    })];
            case 3:
                _a.sent();
                return [2 /*return*/, reply.send({
                        success: true,
                        message: 'Wallet topped up successfully',
                        data: {
                            balance: dbUser === null || dbUser === void 0 ? void 0 : dbUser.walletBalance,
                        },
                    })];
            case 4:
                error_3 = _a.sent();
                logger_1.logger.error({ error: error_3 }, 'Error topping up wallet');
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error' })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.topUpWallet = topUpWallet;
var unlockEpisode = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var user, episodeId, episode, dbUser, hasActiveSubscription, alreadyUnlocked, cost, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                user = request.user;
                if (!user)
                    return [2 /*return*/, reply.status(401).send({ success: false, message: 'Unauthorized' })];
                episodeId = request.body.episodeId;
                return [4 /*yield*/, Episode_1.EpisodeModel.findById(episodeId)];
            case 1:
                episode = _a.sent();
                if (!episode)
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'Episode not found' })];
                if (episode.isFree) {
                    return [2 /*return*/, reply.send({ success: true, message: 'Episode is already free' })];
                }
                return [4 /*yield*/, getModel(user.role).findById(user.id)];
            case 2:
                dbUser = _a.sent();
                if (!dbUser)
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'User not found' })];
                hasActiveSubscription = dbUser.subscriptionStatus === 'active' &&
                    (!dbUser.subscriptionExpiry || dbUser.subscriptionExpiry > new Date());
                if (hasActiveSubscription) {
                    return [2 /*return*/, reply.send({ success: true, message: 'Unlocked via subscription' })];
                }
                return [4 /*yield*/, UnlockedEpisode_1.UnlockedEpisodeModel.findOne({ userId: user.id, episodeId: episodeId })];
            case 3:
                alreadyUnlocked = _a.sent();
                if (alreadyUnlocked) {
                    return [2 /*return*/, reply.send({ success: true, message: 'Episode already unlocked' })];
                }
                cost = episode.coinsRequired || 0;
                if (dbUser.walletBalance < cost) {
                    return [2 /*return*/, reply.status(400).send({ success: false, message: 'Insufficient coins' })];
                }
                // Deduct coins and unlock
                dbUser.walletBalance -= cost;
                return [4 /*yield*/, dbUser.save()];
            case 4:
                _a.sent();
                return [4 /*yield*/, UnlockedEpisode_1.UnlockedEpisodeModel.create({
                        userId: user.id,
                        episodeId: episodeId,
                    })];
            case 5:
                _a.sent();
                return [4 /*yield*/, Transaction_1.TransactionModel.create({
                        userId: user.id,
                        type: 'episode_unlock',
                        amount: 0,
                        coins: -cost,
                        referenceId: episodeId.toString(),
                        status: 'completed',
                    })];
            case 6:
                _a.sent();
                return [2 /*return*/, reply.send({
                        success: true,
                        message: 'Episode unlocked successfully',
                        data: {
                            balance: dbUser.walletBalance,
                        },
                    })];
            case 7:
                error_4 = _a.sent();
                logger_1.logger.error({ error: error_4 }, 'Error unlocking episode');
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error' })];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.unlockEpisode = unlockEpisode;
/**
 * GET /wallet/unlocked-episodes
 * Returns all episode IDs that the authenticated user has unlocked via coins.
 */
var getUnlockedEpisodes = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var user, unlocked, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                user = request.user;
                if (!user)
                    return [2 /*return*/, reply.status(401).send({ success: false, message: 'Unauthorized' })];
                return [4 /*yield*/, UnlockedEpisode_1.UnlockedEpisodeModel.find({ userId: user.id })
                        .select('episodeId unlockedAt')
                        .lean()];
            case 1:
                unlocked = _a.sent();
                return [2 /*return*/, reply.send({
                        success: true,
                        data: unlocked,
                    })];
            case 2:
                error_5 = _a.sent();
                logger_1.logger.error({ error: error_5 }, 'Error fetching unlocked episodes');
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error' })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getUnlockedEpisodes = getUnlockedEpisodes;
// --- RAZORPAY USER ROUTES ---
var createWalletRazorpayOrder = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var user, packageId, coinPackage, settings, instance, amountInPaise, order, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                user = request.user;
                if (!user)
                    return [2 /*return*/, reply.status(401).send({ success: false, message: 'Unauthorized' })];
                packageId = request.body.packageId;
                return [4 /*yield*/, CoinPackage_1.CoinPackageModel.findById(packageId)];
            case 1:
                coinPackage = _a.sent();
                if (!coinPackage || !coinPackage.isActive) {
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'Coin package not found or inactive' })];
                }
                return [4 /*yield*/, Settings_1.SettingsModel.findOne().lean()];
            case 2:
                settings = _a.sent();
                if (!(settings === null || settings === void 0 ? void 0 : settings.razorpayEnabled) || !(settings === null || settings === void 0 ? void 0 : settings.razorpayKeyId) || !(settings === null || settings === void 0 ? void 0 : settings.razorpayKeySecret)) {
                    return [2 /*return*/, reply.status(400).send({ success: false, error: 'Payment gateway is not configured. Please contact support.' })];
                }
                instance = new razorpay_1.default({
                    key_id: settings.razorpayKeyId,
                    key_secret: settings.razorpayKeySecret,
                });
                amountInPaise = Math.round(coinPackage.price * 100);
                return [4 /*yield*/, instance.orders.create({
                        amount: amountInPaise,
                        currency: settings.currencyCode || 'INR',
                        receipt: "wl_".concat(Date.now()).substring(0, 40),
                        notes: { packageId: packageId.toString(), userId: user.id },
                    })];
            case 3:
                order = _a.sent();
                return [2 /*return*/, reply.send({
                        success: true,
                        order: order,
                        keyId: settings.razorpayKeyId,
                        package: {
                            id: coinPackage._id,
                            coins: coinPackage.coins,
                            bonusCoins: coinPackage.bonusCoins,
                            price: coinPackage.price,
                            label: coinPackage.label,
                        },
                    })];
            case 4:
                error_6 = _a.sent();
                logger_1.logger.error({ error: error_6 }, 'Error creating wallet Razorpay order');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_6.message })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.createWalletRazorpayOrder = createWalletRazorpayOrder;
var verifyWalletRazorpayPayment = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var user, _a, razorpay_order_id, razorpay_payment_id, razorpay_signature, packageId, settings, text, generated_signature, coinPackage, totalCoinsToAdd, dbUser, error_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                user = request.user;
                if (!user)
                    return [2 /*return*/, reply.status(401).send({ success: false, message: 'Unauthorized' })];
                _a = request.body, razorpay_order_id = _a.razorpay_order_id, razorpay_payment_id = _a.razorpay_payment_id, razorpay_signature = _a.razorpay_signature, packageId = _a.packageId;
                if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !packageId) {
                    return [2 /*return*/, reply.status(400).send({ success: false, error: 'Missing payment verification details' })];
                }
                return [4 /*yield*/, Settings_1.SettingsModel.findOne().lean()];
            case 1:
                settings = _b.sent();
                if (!(settings === null || settings === void 0 ? void 0 : settings.razorpayEnabled) || !(settings === null || settings === void 0 ? void 0 : settings.razorpayKeySecret)) {
                    return [2 /*return*/, reply.status(400).send({ success: false, error: 'Payment gateway is not configured' })];
                }
                text = "".concat(razorpay_order_id, "|").concat(razorpay_payment_id);
                generated_signature = crypto_1.default
                    .createHmac('sha256', settings.razorpayKeySecret)
                    .update(text)
                    .digest('hex');
                if (generated_signature !== razorpay_signature) {
                    return [2 /*return*/, reply.status(400).send({ success: false, error: 'Invalid payment signature' })];
                }
                return [4 /*yield*/, CoinPackage_1.CoinPackageModel.findById(packageId)];
            case 2:
                coinPackage = _b.sent();
                if (!coinPackage || !coinPackage.isActive) {
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'Coin package not found' })];
                }
                totalCoinsToAdd = coinPackage.coins + coinPackage.bonusCoins;
                return [4 /*yield*/, getModel(user.role).findByIdAndUpdate(user.id, { $inc: { walletBalance: totalCoinsToAdd } }, { returnDocument: 'after' })];
            case 3:
                dbUser = _b.sent();
                return [4 /*yield*/, Transaction_1.TransactionModel.create({
                        userId: user.id,
                        type: 'coin_topup',
                        amount: coinPackage.price,
                        coins: totalCoinsToAdd,
                        referenceId: razorpay_payment_id,
                        status: 'completed',
                    })];
            case 4:
                _b.sent();
                return [2 /*return*/, reply.send({
                        success: true,
                        message: 'Payment verified and coins added successfully',
                        data: {
                            balance: dbUser === null || dbUser === void 0 ? void 0 : dbUser.walletBalance,
                            coinsAdded: totalCoinsToAdd,
                        },
                    })];
            case 5:
                error_7 = _b.sent();
                logger_1.logger.error({ error: error_7 }, 'Error verifying wallet Razorpay payment');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_7.message })];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.verifyWalletRazorpayPayment = verifyWalletRazorpayPayment;
var deleteTransaction = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var user, id, transaction, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                user = request.user;
                if (!user)
                    return [2 /*return*/, reply.status(401).send({ success: false, message: 'Unauthorized' })];
                id = request.params.id;
                return [4 /*yield*/, Transaction_1.TransactionModel.findOne({ _id: id, userId: user.id })];
            case 1:
                transaction = _a.sent();
                if (!transaction) {
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'Transaction not found' })];
                }
                return [4 /*yield*/, Transaction_1.TransactionModel.findByIdAndDelete(id)];
            case 2:
                _a.sent();
                return [2 /*return*/, reply.send({ success: true, message: 'Transaction deleted successfully' })];
            case 3:
                error_8 = _a.sent();
                logger_1.logger.error({ error: error_8 }, 'Error deleting transaction');
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error' })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteTransaction = deleteTransaction;
var clearTransactions = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var user, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                user = request.user;
                if (!user)
                    return [2 /*return*/, reply.status(401).send({ success: false, message: 'Unauthorized' })];
                return [4 /*yield*/, Transaction_1.TransactionModel.deleteMany({ userId: user.id })];
            case 1:
                _a.sent();
                return [2 /*return*/, reply.send({ success: true, message: 'All transactions cleared successfully' })];
            case 2:
                error_9 = _a.sent();
                logger_1.logger.error({ error: error_9 }, 'Error clearing transactions');
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error' })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.clearTransactions = clearTransactions;
// --- ADMIN ROUTES ---
var createCoinPackage = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var data, newPackage, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = request.body;
                return [4 /*yield*/, CoinPackage_1.CoinPackageModel.create(data)];
            case 1:
                newPackage = _a.sent();
                return [2 /*return*/, reply.send({ success: true, data: newPackage })];
            case 2:
                error_10 = _a.sent();
                logger_1.logger.error({ error: error_10 }, 'Error creating coin package');
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error' })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createCoinPackage = createCoinPackage;
var updateCoinPackage = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, data, updated, error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = request.params.id;
                data = request.body;
                return [4 /*yield*/, CoinPackage_1.CoinPackageModel.findByIdAndUpdate(id, data, { returnDocument: 'after' })];
            case 1:
                updated = _a.sent();
                if (!updated)
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'Package not found' })];
                return [2 /*return*/, reply.send({ success: true, data: updated })];
            case 2:
                error_11 = _a.sent();
                logger_1.logger.error({ error: error_11 }, 'Error updating coin package');
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error' })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateCoinPackage = updateCoinPackage;
var deleteCoinPackage = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, deleted, error_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = request.params.id;
                return [4 /*yield*/, CoinPackage_1.CoinPackageModel.findByIdAndDelete(id)];
            case 1:
                deleted = _a.sent();
                if (!deleted)
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'Package not found' })];
                return [2 /*return*/, reply.send({ success: true, message: 'Deleted successfully' })];
            case 2:
                error_12 = _a.sent();
                logger_1.logger.error({ error: error_12 }, 'Error deleting coin package');
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error' })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteCoinPackage = deleteCoinPackage;
