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
exports.authenticateAndAttach = exports.requireMinRole = exports.requireSuperAdmin = exports.requireAdmin = exports.requireRole = exports.requirePermission = exports.checkUserPermission = exports.isRoleHigherThan = exports.isRoleAtLeast = exports.getRoleRank = void 0;
var AdminUser_1 = require("../models/AdminUser");
// Role hierarchy: higher index = more power
var ROLE_HIERARCHY = ['influencer', 'moderator', 'admin', 'super_admin', 'superadmin'];
var getRoleRank = function (role) {
    var idx = ROLE_HIERARCHY.indexOf(role);
    // Treat 'superadmin' and 'super_admin' as the same highest rank
    if (role === 'superadmin' || role === 'super_admin')
        return ROLE_HIERARCHY.length - 1;
    return idx;
};
exports.getRoleRank = getRoleRank;
var isRoleAtLeast = function (userRole, requiredRole) {
    return (0, exports.getRoleRank)(userRole) >= (0, exports.getRoleRank)(requiredRole);
};
exports.isRoleAtLeast = isRoleAtLeast;
var isRoleHigherThan = function (userRole, targetRole) {
    return (0, exports.getRoleRank)(userRole) > (0, exports.getRoleRank)(targetRole);
};
exports.isRoleHigherThan = isRoleHigherThan;
/**
 * Core permission checker — reusable in middleware AND controllers
 */
var checkUserPermission = function (userId, moduleName, action) { return __awaiter(void 0, void 0, void 0, function () {
    var user, modulePermissions_1, modulePermissions;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, AdminUser_1.AdminUserModel.findById(userId).lean()];
            case 1:
                user = _e.sent();
                if (!user)
                    return [2 /*return*/, { allowed: false, error: 'Unauthorized — User not found', statusCode: 401 }];
                if (!user.isActive)
                    return [2 /*return*/, { allowed: false, error: 'Unauthorized — Account is inactive', statusCode: 401 }];
                // Superadmin bypass (handle both 'superadmin' and 'super_admin')
                if (user.role === 'superadmin' || user.role === 'super_admin')
                    return [2 /*return*/, { allowed: true, user: user }];
                // If route requires superadmin role, block non-superadmin
                if (moduleName === 'superadmin') {
                    return [2 /*return*/, { allowed: false, error: 'Forbidden — Superadmin access required', statusCode: 403 }];
                }
                // If no action specified, require at least canView for the module
                if (!action) {
                    modulePermissions_1 = ((_a = user.modulePermissions) === null || _a === void 0 ? void 0 : _a[moduleName]) || ((_b = user.permissions) === null || _b === void 0 ? void 0 : _b[moduleName]);
                    if (!modulePermissions_1 || !modulePermissions_1.canView) {
                        return [2 /*return*/, { allowed: false, error: "Forbidden \u2014 No view access for ".concat(moduleName), statusCode: 403 }];
                    }
                    return [2 /*return*/, { allowed: true, user: user }];
                }
                modulePermissions = ((_c = user.modulePermissions) === null || _c === void 0 ? void 0 : _c[moduleName]) || ((_d = user.permissions) === null || _d === void 0 ? void 0 : _d[moduleName]);
                if (!modulePermissions || !modulePermissions[action]) {
                    return [2 /*return*/, { allowed: false, error: "Forbidden \u2014 Insufficient permissions for ".concat(moduleName, ".").concat(action), statusCode: 403 }];
                }
                return [2 /*return*/, { allowed: true, user: user }];
        }
    });
}); };
exports.checkUserPermission = checkUserPermission;
/**
 * Fastify middleware: require a specific permission on a module
 * Usage: fastify.get('/path', { onRequest: [requirePermission('movies', 'canView')] }, handler)
 */
var requirePermission = function (moduleName, action) {
    return function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
        var decodedUser, result, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    // 1. Verify JWT
                    return [4 /*yield*/, request.jwtVerify()];
                case 1:
                    // 1. Verify JWT
                    _a.sent();
                    decodedUser = request.user;
                    if (!decodedUser || !decodedUser.id) {
                        return [2 /*return*/, reply.status(401).send({ error: 'Unauthorized — valid Bearer token required' })];
                    }
                    return [4 /*yield*/, (0, exports.checkUserPermission)(decodedUser.id, moduleName, action)];
                case 2:
                    result = _a.sent();
                    if (!result.allowed) {
                        return [2 /*return*/, reply.status(result.statusCode).send({ error: result.error })];
                    }
                    // 3. Attach fresh user data to request for downstream use
                    request.adminUser = result.user;
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    if (err_1.statusCode === 401 || err_1.code === 'FST_JWT_NO_AUTHORIZATION_IN_HEADER' || err_1.code === 'FAST_JWT_EXPIRED') {
                        return [2 /*return*/, reply.status(401).send({ error: 'Unauthorized — valid Bearer token required' })];
                    }
                    return [2 /*return*/, reply.status(500).send({ error: 'Internal Server Error' })];
                case 4: return [2 /*return*/];
            }
        });
    }); };
};
exports.requirePermission = requirePermission;
/**
 * Fastify middleware: require one of the allowed roles
 * Usage: fastify.get('/path', { onRequest: [requireRole('admin', 'superadmin')] }, handler)
 */
var requireRole = function () {
    var allowedRoles = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        allowedRoles[_i] = arguments[_i];
    }
    return function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
        var decodedUser, user, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, request.jwtVerify()];
                case 1:
                    _a.sent();
                    decodedUser = request.user;
                    if (!decodedUser || !decodedUser.id) {
                        return [2 /*return*/, reply.status(401).send({ error: 'Unauthorized — valid Bearer token required' })];
                    }
                    return [4 /*yield*/, AdminUser_1.AdminUserModel.findById(decodedUser.id).lean()];
                case 2:
                    user = _a.sent();
                    if (!user || !user.isActive) {
                        return [2 /*return*/, reply.status(401).send({ error: 'Unauthorized — Account is inactive or deleted' })];
                    }
                    if (!allowedRoles.includes(user.role)) {
                        return [2 /*return*/, reply.status(403).send({ error: "Forbidden \u2014 Required role: ".concat(allowedRoles.join(' or ')) })];
                    }
                    request.adminUser = user;
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    if (err_2.statusCode === 401 || err_2.code === 'FST_JWT_NO_AUTHORIZATION_IN_HEADER' || err_2.code === 'FAST_JWT_EXPIRED') {
                        return [2 /*return*/, reply.status(401).send({ error: 'Unauthorized — valid Bearer token required' })];
                    }
                    return [2 /*return*/, reply.status(500).send({ error: 'Internal Server Error' })];
                case 4: return [2 /*return*/];
            }
        });
    }); };
};
exports.requireRole = requireRole;
/**
 * Fastify middleware: require admin or higher
 */
exports.requireAdmin = (0, exports.requireRole)('admin', 'super_admin', 'superadmin');
/**
 * Fastify middleware: require superadmin
 */
exports.requireSuperAdmin = (0, exports.requireRole)('super_admin', 'superadmin');
/**
 * Fastify middleware: require minimum role rank
 * Usage: fastify.get('/path', { onRequest: [requireMinRole('moderator')] }, handler)
 */
var requireMinRole = function (minRole) {
    return function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
        var decodedUser, user, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, request.jwtVerify()];
                case 1:
                    _a.sent();
                    decodedUser = request.user;
                    if (!decodedUser || !decodedUser.id) {
                        return [2 /*return*/, reply.status(401).send({ error: 'Unauthorized — valid Bearer token required' })];
                    }
                    return [4 /*yield*/, AdminUser_1.AdminUserModel.findById(decodedUser.id).lean()];
                case 2:
                    user = _a.sent();
                    if (!user || !user.isActive) {
                        return [2 /*return*/, reply.status(401).send({ error: 'Unauthorized — Account is inactive or deleted' })];
                    }
                    if (!(0, exports.isRoleAtLeast)(user.role, minRole)) {
                        return [2 /*return*/, reply.status(403).send({ error: "Forbidden \u2014 Minimum role required: ".concat(minRole) })];
                    }
                    request.adminUser = user;
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _a.sent();
                    if (err_3.statusCode === 401 || err_3.code === 'FST_JWT_NO_AUTHORIZATION_IN_HEADER' || err_3.code === 'FAST_JWT_EXPIRED') {
                        return [2 /*return*/, reply.status(401).send({ error: 'Unauthorized — valid Bearer token required' })];
                    }
                    return [2 /*return*/, reply.status(500).send({ error: 'Internal Server Error' })];
                case 4: return [2 /*return*/];
            }
        });
    }); };
};
exports.requireMinRole = requireMinRole;
/**
 * Fastify middleware: just authenticate and attach fresh user
 * Usage: fastify.get('/path', { onRequest: [authenticateAndAttach] }, handler)
 */
var authenticateAndAttach = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var decodedUser, user, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, request.jwtVerify()];
            case 1:
                _a.sent();
                decodedUser = request.user;
                if (!decodedUser || !decodedUser.id) {
                    return [2 /*return*/, reply.status(401).send({ error: 'Unauthorized — valid Bearer token required' })];
                }
                return [4 /*yield*/, AdminUser_1.AdminUserModel.findById(decodedUser.id).lean()];
            case 2:
                user = _a.sent();
                if (!user || !user.isActive) {
                    return [2 /*return*/, reply.status(401).send({ error: 'Unauthorized — Account is inactive or deleted' })];
                }
                request.adminUser = user;
                return [3 /*break*/, 4];
            case 3:
                err_4 = _a.sent();
                if (err_4.statusCode === 401 || err_4.code === 'FST_JWT_NO_AUTHORIZATION_IN_HEADER' || err_4.code === 'FAST_JWT_EXPIRED') {
                    return [2 /*return*/, reply.status(401).send({ error: 'Unauthorized — valid Bearer token required' })];
                }
                return [2 /*return*/, reply.status(500).send({ error: 'Internal Server Error' })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.authenticateAndAttach = authenticateAndAttach;
