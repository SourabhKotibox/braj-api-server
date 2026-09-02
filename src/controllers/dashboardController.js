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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
exports.getTransactions = exports.getReviews = exports.getTopGenresData = exports.getMostWatchedData = exports.getNewSubscribersData = exports.getRevenueData = exports.getDashboardStats = void 0;
var User_1 = require("../models/User");
var Subscription_1 = require("../models/Subscription");
var Transaction_1 = require("../models/Transaction");
var Content_1 = require("../models/Content");
var Movie_1 = require("../models/Movie");
var Genre_1 = require("../models/Genre");
var UserWatchProgress_1 = require("../models/UserWatchProgress");
var Review_1 = require("../models/Review");
var Settings_1 = require("../models/Settings");
// Helper to determine date range
var getDateFilter = function (query) {
    var period = query.period, startDate = query.startDate, endDate = query.endDate;
    if (startDate && endDate) {
        return {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
        };
    }
    var now = new Date();
    var start = new Date();
    if (period === 'week') {
        start.setDate(now.getDate() - 7);
    }
    else if (period === 'month') {
        start.setMonth(now.getMonth() - 1);
    }
    else {
        // Default to year
        start.setFullYear(now.getFullYear() - 1);
    }
    return {
        $gte: start,
        $lte: now,
    };
};
var getGroupingFormat = function (dateFilter) {
    var start = dateFilter.$gte.getTime();
    var end = dateFilter.$lte.getTime();
    var days = (end - start) / (1000 * 60 * 60 * 24);
    if (days <= 31) {
        return { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
    }
    else {
        return { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
    }
};
var getDashboardStats = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var query, dateFilter, _a, totalUsers, activeSubscriptions, totalContent, totalMovies, totalWalletTransactions, soonToExpire, _b, totalSubscriptionRevenue, coinRevenueResult, subscriptionRevenue, totalCoinRevenue, totalCoinTransactions, totalRevenue, totalReviews, settings, symbol_1, position_1, decimals_1, formatValue, error_1;
    var _c, _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                _g.trys.push([0, 6, , 7]);
                query = request.query;
                dateFilter = getDateFilter(query);
                return [4 /*yield*/, Promise.all([
                        User_1.UserModel.countDocuments(),
                        Subscription_1.SubscriptionModel.countDocuments({ status: 'active' }),
                        Content_1.ContentModel.countDocuments(),
                        Movie_1.MovieModel.countDocuments(),
                        Transaction_1.TransactionModel.countDocuments(),
                    ])];
            case 1:
                _a = _g.sent(), totalUsers = _a[0], activeSubscriptions = _a[1], totalContent = _a[2], totalMovies = _a[3], totalWalletTransactions = _a[4];
                return [4 /*yield*/, Subscription_1.SubscriptionModel.countDocuments({
                        endDate: {
                            $gte: new Date(),
                            $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                        },
                    })];
            case 2:
                soonToExpire = _g.sent();
                return [4 /*yield*/, Promise.all([
                        Subscription_1.SubscriptionModel.aggregate([
                            { $match: { status: 'active' } },
                            { $group: { _id: null, total: { $sum: '$totalAmount' } } },
                        ]),
                        Transaction_1.TransactionModel.aggregate([
                            { $match: { type: 'coin_topup', status: 'completed' } },
                            { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
                        ]),
                    ])];
            case 3:
                _b = _g.sent(), totalSubscriptionRevenue = _b[0], coinRevenueResult = _b[1];
                subscriptionRevenue = ((_c = totalSubscriptionRevenue[0]) === null || _c === void 0 ? void 0 : _c.total) || 0;
                totalCoinRevenue = ((_d = coinRevenueResult[0]) === null || _d === void 0 ? void 0 : _d.total) || 0;
                totalCoinTransactions = ((_e = coinRevenueResult[0]) === null || _e === void 0 ? void 0 : _e.count) || 0;
                totalRevenue = subscriptionRevenue + totalCoinRevenue;
                return [4 /*yield*/, Review_1.ReviewModel.countDocuments()];
            case 4:
                totalReviews = _g.sent();
                return [4 /*yield*/, Settings_1.SettingsModel.findOne().lean()];
            case 5:
                settings = _g.sent();
                symbol_1 = (settings === null || settings === void 0 ? void 0 : settings.currencySymbol) || '₹';
                position_1 = (settings === null || settings === void 0 ? void 0 : settings.currencyPosition) || 'before';
                decimals_1 = (_f = settings === null || settings === void 0 ? void 0 : settings.decimalPlaces) !== null && _f !== void 0 ? _f : 2;
                formatValue = function (val) { return position_1 === 'before' ? "".concat(symbol_1).concat(val.toFixed(decimals_1)) : "".concat(val.toFixed(decimals_1), " ").concat(symbol_1); };
                return [2 /*return*/, reply.send({
                        success: true,
                        data: {
                            totalUsers: totalUsers,
                            totalSubscribers: activeSubscriptions,
                            soonToExpire: soonToExpire,
                            totalReviews: totalReviews,
                            totalStorageUsage: 'Dynamic MB', // Placeholder for actual S3 calculation if needed
                            restContent: totalContent + totalMovies,
                            subscriptionRevenue: formatValue(subscriptionRevenue),
                            coinRevenue: formatValue(totalCoinRevenue),
                            rentRevenue: formatValue(0), // Update if implementing rentals
                            totalRevenue: formatValue(totalRevenue),
                            totalCoinTransactions: totalCoinTransactions,
                            totalWalletTransactions: totalWalletTransactions,
                        },
                    })];
            case 6:
                error_1 = _g.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_1.message })];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.getDashboardStats = getDashboardStats;
var getRevenueData = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var query, dateFilter, groupFormat, revenueByPeriod, revenueData, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                query = request.query;
                dateFilter = getDateFilter(query);
                groupFormat = getGroupingFormat(dateFilter);
                return [4 /*yield*/, Subscription_1.SubscriptionModel.aggregate([
                        { $match: { createdAt: dateFilter, status: 'active' } },
                        { $group: { _id: groupFormat, total: { $sum: '$totalAmount' } } },
                        { $sort: { _id: 1 } }
                    ])];
            case 1:
                revenueByPeriod = _a.sent();
                revenueData = revenueByPeriod.map(function (r) { return ({
                    name: r._id,
                    value: r.total,
                }); });
                return [2 /*return*/, reply.send({ success: true, data: revenueData })];
            case 2:
                error_2 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_2.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getRevenueData = getRevenueData;
var getNewSubscribersData = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var query, dateFilter, groupFormat, subscribersByPeriod, formattedData, _i, subscribersByPeriod_1, sub, date, plan, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                query = request.query;
                dateFilter = getDateFilter(query);
                groupFormat = getGroupingFormat(dateFilter);
                return [4 /*yield*/, Subscription_1.SubscriptionModel.aggregate([
                        { $match: { createdAt: dateFilter } },
                        {
                            $group: {
                                _id: { date: groupFormat, plan: '$plan' },
                                count: { $sum: 1 }
                            }
                        },
                        { $sort: { '_id.date': 1 } }
                    ])];
            case 1:
                subscribersByPeriod = _a.sent();
                formattedData = {};
                for (_i = 0, subscribersByPeriod_1 = subscribersByPeriod; _i < subscribersByPeriod_1.length; _i++) {
                    sub = subscribersByPeriod_1[_i];
                    date = sub._id.date;
                    plan = String(sub._id.plan).toLowerCase().includes('premium') ? 'premium' : 'basic';
                    if (!formattedData[date])
                        formattedData[date] = { name: date, basic: 0, premium: 0 };
                    formattedData[date][plan] += sub.count;
                }
                return [2 /*return*/, reply.send({
                        success: true,
                        data: Object.values(formattedData),
                    })];
            case 2:
                error_3 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_3.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getNewSubscribersData = getNewSubscribersData;
var getMostWatchedData = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var query, dateFilter, dateFilterForWatch, start, end, days, groupFormat, watchData, formattedData, _i, watchData_1, wd, date, type, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                query = request.query;
                dateFilter = getDateFilter(query);
                dateFilterForWatch = {
                    $gte: dateFilter.$gte,
                    $lte: dateFilter.$lte
                };
                start = dateFilter.$gte.getTime();
                end = dateFilter.$lte.getTime();
                days = (end - start) / (1000 * 60 * 60 * 24);
                groupFormat = days <= 31
                    ? { $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' } }
                    : { $dateToString: { format: '%Y-%m', date: '$updatedAt' } };
                return [4 /*yield*/, UserWatchProgress_1.UserWatchProgressModel.aggregate([
                        { $match: { updatedAt: dateFilterForWatch } },
                        {
                            $group: {
                                _id: { date: groupFormat, type: '$contentModelType' },
                                count: { $sum: 1 }
                            }
                        },
                        { $sort: { '_id.date': 1 } }
                    ])];
            case 1:
                watchData = _a.sent();
                formattedData = {};
                for (_i = 0, watchData_1 = watchData; _i < watchData_1.length; _i++) {
                    wd = watchData_1[_i];
                    date = wd._id.date;
                    type = wd._id.type === 'Movie' ? 'movies' : 'tvShows';
                    if (!formattedData[date])
                        formattedData[date] = { name: date, movies: 0, tvShows: 0 };
                    formattedData[date][type] += wd.count;
                }
                return [2 /*return*/, reply.send({
                        success: true,
                        data: Object.values(formattedData),
                    })];
            case 2:
                error_4 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_4.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getMostWatchedData = getMostWatchedData;
var getTopGenresData = function (_request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var genres, movies, contents, genreViews_1, _i, _a, m, _b, _c, gId, idStr, topGenresData, error_5;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 4, , 5]);
                return [4 /*yield*/, Genre_1.GenreModel.find().lean()];
            case 1:
                genres = _d.sent();
                return [4 /*yield*/, Movie_1.MovieModel.find({ status: 'published' }).select('genres views').lean()];
            case 2:
                movies = _d.sent();
                return [4 /*yield*/, Content_1.ContentModel.find({ status: 'published' }).select('genres views').lean()];
            case 3:
                contents = _d.sent();
                genreViews_1 = {};
                for (_i = 0, _a = __spreadArray(__spreadArray([], movies, true), contents, true); _i < _a.length; _i++) {
                    m = _a[_i];
                    for (_b = 0, _c = m.genres || []; _b < _c.length; _b++) {
                        gId = _c[_b];
                        idStr = gId.toString();
                        genreViews_1[idStr] = (genreViews_1[idStr] || 0) + (m.views || 0);
                    }
                }
                topGenresData = genres.map(function (g) { return ({
                    name: g.name,
                    value: genreViews_1[g._id.toString()] || 0
                }); }).sort(function (a, b) { return b.value - a.value; }).slice(0, 5);
                // If all views are zero, return empty array so chart shows empty state
                if (topGenresData.every(function (g) { return g.value === 0; })) {
                    return [2 /*return*/, reply.send({
                            success: true,
                            data: []
                        })];
                }
                return [2 /*return*/, reply.send({
                        success: true,
                        data: topGenresData,
                    })];
            case 4:
                error_5 = _d.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_5.message })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getTopGenresData = getTopGenresData;
var getReviews = function (_request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var reviews, reviewsData, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Review_1.ReviewModel.find({ status: 'published' })
                        .sort({ createdAt: -1 })
                        .limit(6)
                        .populate('userId', 'name avatar')
                        .lean()];
            case 1:
                reviews = _a.sent();
                reviewsData = reviews.map(function (r) {
                    var _a, _b;
                    return ({
                        name: ((_a = r.userId) === null || _a === void 0 ? void 0 : _a.name) || 'Anonymous User',
                        date: new Date(r.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
                        category: r.contentModelType === 'Movie' ? 'Movies' : 'TV Shows',
                        rating: r.rating,
                        avatar: ((_b = r.userId) === null || _b === void 0 ? void 0 : _b.name) ? r.userId.name.charAt(0).toUpperCase() : 'U',
                        comment: r.comment
                    });
                });
                return [2 /*return*/, reply.send({
                        success: true,
                        data: reviewsData,
                    })];
            case 2:
                error_6 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_6.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getReviews = getReviews;
var getTransactions = function (_request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var settings, symbol_2, position_2, decimals_2, formatValue_1, _a, subscriptions, coinTransactions, subscriptionRows, coinRows, merged, error_7;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                return [4 /*yield*/, Settings_1.SettingsModel.findOne().lean()];
            case 1:
                settings = _c.sent();
                symbol_2 = (settings === null || settings === void 0 ? void 0 : settings.currencySymbol) || '₹';
                position_2 = (settings === null || settings === void 0 ? void 0 : settings.currencyPosition) || 'before';
                decimals_2 = (_b = settings === null || settings === void 0 ? void 0 : settings.decimalPlaces) !== null && _b !== void 0 ? _b : 2;
                formatValue_1 = function (val) { return position_2 === 'before' ? "".concat(symbol_2).concat(val.toFixed(decimals_2)) : "".concat(val.toFixed(decimals_2), " ").concat(symbol_2); };
                return [4 /*yield*/, Promise.all([
                        Subscription_1.SubscriptionModel.find()
                            .sort({ createdAt: -1 })
                            .limit(10)
                            .populate('userId', 'name')
                            .lean(),
                        Transaction_1.TransactionModel.find({ type: { $in: ['coin_topup'] } })
                            .sort({ createdAt: -1 })
                            .limit(10)
                            .populate('userId', 'name')
                            .lean(),
                    ])];
            case 2:
                _a = _c.sent(), subscriptions = _a[0], coinTransactions = _a[1];
                subscriptionRows = subscriptions.map(function (t) {
                    var _a, _b;
                    return ({
                        name: ((_a = t.userId) === null || _a === void 0 ? void 0 : _a.name) || 'Deleted User',
                        date: new Date(t.createdAt).toISOString().split('T')[0],
                        type: 'subscription',
                        plan: t.plan,
                        amount: formatValue_1(t.totalAmount || 0),
                        method: t.paymentMethod || '-',
                        avatar: ((_b = t.userId) === null || _b === void 0 ? void 0 : _b.name) ? t.userId.name.charAt(0).toUpperCase() : 'D',
                        _createdAt: new Date(t.createdAt).getTime(),
                    });
                });
                coinRows = coinTransactions.map(function (t) {
                    var _a, _b;
                    return ({
                        name: ((_a = t.userId) === null || _a === void 0 ? void 0 : _a.name) || 'Deleted User',
                        date: new Date(t.createdAt).toISOString().split('T')[0],
                        type: 'coin_purchase',
                        plan: "".concat(t.coins, " Coins"),
                        amount: formatValue_1(t.amount || 0),
                        method: 'Razorpay',
                        avatar: ((_b = t.userId) === null || _b === void 0 ? void 0 : _b.name) ? t.userId.name.charAt(0).toUpperCase() : 'D',
                        _createdAt: new Date(t.createdAt).getTime(),
                    });
                });
                merged = __spreadArray(__spreadArray([], subscriptionRows, true), coinRows, true).sort(function (a, b) { return b._createdAt - a._createdAt; })
                    .slice(0, 15)
                    .map(function (_a) {
                    var _createdAt = _a._createdAt, rest = __rest(_a, ["_createdAt"]);
                    return rest;
                });
                return [2 /*return*/, reply.send({
                        success: true,
                        data: merged,
                    })];
            case 3:
                error_7 = _c.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_7.message })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getTransactions = getTransactions;
