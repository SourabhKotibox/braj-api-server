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
exports.deleteReviewApp = exports.createReviewApp = exports.getReviewsApp = exports.deleteReviewAdmin = exports.updateReviewStatus = exports.getReviewsAdmin = void 0;
var Review_1 = require("../models/Review");
// --- Admin Endpoints ---
var getReviewsAdmin = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var query, page, limit, skip, filter, _a, reviews, total, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                query = request.query;
                page = parseInt(query.page) || 1;
                limit = parseInt(query.limit) || 20;
                skip = (page - 1) * limit;
                filter = {};
                if (query.status)
                    filter.status = query.status;
                if (query.userId)
                    filter.userId = query.userId;
                return [4 /*yield*/, Promise.all([
                        Review_1.ReviewModel.find(filter)
                            .populate('userId', 'name email avatar')
                            .sort({ createdAt: -1 })
                            .skip(skip)
                            .limit(limit)
                            .lean(),
                        Review_1.ReviewModel.countDocuments(filter),
                    ])];
            case 1:
                _a = _b.sent(), reviews = _a[0], total = _a[1];
                return [2 /*return*/, reply.send({
                        success: true,
                        data: reviews,
                        pagination: {
                            total: total,
                            page: page,
                            limit: limit,
                            totalPages: Math.ceil(total / limit),
                        },
                    })];
            case 2:
                error_1 = _b.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_1.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getReviewsAdmin = getReviewsAdmin;
var updateReviewStatus = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, status_1, review, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = request.params.id;
                status_1 = request.body.status;
                if (!['published', 'hidden'].includes(status_1)) {
                    return [2 /*return*/, reply.status(400).send({ success: false, error: 'Invalid status' })];
                }
                return [4 /*yield*/, Review_1.ReviewModel.findByIdAndUpdate(id, { status: status_1 }, { returnDocument: 'after' })];
            case 1:
                review = _a.sent();
                if (!review)
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Review not found' })];
                return [2 /*return*/, reply.send({ success: true, data: review })];
            case 2:
                error_2 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_2.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateReviewStatus = updateReviewStatus;
var deleteReviewAdmin = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, review, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = request.params.id;
                return [4 /*yield*/, Review_1.ReviewModel.findByIdAndDelete(id)];
            case 1:
                review = _a.sent();
                if (!review)
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Review not found' })];
                return [2 /*return*/, reply.send({ success: true, message: 'Review deleted successfully' })];
            case 2:
                error_3 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_3.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteReviewAdmin = deleteReviewAdmin;
// --- App (Frontend) Endpoints ---
var getReviewsApp = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var query, page, limit, skip, filter, _a, reviews, total, agg, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                query = request.query;
                page = parseInt(query.page) || 1;
                limit = parseInt(query.limit) || 10;
                skip = (page - 1) * limit;
                filter = { status: 'published' };
                return [4 /*yield*/, Promise.all([
                        Review_1.ReviewModel.find(filter)
                            .populate('userId', 'name avatar')
                            .sort({ createdAt: -1 })
                            .skip(skip)
                            .limit(limit)
                            .lean(),
                        Review_1.ReviewModel.countDocuments(filter),
                    ])];
            case 1:
                _a = _b.sent(), reviews = _a[0], total = _a[1];
                return [4 /*yield*/, Review_1.ReviewModel.aggregate([
                        { $match: { status: 'published' } },
                        { $group: { _id: null, averageRating: { $avg: '$rating' }, totalReviews: { $sum: 1 } } }
                    ])];
            case 2:
                agg = _b.sent();
                return [2 /*return*/, reply.send({
                        success: true,
                        data: reviews,
                        stats: agg[0] || { averageRating: 0, totalReviews: 0 },
                        pagination: {
                            total: total,
                            page: page,
                            limit: limit,
                            totalPages: Math.ceil(total / limit),
                        },
                    })];
            case 3:
                error_4 = _b.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_4.message })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getReviewsApp = getReviewsApp;
var createReviewApp = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var user, _a, rating, comment, existing, review, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                user = request.user;
                _a = request.body, rating = _a.rating, comment = _a.comment;
                if (!rating) {
                    return [2 /*return*/, reply.status(400).send({ success: false, error: 'Missing required fields' })];
                }
                return [4 /*yield*/, Review_1.ReviewModel.findOne({ userId: user.id })];
            case 1:
                existing = _b.sent();
                if (existing) {
                    return [2 /*return*/, reply.status(400).send({ success: false, error: 'You have already reviewed the website' })];
                }
                return [4 /*yield*/, Review_1.ReviewModel.create({
                        userId: user.id,
                        rating: rating,
                        comment: comment,
                        status: 'published',
                    })];
            case 2:
                review = _b.sent();
                return [2 /*return*/, reply.status(201).send({ success: true, data: review })];
            case 3:
                error_5 = _b.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_5.message })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.createReviewApp = createReviewApp;
var deleteReviewApp = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var user, id, review, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                user = request.user;
                id = request.params.id;
                return [4 /*yield*/, Review_1.ReviewModel.findOneAndDelete({ _id: id, userId: user.id })];
            case 1:
                review = _a.sent();
                if (!review)
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Review not found or unauthorized' })];
                return [2 /*return*/, reply.send({ success: true, message: 'Review deleted successfully' })];
            case 2:
                error_6 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_6.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteReviewApp = deleteReviewApp;
