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
exports.toggleUserStatus = exports.updateOwnProfile = exports.resetUserPassword = exports.deleteAdminUser = exports.updateAdminUser = exports.createAdminUser = exports.getAdminUserById = exports.getAllAdminUsers = void 0;
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var AdminUser_1 = require("../models/AdminUser");
var logger_1 = require("../lib/logger");
var email_1 = require("../lib/email");
var rbac_1 = require("../middlewares/rbac");
// Default module permissions to ensure we have all fields
var DEFAULT_MODULE_PERMISSIONS = {
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
// Generate random password
var generatePassword = function (length) {
    if (length === void 0) { length = 12; }
    var charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    var password = '';
    for (var i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
};
// Helper function to merge permissions
var mergeModulePermissions = function (existing) {
    if (!existing)
        return DEFAULT_MODULE_PERMISSIONS;
    var merged = __assign({}, DEFAULT_MODULE_PERMISSIONS);
    for (var _i = 0, _a = Object.keys(DEFAULT_MODULE_PERMISSIONS); _i < _a.length; _i++) {
        var key = _a[_i];
        merged[key] = __assign(__assign({}, DEFAULT_MODULE_PERMISSIONS[key]), (existing[key] || {}));
    }
    return merged;
};
// Get all admin users with pagination
var getAllAdminUsers = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var query, page, limit, skip, filter, _a, users, total, usersWithId, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                query = request.query;
                page = Math.max(1, Number(query.page || 1));
                limit = Math.min(100, Math.max(1, Number(query.limit || 20)));
                skip = (page - 1) * limit;
                filter = {};
                if (query.role)
                    filter.role = query.role;
                if (query.status === 'active')
                    filter.isActive = true;
                if (query.status === 'inactive')
                    filter.isActive = false;
                if (query.search) {
                    filter.$or = [
                        { name: new RegExp(query.search, 'i') },
                        { email: new RegExp(query.search, 'i') },
                    ];
                }
                return [4 /*yield*/, Promise.all([
                        AdminUser_1.AdminUserModel.find(filter)
                            .select('-passwordHash')
                            .populate('createdBy', 'name email')
                            .sort({ createdAt: -1 })
                            .skip(skip)
                            .limit(limit)
                            .lean(),
                        AdminUser_1.AdminUserModel.countDocuments(filter),
                    ])];
            case 1:
                _a = _b.sent(), users = _a[0], total = _a[1];
                usersWithId = users.map(function (user) {
                    var _a;
                    return (__assign(__assign({}, user), { id: (_a = user._id) === null || _a === void 0 ? void 0 : _a.toString(), modulePermissions: mergeModulePermissions(user.modulePermissions) }));
                });
                return [2 /*return*/, reply.send({
                        success: true,
                        data: usersWithId,
                        pagination: {
                            page: page,
                            limit: limit,
                            total: total,
                            pages: Math.ceil(total / limit),
                        },
                    })];
            case 2:
                error_1 = _b.sent();
                logger_1.logger.error({ error: error_1 }, 'Error getting all admin users');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_1.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllAdminUsers = getAllAdminUsers;
// Get single admin user by ID
var getAdminUserById = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, user, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                id = request.params.id;
                return [4 /*yield*/, AdminUser_1.AdminUserModel.findById(id)
                        .select('-passwordHash')
                        .populate('createdBy', 'name email')
                        .lean()];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'User not found' })];
                }
                return [2 /*return*/, reply.send({
                        success: true,
                        data: __assign(__assign({}, user), { id: (_a = user._id) === null || _a === void 0 ? void 0 : _a.toString(), modulePermissions: mergeModulePermissions(user.modulePermissions) }),
                    })];
            case 2:
                error_2 = _b.sent();
                logger_1.logger.error({ error: error_2 }, 'Error getting admin user by ID');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_2.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAdminUserById = getAdminUserById;
// Create new admin user (influencer)
var createAdminUser = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var body, currentUser, existingUser, password, passwordHash, mergedModulePermissions, _i, _a, key, user, emailSent, error_3;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 5, , 6]);
                body = request.body;
                currentUser = request.user;
                // Role hierarchy validation: cannot create user with higher role than yourself
                if (body.role && (currentUser === null || currentUser === void 0 ? void 0 : currentUser.role)) {
                    if ((0, rbac_1.isRoleHigherThan)(body.role, currentUser.role)) {
                        return [2 /*return*/, reply.status(403).send({
                                success: false,
                                error: "Forbidden \u2014 You cannot create a user with role '".concat(body.role, "' because it exceeds your current role '").concat(currentUser.role, "'"),
                            })];
                    }
                }
                return [4 /*yield*/, AdminUser_1.AdminUserModel.findOne({ email: body.email.toLowerCase() })];
            case 1:
                existingUser = _d.sent();
                if (existingUser) {
                    return [2 /*return*/, reply.status(400).send({ success: false, error: 'Email already exists' })];
                }
                password = generatePassword(12);
                return [4 /*yield*/, bcryptjs_1.default.hash(password, 10)];
            case 2:
                passwordHash = _d.sent();
                mergedModulePermissions = __assign(__assign({}, DEFAULT_MODULE_PERMISSIONS), body.modulePermissions);
                // Ensure each module's permissions are merged with defaults
                for (_i = 0, _a = Object.keys(DEFAULT_MODULE_PERMISSIONS); _i < _a.length; _i++) {
                    key = _a[_i];
                    mergedModulePermissions[key] = __assign(__assign({}, DEFAULT_MODULE_PERMISSIONS[key]), (((_b = body.modulePermissions) === null || _b === void 0 ? void 0 : _b[key]) || {}));
                }
                return [4 /*yield*/, AdminUser_1.AdminUserModel.create({
                        email: body.email.toLowerCase(),
                        name: body.name,
                        phone: body.phone,
                        passwordHash: passwordHash,
                        role: body.role || 'influencer',
                        modulePermissions: mergedModulePermissions,
                        createdBy: currentUser === null || currentUser === void 0 ? void 0 : currentUser.id,
                    })];
            case 3:
                user = _d.sent();
                return [4 /*yield*/, (0, email_1.sendWelcomeEmail)(body.email, body.name, body.email, password)];
            case 4:
                emailSent = _d.sent();
                return [2 /*return*/, reply.status(201).send({
                        success: true,
                        data: __assign(__assign({}, user.toObject()), { id: (_c = user._id) === null || _c === void 0 ? void 0 : _c.toString(), password: password, // Only return password in response for admin to see
                            emailSent: emailSent }),
                    })];
            case 5:
                error_3 = _d.sent();
                logger_1.logger.error({ error: error_3 }, 'Error creating admin user');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_3.message })];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.createAdminUser = createAdminUser;
// Update admin user
var updateAdminUser = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, body, currentUser, existingUser, updateData, mergedModulePermissions, _i, _a, key, user, error_4;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 4, , 5]);
                id = request.params.id;
                body = request.body;
                currentUser = request.user;
                // Role hierarchy validation: cannot promote user above your own role
                if (body.role && (currentUser === null || currentUser === void 0 ? void 0 : currentUser.role)) {
                    if ((0, rbac_1.isRoleHigherThan)(body.role, currentUser.role)) {
                        return [2 /*return*/, reply.status(403).send({
                                success: false,
                                error: "Forbidden \u2014 You cannot assign role '".concat(body.role, "' because it exceeds your current role '").concat(currentUser.role, "'"),
                            })];
                    }
                }
                if (!body.email) return [3 /*break*/, 2];
                return [4 /*yield*/, AdminUser_1.AdminUserModel.findOne({
                        email: body.email.toLowerCase(),
                        _id: { $ne: id }
                    })];
            case 1:
                existingUser = _d.sent();
                if (existingUser) {
                    return [2 /*return*/, reply.status(400).send({ success: false, error: 'Email already exists' })];
                }
                _d.label = 2;
            case 2:
                updateData = {};
                if (body.name)
                    updateData.name = body.name;
                if (body.email)
                    updateData.email = body.email.toLowerCase();
                if (body.phone !== undefined)
                    updateData.phone = body.phone;
                if (body.role)
                    updateData.role = body.role;
                if (body.modulePermissions) {
                    mergedModulePermissions = __assign(__assign({}, DEFAULT_MODULE_PERMISSIONS), body.modulePermissions);
                    // Ensure each module's permissions are merged with defaults
                    for (_i = 0, _a = Object.keys(DEFAULT_MODULE_PERMISSIONS); _i < _a.length; _i++) {
                        key = _a[_i];
                        mergedModulePermissions[key] = __assign(__assign({}, DEFAULT_MODULE_PERMISSIONS[key]), (((_b = body.modulePermissions) === null || _b === void 0 ? void 0 : _b[key]) || {}));
                    }
                    updateData.modulePermissions = mergedModulePermissions;
                }
                if (body.isActive !== undefined)
                    updateData.isActive = body.isActive;
                return [4 /*yield*/, AdminUser_1.AdminUserModel.findByIdAndUpdate(id, { $set: updateData }, { returnDocument: 'after', runValidators: true })
                        .select('-passwordHash')
                        .populate('createdBy', 'name email')
                        .lean()];
            case 3:
                user = _d.sent();
                if (!user) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'User not found' })];
                }
                return [2 /*return*/, reply.send({
                        success: true,
                        data: __assign(__assign({}, user), { id: (_c = user._id) === null || _c === void 0 ? void 0 : _c.toString() }),
                    })];
            case 4:
                error_4 = _d.sent();
                logger_1.logger.error({ error: error_4 }, 'Error updating admin user');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_4.message })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.updateAdminUser = updateAdminUser;
// Delete admin user
var deleteAdminUser = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, currentUser, target, user, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id = request.params.id;
                currentUser = request.user;
                // Prevent self-deletion
                if ((currentUser === null || currentUser === void 0 ? void 0 : currentUser.id) === id) {
                    return [2 /*return*/, reply.status(400).send({ success: false, error: 'Cannot delete your own account' })];
                }
                return [4 /*yield*/, AdminUser_1.AdminUserModel.findById(id).lean()];
            case 1:
                target = _a.sent();
                if (!target) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'User not found' })];
                }
                if (!(0, rbac_1.isRoleHigherThan)(currentUser === null || currentUser === void 0 ? void 0 : currentUser.role, target.role)) {
                    return [2 /*return*/, reply.status(403).send({ success: false, error: 'Forbidden — Cannot delete a user with equal or higher role' })];
                }
                return [4 /*yield*/, AdminUser_1.AdminUserModel.findByIdAndDelete(id)];
            case 2:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'User not found' })];
                }
                return [2 /*return*/, reply.send({ success: true, message: 'User deleted successfully' })];
            case 3:
                error_5 = _a.sent();
                logger_1.logger.error({ error: error_5 }, 'Error deleting admin user');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_5.message })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteAdminUser = deleteAdminUser;
// Reset user password
var resetUserPassword = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, currentUser, user, password, passwordHash, emailSent, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                id = request.params.id;
                currentUser = request.user;
                return [4 /*yield*/, AdminUser_1.AdminUserModel.findById(id)];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'User not found' })];
                }
                // Cannot reset password of users with higher or equal role
                if (!(0, rbac_1.isRoleHigherThan)(currentUser === null || currentUser === void 0 ? void 0 : currentUser.role, user.role)) {
                    return [2 /*return*/, reply.status(403).send({ success: false, error: 'Forbidden — Cannot reset password of a user with equal or higher role' })];
                }
                password = generatePassword(12);
                return [4 /*yield*/, bcryptjs_1.default.hash(password, 10)];
            case 2:
                passwordHash = _a.sent();
                user.passwordHash = passwordHash;
                return [4 /*yield*/, user.save()];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, email_1.sendAdminPasswordResetEmail)(user.email, user.name, user.email, password)];
            case 4:
                emailSent = _a.sent();
                return [2 /*return*/, reply.send({
                        success: true,
                        data: {
                            password: password, // Return new password for admin to see
                            emailSent: emailSent,
                        },
                    })];
            case 5:
                error_6 = _a.sent();
                logger_1.logger.error({ error: error_6 }, 'Error resetting user password');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_6.message })];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.resetUserPassword = resetUserPassword;
// Update own profile (email/password)
var updateOwnProfile = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var currentUser, body, updateData, existingUser, user_1, isPasswordValid, _a, user, error_7;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 8, , 9]);
                currentUser = request.user;
                body = request.body;
                if (!currentUser) {
                    return [2 /*return*/, reply.status(401).send({ success: false, error: 'Unauthorized' })];
                }
                updateData = {};
                if (!body.email) return [3 /*break*/, 2];
                return [4 /*yield*/, AdminUser_1.AdminUserModel.findOne({
                        email: body.email.toLowerCase(),
                        _id: { $ne: currentUser.id }
                    })];
            case 1:
                existingUser = _c.sent();
                if (existingUser) {
                    return [2 /*return*/, reply.status(400).send({ success: false, error: 'Email already exists' })];
                }
                updateData.email = body.email.toLowerCase();
                _c.label = 2;
            case 2:
                // Prevent self-role-change
                if (body.role) {
                    return [2 /*return*/, reply.status(403).send({ success: false, error: 'Forbidden — You cannot change your own role' })];
                }
                if (!(body.currentPassword && body.newPassword)) return [3 /*break*/, 6];
                return [4 /*yield*/, AdminUser_1.AdminUserModel.findById(currentUser.id)];
            case 3:
                user_1 = _c.sent();
                if (!user_1) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'User not found' })];
                }
                return [4 /*yield*/, bcryptjs_1.default.compare(body.currentPassword, user_1.passwordHash)];
            case 4:
                isPasswordValid = _c.sent();
                if (!isPasswordValid) {
                    return [2 /*return*/, reply.status(400).send({ success: false, error: 'Current password is incorrect' })];
                }
                _a = updateData;
                return [4 /*yield*/, bcryptjs_1.default.hash(body.newPassword, 10)];
            case 5:
                _a.passwordHash = _c.sent();
                _c.label = 6;
            case 6: return [4 /*yield*/, AdminUser_1.AdminUserModel.findByIdAndUpdate(currentUser.id, { $set: updateData }, { returnDocument: 'after', runValidators: true })
                    .select('-passwordHash')
                    .lean()];
            case 7:
                user = _c.sent();
                if (!user) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'User not found' })];
                }
                return [2 /*return*/, reply.send({
                        success: true,
                        data: __assign(__assign({}, user), { id: (_b = user._id) === null || _b === void 0 ? void 0 : _b.toString() }),
                    })];
            case 8:
                error_7 = _c.sent();
                logger_1.logger.error({ error: error_7 }, 'Error updating own profile');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_7.message })];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.updateOwnProfile = updateOwnProfile;
var toggleUserStatus = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var id, currentUser, user, error_8;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                id = request.params.id;
                currentUser = request.user;
                // Prevent self-deactivation
                if ((currentUser === null || currentUser === void 0 ? void 0 : currentUser.id) === id) {
                    return [2 /*return*/, reply.status(400).send({ success: false, error: 'Cannot deactivate your own account' })];
                }
                return [4 /*yield*/, AdminUser_1.AdminUserModel.findById(id)];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, reply.status(404).send({ success: false, error: 'User not found' })];
                }
                // Cannot toggle status of users with higher or equal role
                if (!(0, rbac_1.isRoleHigherThan)(currentUser === null || currentUser === void 0 ? void 0 : currentUser.role, user.role)) {
                    return [2 /*return*/, reply.status(403).send({ success: false, error: 'Forbidden — Cannot toggle status of a user with equal or higher role' })];
                }
                user.isActive = !user.isActive;
                return [4 /*yield*/, user.save()];
            case 2:
                _b.sent();
                return [2 /*return*/, reply.send({
                        success: true,
                        data: __assign(__assign({}, user.toObject()), { id: (_a = user._id) === null || _a === void 0 ? void 0 : _a.toString() }),
                    })];
            case 3:
                error_8 = _b.sent();
                logger_1.logger.error({ error: error_8 }, 'Error toggling user status');
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_8.message })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.toggleUserStatus = toggleUserStatus;
