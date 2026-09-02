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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadAdminAvatar = exports.setupAdmin = exports.updatePassword = exports.updateProfile = exports.logout = exports.getMe = exports.login = void 0;
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var redis_1 = require("../lib/redis");
var AdminUser_1 = require("../models/AdminUser");
var logger_1 = require("../lib/logger");
var uploadHandler = __importStar(require("../lib/uploadHandler"));
var login = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, admin, valid, payload, server, accessToken, refreshToken, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = request.body, email = _a.email, password = _a.password;
                if (!email || !password) {
                    return [2 /*return*/, reply.status(400).send({
                            error: 'email and password are required',
                        })];
                }
                return [4 /*yield*/, AdminUser_1.AdminUserModel.findOne({
                        email: email.toLowerCase(),
                        isActive: true,
                    })];
            case 1:
                admin = _b.sent();
                if (!admin) {
                    return [2 /*return*/, reply.status(401).send({ error: 'Invalid credentials' })];
                }
                return [4 /*yield*/, bcryptjs_1.default.compare(password, admin.passwordHash)];
            case 2:
                valid = _b.sent();
                if (!valid) {
                    return [2 /*return*/, reply.status(401).send({ error: 'Invalid credentials' })];
                }
                payload = {
                    id: admin._id.toString(),
                    email: admin.email,
                    name: admin.name,
                    role: admin.role,
                };
                return [4 /*yield*/, AdminUser_1.AdminUserModel.findByIdAndUpdate(admin._id, {
                        $set: { lastLogin: new Date() },
                        $inc: { loginCount: 1 },
                    })];
            case 3:
                _b.sent();
                server = request.server;
                accessToken = server.jwt.sign(payload, {
                    expiresIn: process.env.JWT_EXPIRES_IN || '48h',
                });
                refreshToken = server.jwt.sign(__assign(__assign({}, payload), { type: 'refresh' }), {
                    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
                });
                return [4 /*yield*/, (0, redis_1.storeRefreshToken)(refreshToken, payload.id)];
            case 4:
                _b.sent();
                return [2 /*return*/, reply.status(200).send({
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        expiresIn: 172800,
                    })];
            case 5:
                error_1 = _b.sent();
                console.error(error_1);
                return [2 /*return*/, reply.status(500).send({
                        error: 'Internal server error',
                    })];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.login = login;
var getMe = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, admin, defaultModulePermissions, mergedModulePermissions, _i, _a, key, error_2;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                userId = request.user.id;
                return [4 /*yield*/, AdminUser_1.AdminUserModel.findById(userId).select('-passwordHash').lean()];
            case 1:
                admin = _c.sent();
                if (!admin) {
                    return [2 /*return*/, reply.status(404).send({ error: 'User not found' })];
                }
                defaultModulePermissions = {
                    movies: { canView: true, canCreate: false, canEdit: false, canDelete: false },
                    shows: { canView: true, canCreate: false, canEdit: false, canDelete: false },
                    shortDramas: { canView: true, canCreate: false, canEdit: false, canDelete: false },
                    genres: { canView: true, canCreate: false, canEdit: false, canDelete: false },
                    actors: { canView: true, canCreate: false, canEdit: false, canDelete: false },
                    directors: { canView: true, canCreate: false, canEdit: false, canDelete: false },
                    languages: { canView: true, canCreate: false, canEdit: false, canDelete: false },
                    categories: { canView: true, canCreate: false, canEdit: false, canDelete: false },
                    mediaLibrary: { canView: true, canUpload: false, canDelete: false },
                    banners: { canView: true, canCreate: false, canEdit: false, canDelete: false },
                    promotions: { canView: true, canCreate: false, canEdit: false, canDelete: false },
                    influencers: { canView: true, canCreate: false, canEdit: false, canDelete: false },
                    ads: { canView: true, canCreate: false, canEdit: false, canDelete: false },
                    pages: { canView: true, canCreate: false, canEdit: false, canDelete: false },
                    faqs: { canView: true, canCreate: false, canEdit: false, canDelete: false },
                    subscriptions: { canView: true, canCreate: false, canEdit: false, canDelete: false },
                    subscriptionPlans: { canView: true, canCreate: false, canEdit: false, canDelete: false },
                    planLimits: { canView: true, canCreate: false, canEdit: false, canDelete: false },
                    notifications: { canView: true, canCreate: false, canEdit: false, canDelete: false },
                    notificationTemplates: { canView: true, canCreate: false, canEdit: false, canDelete: false },
                    settings: { canView: true, canCreate: false, canEdit: false, canDelete: false },
                    reviews: { canView: true, canCreate: false, canEdit: false, canDelete: false },
                };
                mergedModulePermissions = __assign({}, defaultModulePermissions);
                if (admin.modulePermissions) {
                    for (_i = 0, _a = Object.keys(defaultModulePermissions); _i < _a.length; _i++) {
                        key = _a[_i];
                        mergedModulePermissions[key] = __assign(__assign({}, defaultModulePermissions[key]), (admin.modulePermissions[key] || {}));
                    }
                }
                return [2 /*return*/, {
                        user: __assign(__assign({}, admin), { id: (_b = admin._id) === null || _b === void 0 ? void 0 : _b.toString(), modulePermissions: mergedModulePermissions })
                    }];
            case 2:
                error_2 = _c.sent();
                console.error(error_2);
                return [2 /*return*/, reply.status(500).send({ error: 'Internal server error' })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getMe = getMe;
var logout = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var refreshToken, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                refreshToken = (request.body || {}).refreshToken;
                if (!refreshToken) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, redis_1.revokeRefreshToken)(refreshToken)];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [2 /*return*/, reply.status(200).send({ message: 'Logged out successfully' })];
            case 3:
                error_3 = _a.sent();
                console.error(error_3);
                return [2 /*return*/, reply.status(500).send({ error: 'Internal server error' })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.logout = logout;
var updateProfile = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, name_1, email, avatar, updateData, existing, admin, error_4;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 4, , 5]);
                userId = request.user.id;
                _a = request.body, name_1 = _a.name, email = _a.email, avatar = _a.avatar;
                updateData = {};
                if (name_1)
                    updateData.name = name_1;
                if (avatar)
                    updateData.avatar = avatar;
                if (!email) return [3 /*break*/, 2];
                return [4 /*yield*/, AdminUser_1.AdminUserModel.findOne({ email: email.toLowerCase(), _id: { $ne: userId } })];
            case 1:
                existing = _c.sent();
                if (existing)
                    return [2 /*return*/, reply.status(400).send({ error: 'Email already in use' })];
                updateData.email = email.toLowerCase();
                _c.label = 2;
            case 2: return [4 /*yield*/, AdminUser_1.AdminUserModel.findByIdAndUpdate(userId, { $set: updateData }, { returnDocument: 'after', runValidators: true }).select('-passwordHash').lean()];
            case 3:
                admin = _c.sent();
                if (!admin) {
                    return [2 /*return*/, reply.status(404).send({ error: 'User not found' })];
                }
                return [2 /*return*/, reply.send({
                        success: true,
                        data: __assign(__assign({}, admin), { id: (_b = admin._id) === null || _b === void 0 ? void 0 : _b.toString() }),
                    })];
            case 4:
                error_4 = _c.sent();
                console.error(error_4);
                return [2 /*return*/, reply.status(500).send({ error: 'Internal server error' })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.updateProfile = updateProfile;
var updatePassword = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, currentPassword, newPassword, admin, valid, passwordHash, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                userId = request.user.id;
                _a = request.body, currentPassword = _a.currentPassword, newPassword = _a.newPassword;
                if (!currentPassword || !newPassword) {
                    return [2 /*return*/, reply.status(400).send({ error: 'Current password and new password are required' })];
                }
                if (newPassword.length < 6) {
                    return [2 /*return*/, reply.status(400).send({ error: 'New password must be at least 6 characters long' })];
                }
                return [4 /*yield*/, AdminUser_1.AdminUserModel.findById(userId)];
            case 1:
                admin = _b.sent();
                if (!admin) {
                    return [2 /*return*/, reply.status(404).send({ error: 'User not found' })];
                }
                return [4 /*yield*/, bcryptjs_1.default.compare(currentPassword, admin.passwordHash)];
            case 2:
                valid = _b.sent();
                if (!valid) {
                    return [2 /*return*/, reply.status(401).send({ error: 'Current password is incorrect' })];
                }
                return [4 /*yield*/, bcryptjs_1.default.hash(newPassword, 10)];
            case 3:
                passwordHash = _b.sent();
                return [4 /*yield*/, AdminUser_1.AdminUserModel.findByIdAndUpdate(userId, {
                        $set: { passwordHash: passwordHash },
                    })];
            case 4:
                _b.sent();
                return [2 /*return*/, reply.send({
                        success: true,
                        message: 'Password updated successfully',
                    })];
            case 5:
                error_5 = _b.sent();
                console.error(error_5);
                return [2 /*return*/, reply.status(500).send({ error: 'Internal server error' })];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.updatePassword = updatePassword;
// Reset or create superadmin — protected by ADMIN_SETUP_KEY env var
var setupAdmin = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, setupKey, email, password, name_2, expectedKey, passwordHash, admin, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = request.body, setupKey = _a.setupKey, email = _a.email, password = _a.password, name_2 = _a.name;
                expectedKey = process.env.ADMIN_SETUP_KEY || 'kotibox_setup_2024';
                if (setupKey !== expectedKey) {
                    return [2 /*return*/, reply.status(403).send({ error: 'Invalid setup key' })];
                }
                if (!email || !password) {
                    return [2 /*return*/, reply.status(400).send({ error: 'email and password are required' })];
                }
                return [4 /*yield*/, bcryptjs_1.default.hash(password, 12)];
            case 1:
                passwordHash = _b.sent();
                return [4 /*yield*/, AdminUser_1.AdminUserModel.findOneAndUpdate({ role: 'superadmin' }, {
                        $set: {
                            email: email.toLowerCase(),
                            name: name_2 || 'Super Admin',
                            passwordHash: passwordHash,
                            role: 'superadmin',
                            isActive: true,
                        },
                    }, { upsert: true, returnDocument: 'after' })];
            case 2:
                admin = _b.sent();
                return [2 /*return*/, reply.send({
                        success: true,
                        message: 'Superadmin created/updated successfully',
                        data: { email: admin.email, name: admin.name },
                    })];
            case 3:
                error_6 = _b.sent();
                console.error(error_6);
                return [2 /*return*/, reply.status(500).send({ error: 'Internal server error' })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.setupAdmin = setupAdmin;
// Upload admin avatar — multipart upload
var uploadAdminAvatar = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, parts, avatarUrl, _a, parts_1, parts_1_1, part, fileInfo, e_1_1, error_7;
    var _b, e_1, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 15, , 16]);
                userId = request.user.id;
                if (!userId) {
                    return [2 /*return*/, reply.status(401).send({ error: 'Unauthorized' })];
                }
                parts = request.parts();
                avatarUrl = null;
                _e.label = 1;
            case 1:
                _e.trys.push([1, 7, 8, 13]);
                _a = true, parts_1 = __asyncValues(parts);
                _e.label = 2;
            case 2: return [4 /*yield*/, parts_1.next()];
            case 3:
                if (!(parts_1_1 = _e.sent(), _b = parts_1_1.done, !_b)) return [3 /*break*/, 6];
                _d = parts_1_1.value;
                _a = false;
                part = _d;
                if (!(part.type === 'file' && part.fieldname === 'avatar')) return [3 /*break*/, 5];
                return [4 /*yield*/, uploadHandler.saveFileFromPart(part, request, 'IMAGE', 'avatars')];
            case 4:
                fileInfo = _e.sent();
                avatarUrl = fileInfo.url;
                return [3 /*break*/, 6];
            case 5:
                _a = true;
                return [3 /*break*/, 2];
            case 6: return [3 /*break*/, 13];
            case 7:
                e_1_1 = _e.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 13];
            case 8:
                _e.trys.push([8, , 11, 12]);
                if (!(!_a && !_b && (_c = parts_1.return))) return [3 /*break*/, 10];
                return [4 /*yield*/, _c.call(parts_1)];
            case 9:
                _e.sent();
                _e.label = 10;
            case 10: return [3 /*break*/, 12];
            case 11:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 12: return [7 /*endfinally*/];
            case 13:
                if (!avatarUrl) {
                    return [2 /*return*/, reply.status(400).send({ error: 'No avatar file provided' })];
                }
                return [4 /*yield*/, AdminUser_1.AdminUserModel.findByIdAndUpdate(userId, { $set: { avatar: avatarUrl } })];
            case 14:
                _e.sent();
                return [2 /*return*/, reply.send({
                        success: true,
                        data: { avatarUrl: avatarUrl },
                    })];
            case 15:
                error_7 = _e.sent();
                logger_1.logger.error({ error: error_7 }, 'Error uploading admin avatar');
                return [2 /*return*/, reply.status(500).send({ error: 'Failed to upload avatar' })];
            case 16: return [2 /*return*/];
        }
    });
}); };
exports.uploadAdminAvatar = uploadAdminAvatar;
