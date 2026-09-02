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
exports.getAdAnalytics = exports.recordAdInteraction = exports.getActiveAds = exports.bulkDeleteAds = exports.deleteAd = exports.updateAd = exports.createAd = exports.getAds = void 0;
var Ad_1 = require("../models/Ad");
// --- Admin Endpoints ---
var getAds = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var query, filter, ads, mappedAds, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                query = request.query;
                filter = {};
                if (query.status)
                    filter.status = query.status;
                if (query.adType)
                    filter.adType = query.adType;
                if (query.placement)
                    filter.placement = query.placement;
                return [4 /*yield*/, Ad_1.AdModel.find(filter).sort({ createdAt: -1 }).lean()];
            case 1:
                ads = _a.sent();
                mappedAds = ads;
                return [2 /*return*/, reply.send({ success: true, data: mappedAds })];
            case 2:
                error_1 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_1.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAds = getAds;
var createAd = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var adData, ad, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                adData = request.body;
                return [4 /*yield*/, Ad_1.AdModel.create(adData)];
            case 1:
                ad = _a.sent();
                return [2 /*return*/, reply.status(201).send({ success: true, data: ad })];
            case 2:
                error_2 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_2.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createAd = createAd;
var updateAd = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, updates, ad, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = request.params.id;
                updates = request.body;
                return [4 /*yield*/, Ad_1.AdModel.findByIdAndUpdate(id, updates, { returnDocument: 'after' })];
            case 1:
                ad = _a.sent();
                if (!ad)
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'Ad not found' })];
                return [2 /*return*/, reply.send({ success: true, data: ad })];
            case 2:
                error_3 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_3.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateAd = updateAd;
var deleteAd = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, ad, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = request.params.id;
                return [4 /*yield*/, Ad_1.AdModel.findByIdAndDelete(id)];
            case 1:
                ad = _a.sent();
                if (!ad)
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'Ad not found' })];
                return [2 /*return*/, reply.send({ success: true, message: 'Ad deleted successfully' })];
            case 2:
                error_4 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_4.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteAd = deleteAd;
var bulkDeleteAds = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var ids, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                ids = request.body.ids;
                if (!ids || !Array.isArray(ids)) {
                    return [2 /*return*/, reply.status(400).send({ success: false, message: 'Invalid IDs provided' })];
                }
                return [4 /*yield*/, Ad_1.AdModel.deleteMany({ _id: { $in: ids } })];
            case 1:
                _a.sent();
                return [2 /*return*/, reply.send({ success: true, message: 'Ads deleted successfully' })];
            case 2:
                error_5 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_5.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.bulkDeleteAds = bulkDeleteAds;
// --- Frontend / App Endpoints ---
var getActiveAds = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var query, now, filter, ads, adIds, mappedAds, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                query = request.query;
                now = new Date();
                filter = {
                    status: 'active',
                    startDate: { $lte: now },
                    endDate: { $gte: now }
                };
                // Specific UI Targeting
                if (query.placement)
                    filter.placement = query.placement;
                if (query.targetContentType)
                    filter.targetContentType = query.targetContentType;
                // Match specific tags (e.g. 'Operation Viper') if passed by the frontend
                if (query.targetCategory) {
                    filter.targetCategories = query.targetCategory;
                }
                return [4 /*yield*/, Ad_1.AdModel.find(filter).select('-clicks -impressions -status -createdAt -updatedAt -__v').lean()];
            case 1:
                ads = _a.sent();
                // Automatically increment impressions for returned ads (in background)
                if (ads.length > 0) {
                    adIds = ads.map(function (a) { return a._id; });
                    Ad_1.AdModel.updateMany({ _id: { $in: adIds } }, { $inc: { impressions: 1 } }).exec();
                }
                mappedAds = ads;
                return [2 /*return*/, reply.send({ success: true, data: mappedAds })];
            case 2:
                error_6 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_6.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getActiveAds = getActiveAds;
var recordAdInteraction = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, body, update, ad, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = request.params.id;
                body = request.body;
                if (!['click', 'impression'].includes(body.action)) {
                    return [2 /*return*/, reply.status(400).send({ success: false, message: 'Invalid action' })];
                }
                update = body.action === 'click' ? { $inc: { clicks: 1 } } : { $inc: { impressions: 1 } };
                return [4 /*yield*/, Ad_1.AdModel.findByIdAndUpdate(id, update)];
            case 1:
                ad = _a.sent();
                if (!ad)
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'Ad not found' })];
                return [2 /*return*/, reply.send({ success: true, message: 'Interaction recorded' })];
            case 2:
                error_7 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_7.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.recordAdInteraction = recordAdInteraction;
// --- Ad Analytics Endpoint ---
var getAdAnalytics = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var now_1, ads, totalImpressions, totalClicks, ctr, activeAds, byType, _i, ads_1, ad, t, byPlacement, _a, ads_2, ad, p, topAds, error_8;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                now_1 = new Date();
                return [4 /*yield*/, Ad_1.AdModel.find({}).select('adName adType placement status impressions clicks startDate endDate').lean()];
            case 1:
                ads = _b.sent();
                totalImpressions = ads.reduce(function (sum, a) { return sum + (a.impressions || 0); }, 0);
                totalClicks = ads.reduce(function (sum, a) { return sum + (a.clicks || 0); }, 0);
                ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100) : 0;
                activeAds = ads.filter(function (a) { return a.status === 'active' && new Date(a.startDate) <= now_1 && new Date(a.endDate) >= now_1; });
                byType = {};
                for (_i = 0, ads_1 = ads; _i < ads_1.length; _i++) {
                    ad = ads_1[_i];
                    t = ad.adType || 'Custom';
                    if (!byType[t])
                        byType[t] = { impressions: 0, clicks: 0, count: 0 };
                    byType[t].impressions += ad.impressions || 0;
                    byType[t].clicks += ad.clicks || 0;
                    byType[t].count += 1;
                }
                byPlacement = {};
                for (_a = 0, ads_2 = ads; _a < ads_2.length; _a++) {
                    ad = ads_2[_a];
                    p = ad.placement || 'Unknown';
                    if (!byPlacement[p])
                        byPlacement[p] = { impressions: 0, clicks: 0, count: 0 };
                    byPlacement[p].impressions += ad.impressions || 0;
                    byPlacement[p].clicks += ad.clicks || 0;
                    byPlacement[p].count += 1;
                }
                topAds = __spreadArray([], ads, true).sort(function (a, b) { return (b.impressions || 0) - (a.impressions || 0); })
                    .slice(0, 5)
                    .map(function (a) { return ({
                    id: a._id,
                    adName: a.adName,
                    adType: a.adType,
                    placement: a.placement,
                    impressions: a.impressions || 0,
                    clicks: a.clicks || 0,
                    ctr: (a.impressions || 0) > 0 ? (((a.clicks || 0) / (a.impressions || 0)) * 100).toFixed(2) : '0.00',
                }); });
                return [2 /*return*/, reply.send({
                        success: true,
                        data: {
                            totalAds: ads.length,
                            activeAds: activeAds.length,
                            totalImpressions: totalImpressions,
                            totalClicks: totalClicks,
                            ctr: ctr.toFixed(2),
                            byType: byType,
                            byPlacement: byPlacement,
                            topAds: topAds,
                        }
                    })];
            case 2:
                error_8 = _b.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_8.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAdAnalytics = getAdAnalytics;
