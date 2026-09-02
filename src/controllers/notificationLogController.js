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
exports.bulkDeleteNotificationLogs = exports.deleteNotificationLog = exports.createNotificationLog = exports.getNotificationLogById = exports.listNotificationLogs = void 0;
var AdminNotification_1 = require("../models/AdminNotification");
var listNotificationLogs = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var query, page, limit, typeFilter, filter, _a, notifications, total, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                query = request.query;
                page = Math.max(1, parseInt(query.page || '1', 10));
                limit = Math.min(100, Math.max(1, parseInt(query.limit || '20', 10)));
                typeFilter = query.type;
                filter = {};
                if (typeFilter && typeFilter !== 'all') {
                    filter.type = typeFilter;
                }
                return [4 /*yield*/, Promise.all([
                        AdminNotification_1.AdminNotificationModel.find(filter)
                            .sort({ createdAt: -1 })
                            .skip((page - 1) * limit)
                            .limit(limit)
                            .lean(),
                        AdminNotification_1.AdminNotificationModel.countDocuments(filter),
                    ])];
            case 1:
                _a = _b.sent(), notifications = _a[0], total = _a[1];
                return [2 /*return*/, reply.send({
                        success: true,
                        data: notifications.map(function (notification) { return ({
                            id: notification._id,
                            type: notification.type,
                            isHighlight: !notification.isRead,
                            title: notification.title,
                            text: notification.message,
                            userName: notification.modelName || 'System',
                            userEmail: notification.action ? notification.action.toUpperCase() : 'SYSTEM',
                            updatedAt: notification.createdAt,
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
exports.listNotificationLogs = listNotificationLogs;
var getNotificationLogById = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var notificationId, notification, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                notificationId = request.params.notificationId;
                return [4 /*yield*/, AdminNotification_1.AdminNotificationModel.findById(notificationId).lean()];
            case 1:
                notification = _a.sent();
                if (!notification) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Notification not found' })];
                }
                return [2 /*return*/, reply.send({
                        success: true,
                        data: {
                            id: notification._id,
                            type: notification.type,
                            isHighlight: !notification.isRead,
                            title: notification.title,
                            text: notification.message,
                            userName: notification.modelName || 'System',
                            userEmail: notification.action ? notification.action.toUpperCase() : 'SYSTEM',
                            createdAt: notification.createdAt,
                            updatedAt: notification.updatedAt,
                        },
                    })];
            case 2:
                error_2 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_2.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getNotificationLogById = getNotificationLogById;
var createNotificationLog = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var body, notification, error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                body = request.body;
                if (!body.type || !body.title || !body.text) {
                    return [2 /*return*/, reply.status(400).send({ success: false, error: 'Missing required fields' })];
                }
                return [4 /*yield*/, AdminNotification_1.AdminNotificationModel.create({
                        type: body.type,
                        title: body.title,
                        message: body.text,
                        modelName: body.userName,
                        action: (_a = body.userEmail) === null || _a === void 0 ? void 0 : _a.toLowerCase(),
                        isRead: !body.isHighlight,
                    })];
            case 1:
                notification = _b.sent();
                return [2 /*return*/, reply.status(201).send({
                        success: true,
                        data: {
                            id: notification._id,
                            type: notification.type,
                            isHighlight: !notification.isRead,
                            title: notification.title,
                            text: notification.message,
                            userName: notification.modelName,
                            userEmail: notification.action ? notification.action.toUpperCase() : 'SYSTEM',
                            createdAt: notification.createdAt,
                            updatedAt: notification.updatedAt,
                        },
                    })];
            case 2:
                error_3 = _b.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_3.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createNotificationLog = createNotificationLog;
var deleteNotificationLog = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var notificationId, notification, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                notificationId = request.params.notificationId;
                return [4 /*yield*/, AdminNotification_1.AdminNotificationModel.findByIdAndDelete(notificationId)];
            case 1:
                notification = _a.sent();
                if (!notification) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'Notification not found' })];
                }
                return [2 /*return*/, reply.send({
                        success: true,
                        message: 'Notification deleted successfully',
                    })];
            case 2:
                error_4 = _a.sent();
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_4.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteNotificationLog = deleteNotificationLog;
var bulkDeleteNotificationLogs = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var ids, result, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                ids = request.body.ids;
                if (!Array.isArray(ids) || ids.length === 0) {
                    return [2 /*return*/, reply.status(400).send({ success: false, message: 'Invalid or empty ids array' })];
                }
                return [4 /*yield*/, AdminNotification_1.AdminNotificationModel.deleteMany({ _id: { $in: ids } })];
            case 1:
                result = _a.sent();
                return [2 /*return*/, reply.send({
                        success: true,
                        message: "".concat(result.deletedCount, " notifications deleted successfully"),
                        deletedCount: result.deletedCount,
                    })];
            case 2:
                error_5 = _a.sent();
                console.error('Error bulk deleting notifications:', error_5);
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error', error: error_5.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.bulkDeleteNotificationLogs = bulkDeleteNotificationLogs;
