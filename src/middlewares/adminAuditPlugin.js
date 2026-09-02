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
exports.adminAuditPlugin = void 0;
var AdminNotification_1 = require("../models/AdminNotification");
var context_1 = require("../lib/context");
var adminAuditPlugin = function (schema) {
    schema.pre('save', function () {
        this.$locals.wasNew = this.isNew;
    });
    schema.post('save', function (doc) {
        return __awaiter(this, void 0, void 0, function () {
            var modelName, identifier, isNew, type, title, action, messageDetails, modifiedPaths, store, creatorName, actionVerb, err_1;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 2, , 3]);
                        modelName = doc.constructor.modelName || 'Document';
                        identifier = doc.title || doc.name || doc.email || doc.phone || ((_a = doc._id) === null || _a === void 0 ? void 0 : _a.toString());
                        isNew = ((_b = doc.$locals) === null || _b === void 0 ? void 0 : _b.wasNew) !== false;
                        type = 'content_created';
                        title = "New ".concat(modelName, " Created");
                        action = 'created';
                        messageDetails = '';
                        if (!isNew) {
                            type = 'content_updated';
                            title = "".concat(modelName, " Updated");
                            action = 'updated';
                            modifiedPaths = doc.modifiedPaths ? doc.modifiedPaths().filter(function (p) { return !['updatedAt', 'createdAt'].includes(p); }) : [];
                            if (modifiedPaths.length > 0) {
                                messageDetails = " (Modified: ".concat(modifiedPaths.join(', '), ")");
                                if (modifiedPaths.includes('status'))
                                    messageDetails = " (Status changed to ".concat(doc.status, ")");
                                else if (modifiedPaths.includes('subscriptionPlan'))
                                    messageDetails = " (Plan changed to ".concat(doc.subscriptionPlan, ")");
                                else if (modifiedPaths.includes('role'))
                                    messageDetails = " (Role changed to ".concat(doc.role, ")");
                            }
                        }
                        else {
                            if (modelName === 'User' || modelName === 'AdminUser') {
                                type = 'user_registered';
                                title = "New ".concat(modelName === 'User' ? 'App User' : 'Admin', " Registered");
                            }
                        }
                        store = context_1.requestContext.getStore();
                        creatorName = ((_c = store === null || store === void 0 ? void 0 : store.user) === null || _c === void 0 ? void 0 : _c.name) || ((_d = store === null || store === void 0 ? void 0 : store.user) === null || _d === void 0 ? void 0 : _d.email) || 'System';
                        actionVerb = isNew ? 'created' : 'updated';
                        return [4 /*yield*/, AdminNotification_1.AdminNotificationModel.create({
                                title: title,
                                message: "".concat(modelName, " \"").concat(identifier, "\" was ").concat(actionVerb, " by ").concat(creatorName, ".").concat(messageDetails),
                                type: type,
                                modelName: modelName,
                                action: action,
                            })];
                    case 1:
                        _e.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _e.sent();
                        console.error('Audit plugin error on save:', err_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    });
    schema.post('findOneAndUpdate', function (doc) {
        return __awaiter(this, void 0, void 0, function () {
            var modelName, identifier, store, updaterName, updateObj, updateDetails, modifiedKeys_1, _i, _a, _b, key, value, keys, setSource, err_2;
            var _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        if (!doc)
                            return [2 /*return*/];
                        _g.label = 1;
                    case 1:
                        _g.trys.push([1, 3, , 4]);
                        modelName = ((_c = this.model) === null || _c === void 0 ? void 0 : _c.modelName) || doc.constructor.modelName || 'Document';
                        identifier = doc.title || doc.name || doc.email || doc.phone || ((_d = doc._id) === null || _d === void 0 ? void 0 : _d.toString());
                        store = context_1.requestContext.getStore();
                        updaterName = ((_e = store === null || store === void 0 ? void 0 : store.user) === null || _e === void 0 ? void 0 : _e.name) || ((_f = store === null || store === void 0 ? void 0 : store.user) === null || _f === void 0 ? void 0 : _f.email) || 'System';
                        updateObj = this.getUpdate();
                        updateDetails = '';
                        if (updateObj) {
                            modifiedKeys_1 = new Set();
                            for (_i = 0, _a = Object.entries(updateObj); _i < _a.length; _i++) {
                                _b = _a[_i], key = _b[0], value = _b[1];
                                if (key === '$set' || key === '$unset') {
                                    Object.keys(value).forEach(function (k) { return modifiedKeys_1.add(k); });
                                }
                                else if (!key.startsWith('$')) {
                                    modifiedKeys_1.add(key);
                                }
                            }
                            modifiedKeys_1.delete('updatedAt');
                            modifiedKeys_1.delete('createdAt');
                            keys = Array.from(modifiedKeys_1);
                            if (keys.length > 0) {
                                updateDetails = " (Modified: ".concat(keys.join(', '), ")");
                                setSource = updateObj.$set || updateObj;
                                if (keys.includes('status') && setSource.status)
                                    updateDetails = " (Status changed to ".concat(setSource.status, ")");
                                else if (keys.includes('subscriptionPlan') && setSource.subscriptionPlan)
                                    updateDetails = " (Plan changed to ".concat(setSource.subscriptionPlan, ")");
                                else if (keys.includes('role') && setSource.role)
                                    updateDetails = " (Role changed to ".concat(setSource.role, ")");
                                else if (keys.includes('password'))
                                    updateDetails = " (Password was reset)";
                            }
                        }
                        return [4 /*yield*/, AdminNotification_1.AdminNotificationModel.create({
                                title: "".concat(modelName, " Updated"),
                                message: "".concat(modelName, " \"").concat(identifier, "\" was updated by ").concat(updaterName, ".").concat(updateDetails),
                                type: 'content_updated',
                                modelName: modelName,
                                action: 'updated',
                            })];
                    case 2:
                        _g.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _g.sent();
                        console.error('Audit plugin error on findOneAndUpdate:', err_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    });
    schema.post('findOneAndDelete', function (doc) {
        return __awaiter(this, void 0, void 0, function () {
            var modelName, identifier, store, deleterName, err_3;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!doc)
                            return [2 /*return*/];
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 3, , 4]);
                        modelName = ((_a = this.model) === null || _a === void 0 ? void 0 : _a.modelName) || doc.constructor.modelName || 'Document';
                        identifier = doc.title || doc.name || doc.email || doc.phone || ((_b = doc._id) === null || _b === void 0 ? void 0 : _b.toString());
                        store = context_1.requestContext.getStore();
                        deleterName = ((_c = store === null || store === void 0 ? void 0 : store.user) === null || _c === void 0 ? void 0 : _c.name) || ((_d = store === null || store === void 0 ? void 0 : store.user) === null || _d === void 0 ? void 0 : _d.email) || 'System';
                        return [4 /*yield*/, AdminNotification_1.AdminNotificationModel.create({
                                title: "".concat(modelName, " Deleted"),
                                message: "".concat(modelName, " \"").concat(identifier, "\" was deleted by ").concat(deleterName, "."),
                                type: 'content_deleted',
                                modelName: modelName,
                                action: 'deleted',
                            })];
                    case 2:
                        _e.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_3 = _e.sent();
                        console.error('Audit plugin error on findOneAndDelete:', err_3);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    });
};
exports.adminAuditPlugin = adminAuditPlugin;
