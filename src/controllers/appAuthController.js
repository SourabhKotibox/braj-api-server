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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.appleAuth = exports.googleAuth = exports.loginUser = exports.registerUser = exports.skipPreferredLanguage = exports.setPreferredLanguage = exports.verifyOtp = exports.sendOtp = void 0;
var zod_1 = require("zod");
var User_1 = require("../models/User");
var SubscriptionPlan_1 = require("../models/SubscriptionPlan");
var PlanLimit_1 = require("../models/PlanLimit");
var Language_1 = require("../models/Language");
var messageCentralService_1 = require("../services/messageCentralService");
var mongoose_1 = __importDefault(require("mongoose"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var email_1 = require("../lib/email");
var Settings_1 = require("../models/Settings");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var messageCentralService = new messageCentralService_1.MessageCentralService();
var STATIC_OTP = '1234';
// Validation schemas
var sendOtpSchema = zod_1.z.object({
    mobileNumber: zod_1.z.string().regex(/^\d{10}$/, 'Mobile number must be 10 digits'),
});
var verifyOtpSchema = zod_1.z.object({
    mobileNumber: zod_1.z.string().regex(/^\d{10}$/, 'Mobile number must be 10 digits'),
    verificationId: zod_1.z.string().optional(),
    otp: zod_1.z.string().regex(/^\d{4}$/, 'OTP must be 4 digits'),
    deviceId: zod_1.z.string().optional(),
    deviceName: zod_1.z.string().optional(),
});
var setLanguageSchema = zod_1.z.object({
    language: zod_1.z.string().trim().min(1, 'Language is required'),
});
var sendOtp = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var body, mobileNumber, result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                body = sendOtpSchema.safeParse(request.body);
                if (!body.success) {
                    return [2 /*return*/, reply.status(400).send({
                            success: false,
                            message: 'Validation failed',
                            errors: body.error.flatten().fieldErrors,
                        })];
                }
                mobileNumber = body.data.mobileNumber;
                return [4 /*yield*/, messageCentralService.sendOtp(mobileNumber)];
            case 1:
                result = _a.sent();
                if (!result.success) {
                    return [2 /*return*/, reply.status(400).send(result)];
                }
                return [2 /*return*/, reply.status(200).send(result)];
            case 2:
                error_1 = _a.sent();
                console.error('Error sending OTP:', error_1);
                return [2 /*return*/, reply.status(500).send({
                        success: false,
                        message: 'Internal server error',
                        error: error_1.message
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.sendOtp = sendOtp;
var verifyOtp = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var body, _a, mobileNumber, verificationId, otp, deviceId_1, deviceName, verifyResult, allUsersWithPhone, user, newProfile, newUser, realAccount, tempAccount, userDoc, deviceLimitCount, planName, isActive, plan, limit, devices, existingDeviceIndex, newDevice, server, tokenPayload, accessToken, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 14, , 15]);
                body = verifyOtpSchema.safeParse(request.body);
                if (!body.success) {
                    return [2 /*return*/, reply.status(400).send({
                            success: false,
                            message: 'Validation failed',
                            errors: body.error.flatten().fieldErrors,
                        })];
                }
                _a = body.data, mobileNumber = _a.mobileNumber, verificationId = _a.verificationId, otp = _a.otp, deviceId_1 = _a.deviceId, deviceName = _a.deviceName;
                return [4 /*yield*/, messageCentralService.verifyOtp(verificationId, otp)];
            case 1:
                verifyResult = _b.sent();
                if (!verifyResult.success) {
                    return [2 /*return*/, reply.status(400).send({
                            success: false,
                            message: verifyResult.message || "Invalid OTP. Use ".concat(STATIC_OTP)
                        })];
                }
                return [4 /*yield*/, User_1.UserModel.find({ phone: mobileNumber }).lean()];
            case 2:
                allUsersWithPhone = _b.sent();
                user = null;
                if (!(allUsersWithPhone.length === 0)) return [3 /*break*/, 4];
                newProfile = { name: 'User', isKids: false, maturityLevel: 18, language: 'Hindi' };
                newUser = new User_1.UserModel({
                    phone: mobileNumber,
                    name: 'User',
                    email: "".concat(mobileNumber, "@temp.local"),
                    profiles: [newProfile],
                    preferredLanguage: 'Hindi',
                    languageSelectionSkipped: false,
                });
                return [4 /*yield*/, newUser.save()];
            case 3:
                _b.sent();
                user = newUser;
                return [3 /*break*/, 7];
            case 4:
                if (!(allUsersWithPhone.length === 1)) return [3 /*break*/, 5];
                // Single account — use it directly
                user = allUsersWithPhone[0];
                return [3 /*break*/, 7];
            case 5:
                realAccount = allUsersWithPhone.find(function (u) { return u.email && !u.email.endsWith('@temp.local'); });
                tempAccount = allUsersWithPhone.find(function (u) { return u.email && u.email.endsWith('@temp.local'); });
                user = realAccount || allUsersWithPhone[0];
                if (!(realAccount && tempAccount)) return [3 /*break*/, 7];
                console.log("[verifyOtp] Merging temp account ".concat(tempAccount._id, " into real account ").concat(realAccount._id, " for phone ").concat(mobileNumber));
                return [4 /*yield*/, User_1.UserModel.findByIdAndDelete(tempAccount._id)];
            case 6:
                _b.sent();
                _b.label = 7;
            case 7: return [4 /*yield*/, User_1.UserModel.findById(user._id)];
            case 8:
                userDoc = _b.sent();
                if (!userDoc) {
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'User not found' })];
                }
                if (userDoc.status === 'banned' || userDoc.status === 'suspended') {
                    return [2 /*return*/, reply.status(403).send({
                            success: false,
                            message: userDoc.banReason ? "Your account has been suspended: ".concat(userDoc.banReason) : 'Your account has been suspended.'
                        })];
                }
                if (!deviceId_1) return [3 /*break*/, 12];
                deviceLimitCount = 1;
                planName = userDoc.subscriptionPlan || 'free';
                isActive = userDoc.subscriptionStatus === 'active' &&
                    (!userDoc.subscriptionExpiry || userDoc.subscriptionExpiry > new Date());
                if (!(isActive && planName !== 'free')) return [3 /*break*/, 11];
                return [4 /*yield*/, SubscriptionPlan_1.SubscriptionPlanModel.findOne({ name: planName }).lean()];
            case 9:
                plan = _b.sent();
                if (!plan) return [3 /*break*/, 11];
                return [4 /*yield*/, PlanLimit_1.PlanLimitModel.findOne({ planId: plan._id }).lean()];
            case 10:
                limit = _b.sent();
                if (limit) {
                    deviceLimitCount = limit.deviceLimitCount;
                }
                _b.label = 11;
            case 11:
                devices = userDoc.devices || [];
                existingDeviceIndex = devices.findIndex(function (d) { return d.deviceId === deviceId_1; });
                if (existingDeviceIndex !== -1) {
                    // Device already exists, just update timestamp
                    devices[existingDeviceIndex].lastActive = new Date();
                    devices[existingDeviceIndex].deviceName = deviceName || devices[existingDeviceIndex].deviceName;
                }
                else {
                    newDevice = {
                        deviceId: deviceId_1,
                        deviceName: deviceName || 'Unknown Device',
                        deviceType: 'mobile',
                        lastActive: new Date(),
                        addedAt: new Date()
                    };
                    // Enforce limit by removing oldest if necessary
                    while (devices.length >= deviceLimitCount) {
                        // Sort by oldest lastActive
                        devices.sort(function (a, b) { return new Date(a.lastActive).getTime() - new Date(b.lastActive).getTime(); });
                        devices.shift(); // Remove oldest
                    }
                    devices.push(newDevice);
                }
                userDoc.devices = devices;
                _b.label = 12;
            case 12:
                userDoc.lastLogin = new Date();
                userDoc.loginCount = (userDoc.loginCount || 0) + 1;
                return [4 /*yield*/, userDoc.save()];
            case 13:
                _b.sent();
                server = request.server;
                tokenPayload = {
                    id: userDoc._id.toString(),
                    name: userDoc.name,
                    phone: userDoc.phone,
                    role: 'user',
                    deviceId: deviceId_1 || 'unknown',
                };
                accessToken = server.jwt.sign(tokenPayload, {
                    expiresIn: process.env.MOBILE_JWT_EXPIRES_IN || '7d',
                });
                // Return full profile so the app can pre-fill name, email, avatar, subscription
                return [2 /*return*/, reply.status(200).send({
                        success: true,
                        accessToken: accessToken,
                        userId: userDoc._id.toString(),
                        name: userDoc.name,
                        email: userDoc.email && !userDoc.email.endsWith('@temp.local')
                            ? userDoc.email
                            : null,
                        phone: userDoc.phone || null,
                        avatar: userDoc.avatar || null,
                        subscriptionPlan: userDoc.subscriptionPlan || 'free',
                        subscriptionStatus: userDoc.subscriptionStatus || 'inactive',
                        subscriptionExpiry: userDoc.subscriptionExpiry || null,
                        expiresIn: 604800, // 7 days in seconds
                    })];
            case 14:
                error_2 = _b.sent();
                console.error('Error verifying OTP:', error_2);
                return [2 /*return*/, reply.status(500).send({
                        success: false,
                        message: 'Internal server error',
                        error: error_2.message
                    })];
            case 15: return [2 /*return*/];
        }
    });
}); };
exports.verifyOtp = verifyOtp;
var setPreferredLanguage = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, body, user, resolvedLanguage, langDoc, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                userId = request.params.userId;
                body = setLanguageSchema.safeParse(request.body);
                if (!body.success) {
                    return [2 /*return*/, reply.status(400).send({
                            success: false,
                            message: 'Validation failed',
                            errors: body.error.flatten().fieldErrors,
                        })];
                }
                return [4 /*yield*/, User_1.UserModel.findById(userId)];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'User not found' })];
                }
                resolvedLanguage = body.data.language;
                return [4 /*yield*/, Language_1.LanguageModel.findOne({
                        $or: __spreadArray([
                            { name: new RegExp("^".concat(body.data.language, "$"), 'i') },
                            { code: body.data.language.toLowerCase() }
                        ], (mongoose_1.default.Types.ObjectId.isValid(body.data.language) ? [{ _id: body.data.language }] : []), true)
                    }).lean()];
            case 2:
                langDoc = _a.sent();
                if (langDoc) {
                    resolvedLanguage = langDoc.name;
                }
                user.preferredLanguage = resolvedLanguage;
                user.languageSelectionSkipped = false;
                if (user.profiles.length > 0) {
                    user.profiles[0].language = resolvedLanguage;
                }
                return [4 /*yield*/, user.save()];
            case 3:
                _a.sent();
                return [2 /*return*/, reply.status(200).send({
                        success: true,
                        message: 'Preferred language updated successfully',
                        data: {
                            userId: user._id.toString(),
                            preferredLanguage: user.preferredLanguage,
                            languageSelectionSkipped: user.languageSelectionSkipped,
                        },
                    })];
            case 4:
                error_3 = _a.sent();
                console.error('Error setting preferred language:', error_3);
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error' })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.setPreferredLanguage = setPreferredLanguage;
var skipPreferredLanguage = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, user, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                userId = request.params.userId;
                return [4 /*yield*/, User_1.UserModel.findById(userId)];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, reply.status(404).send({ success: false, message: 'User not found' })];
                }
                user.preferredLanguage = 'Hindi';
                user.languageSelectionSkipped = true;
                if (user.profiles.length > 0) {
                    user.profiles[0].language = 'Hindi';
                }
                return [4 /*yield*/, user.save()];
            case 2:
                _a.sent();
                return [2 /*return*/, reply.status(200).send({
                        success: true,
                        message: 'Language selection skipped successfully',
                        data: {
                            userId: user._id.toString(),
                            preferredLanguage: 'Hindi',
                            languageSelectionSkipped: true,
                        },
                    })];
            case 3:
                error_4 = _a.sent();
                console.error('Error skipping preferred language:', error_4);
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error' })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.skipPreferredLanguage = skipPreferredLanguage;
var registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    name: zod_1.z.string(),
    phone: zod_1.z.string().optional(),
});
var registerUser = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var siteSettings, body, _a, email, password, name_1, phone, passwordHash, appUser, server_1, accessToken_1, existing, newProfile, user, server, accessToken, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 8, , 9]);
                return [4 /*yield*/, Settings_1.SettingsModel.findOne().lean()];
            case 1:
                siteSettings = _b.sent();
                if (siteSettings === null || siteSettings === void 0 ? void 0 : siteSettings.maintenanceMode) {
                    return [2 /*return*/, reply.status(503).send({ success: false, message: 'The platform is currently under maintenance. Please try again later.', maintenance: true })];
                }
                if ((siteSettings === null || siteSettings === void 0 ? void 0 : siteSettings.userRegistration) === false) {
                    return [2 /*return*/, reply.status(403).send({ success: false, message: 'New user registration is currently disabled.' })];
                }
                body = registerSchema.safeParse(request.body);
                if (!body.success)
                    return [2 /*return*/, reply.status(400).send({ success: false, message: 'Validation failed', errors: body.error.flatten().fieldErrors })];
                _a = body.data, email = _a.email, password = _a.password, name_1 = _a.name, phone = _a.phone;
                return [4 /*yield*/, bcryptjs_1.default.hash(password, 10)];
            case 2:
                passwordHash = _b.sent();
                if (!phone) return [3 /*break*/, 5];
                return [4 /*yield*/, User_1.UserModel.findOne({ phone: phone, email: { $exists: false } })];
            case 3:
                appUser = _b.sent();
                if (!appUser) return [3 /*break*/, 5];
                appUser.email = email;
                appUser.passwordHash = passwordHash;
                if (!appUser.name || appUser.name === phone)
                    appUser.name = name_1;
                return [4 /*yield*/, appUser.save()];
            case 4:
                _b.sent();
                server_1 = request.server;
                accessToken_1 = server_1.jwt.sign({ id: appUser._id.toString(), name: appUser.name, role: 'user' }, { expiresIn: process.env.MOBILE_JWT_EXPIRES_IN || '7d' });
                return [2 /*return*/, reply.status(200).send({ success: true, accessToken: accessToken_1, userId: appUser._id.toString(), name: appUser.name, avatar: appUser.avatar || null, subscriptionPlan: appUser.subscriptionPlan || 'free', subscriptionStatus: appUser.subscriptionStatus || 'inactive', expiresIn: 604800, linked: true })];
            case 5: return [4 /*yield*/, User_1.UserModel.findOne({ email: email })];
            case 6:
                existing = _b.sent();
                if (existing)
                    return [2 /*return*/, reply.status(400).send({ success: false, message: 'Email already registered' })];
                newProfile = { name: name_1, isKids: false, maturityLevel: 18, language: 'Hindi' };
                user = new User_1.UserModel({ email: email, passwordHash: passwordHash, name: name_1, phone: phone || undefined, profiles: [newProfile], preferredLanguage: 'Hindi', languageSelectionSkipped: false });
                return [4 /*yield*/, user.save()];
            case 7:
                _b.sent();
                (0, email_1.sendTemplateEmail)('Registration', email, {
                    user_name: name_1,
                    site_url: process.env.FRONTEND_URL || process.env.ADMIN_PANEL_URL || 'http://localhost:5173',
                }).catch(function (err) { return console.error('[email] Registration email failed:', err); });
                server = request.server;
                accessToken = server.jwt.sign({ id: user._id.toString(), name: user.name, role: 'user' }, { expiresIn: process.env.MOBILE_JWT_EXPIRES_IN || '7d' });
                return [2 /*return*/, reply.status(200).send({ success: true, accessToken: accessToken, userId: user._id.toString(), name: user.name, avatar: user.avatar || null, subscriptionPlan: user.subscriptionPlan || 'free', subscriptionStatus: user.subscriptionStatus || 'inactive', expiresIn: 604800 })];
            case 8:
                error_5 = _b.sent();
                console.error('Register Error:', error_5);
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error' })];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.registerUser = registerUser;
// Login accepts email OR phone number (phone if no '@' in value)
var loginSchema = zod_1.z.object({ email: zod_1.z.string().min(1), password: zod_1.z.string() });
var loginUser = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var siteSettings, body, _a, emailOrPhone, password, isPhone, user, valid, server, accessToken, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                return [4 /*yield*/, Settings_1.SettingsModel.findOne().lean()];
            case 1:
                siteSettings = _b.sent();
                if (siteSettings === null || siteSettings === void 0 ? void 0 : siteSettings.maintenanceMode) {
                    return [2 /*return*/, reply.status(503).send({ success: false, message: 'The platform is currently under maintenance. Please try again later.', maintenance: true })];
                }
                body = loginSchema.safeParse(request.body);
                if (!body.success)
                    return [2 /*return*/, reply.status(400).send({ success: false, message: 'Validation failed' })];
                _a = body.data, emailOrPhone = _a.email, password = _a.password;
                isPhone = !emailOrPhone.includes('@');
                return [4 /*yield*/, User_1.UserModel.findOne(isPhone ? { phone: emailOrPhone } : { email: emailOrPhone })];
            case 2:
                user = _b.sent();
                if (!user)
                    return [2 /*return*/, reply.status(401).send({ success: false, message: 'No account found. Please register first.' })];
                if (user.status === 'banned' || user.status === 'suspended') {
                    return [2 /*return*/, reply.status(403).send({
                            success: false,
                            message: user.banReason ? "Your account has been suspended: ".concat(user.banReason) : 'Your account has been suspended.'
                        })];
                }
                if (!user.passwordHash)
                    return [2 /*return*/, reply.status(401).send({ success: false, message: 'This account uses phone OTP login. Please set a password first.' })];
                return [4 /*yield*/, bcryptjs_1.default.compare(password, user.passwordHash)];
            case 3:
                valid = _b.sent();
                if (!valid)
                    return [2 /*return*/, reply.status(401).send({ success: false, message: 'Invalid credentials' })];
                user.lastLogin = new Date();
                user.loginCount += 1;
                return [4 /*yield*/, user.save()];
            case 4:
                _b.sent();
                server = request.server;
                accessToken = server.jwt.sign({ id: user._id.toString(), name: user.name, role: 'user' }, { expiresIn: process.env.MOBILE_JWT_EXPIRES_IN || '7d' });
                return [2 /*return*/, reply.status(200).send({ success: true, accessToken: accessToken, userId: user._id.toString(), name: user.name, email: user.email || null, phone: user.phone || null, avatar: user.avatar || null, subscriptionPlan: user.subscriptionPlan || 'free', subscriptionStatus: user.subscriptionStatus || 'inactive', subscriptionExpiry: user.subscriptionExpiry || null, walletBalance: user.walletBalance || 0, profileLimitCount: user.profileLimitCount || 1, expiresIn: 604800 })];
            case 5:
                error_6 = _b.sent();
                console.error('Login Error:', error_6);
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Internal server error' })];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.loginUser = loginUser;
// ── Helper: sign a user JWT ────────────────────────────────────────────────
function signUserToken(request, user, deviceId) {
    var server = request.server;
    return server.jwt.sign({ id: user._id.toString(), name: user.name, role: 'user', deviceId: deviceId || 'unknown' }, { expiresIn: process.env.MOBILE_JWT_EXPIRES_IN || '7d' });
}
// ── Helper: find or create social user ────────────────────────────────────
function findOrCreateSocialUser(email, name, provider) {
    return __awaiter(this, void 0, void 0, function () {
        var user, defaultProfile, _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, User_1.UserModel.findOne({ email: email })];
                case 1:
                    user = _c.sent();
                    if (!!user) return [3 /*break*/, 4];
                    defaultProfile = { name: name, isKids: false, maturityLevel: 18, language: 'Hindi' };
                    _a = User_1.UserModel.bind;
                    _b = {
                        email: email
                    };
                    return [4 /*yield*/, bcryptjs_1.default.hash(Math.random().toString(36), 10)];
                case 2:
                    user = new (_a.apply(User_1.UserModel, [void 0, (_b.passwordHash = _c.sent(),
                            _b.name = name,
                            _b.profiles = [defaultProfile],
                            _b.preferredLanguage = 'Hindi',
                            _b.languageSelectionSkipped = false,
                            _b)]))();
                    return [4 /*yield*/, user.save()];
                case 3:
                    _c.sent();
                    (0, email_1.sendTemplateEmail)('Registration', email, { user_name: name, site_url: process.env.FRONTEND_URL || 'http://localhost:5173' }).catch(function () { });
                    _c.label = 4;
                case 4: return [2 /*return*/, user];
            }
        });
    });
}
// ── Google Sign In ─────────────────────────────────────────────────────────
var googleAuth = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var siteSettings, idToken, verifyRes, payload, user, accessToken, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4 /*yield*/, Settings_1.SettingsModel.findOne().lean()];
            case 1:
                siteSettings = _a.sent();
                if (siteSettings === null || siteSettings === void 0 ? void 0 : siteSettings.maintenanceMode) {
                    return [2 /*return*/, reply.status(503).send({ success: false, message: 'The platform is under maintenance.', maintenance: true })];
                }
                if (!(siteSettings === null || siteSettings === void 0 ? void 0 : siteSettings.socialLogin)) {
                    return [2 /*return*/, reply.status(403).send({ success: false, message: 'Social login is disabled.' })];
                }
                if (!(siteSettings === null || siteSettings === void 0 ? void 0 : siteSettings.googleClientId)) {
                    return [2 /*return*/, reply.status(400).send({ success: false, message: 'Google Sign In is not configured.' })];
                }
                idToken = request.body.idToken;
                if (!idToken)
                    return [2 /*return*/, reply.status(400).send({ success: false, message: 'idToken is required' })];
                return [4 /*yield*/, fetch("https://oauth2.googleapis.com/tokeninfo?id_token=".concat(encodeURIComponent(idToken)))];
            case 2:
                verifyRes = _a.sent();
                if (!verifyRes.ok)
                    return [2 /*return*/, reply.status(401).send({ success: false, message: 'Invalid Google token' })];
                return [4 /*yield*/, verifyRes.json()];
            case 3:
                payload = _a.sent();
                // Check audience matches our clientId
                if (payload.aud !== siteSettings.googleClientId && payload.azp !== siteSettings.googleClientId) {
                    return [2 /*return*/, reply.status(401).send({ success: false, message: 'Token audience mismatch' })];
                }
                if (!payload.email)
                    return [2 /*return*/, reply.status(400).send({ success: false, message: 'No email in Google token' })];
                return [4 /*yield*/, findOrCreateSocialUser(payload.email, payload.name || payload.email.split('@')[0], 'google')];
            case 4:
                user = _a.sent();
                accessToken = signUserToken(request, user);
                return [2 /*return*/, reply.send({ success: true, accessToken: accessToken, userId: user._id.toString(), name: user.name, subscriptionPlan: user.subscriptionPlan || 'free', subscriptionStatus: user.subscriptionStatus || 'inactive', expiresIn: 604800 })];
            case 5:
                error_7 = _a.sent();
                console.error('Google Auth Error:', error_7);
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Google authentication failed' })];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.googleAuth = googleAuth;
// ── Apple Sign In ──────────────────────────────────────────────────────────
var appleAuth = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var siteSettings, _a, idToken, appleUser, decoded_1, keysRes, keys, appleKey, jwkToPem, payload, pem, email, firstName, lastName, name_2, user, accessToken, error_8;
    var _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 5, , 6]);
                return [4 /*yield*/, Settings_1.SettingsModel.findOne().lean()];
            case 1:
                siteSettings = _e.sent();
                if (siteSettings === null || siteSettings === void 0 ? void 0 : siteSettings.maintenanceMode) {
                    return [2 /*return*/, reply.status(503).send({ success: false, message: 'The platform is under maintenance.', maintenance: true })];
                }
                if (!(siteSettings === null || siteSettings === void 0 ? void 0 : siteSettings.socialLogin)) {
                    return [2 /*return*/, reply.status(403).send({ success: false, message: 'Social login is disabled.' })];
                }
                if (!(siteSettings === null || siteSettings === void 0 ? void 0 : siteSettings.appleClientId)) {
                    return [2 /*return*/, reply.status(400).send({ success: false, message: 'Apple Sign In is not configured.' })];
                }
                _a = request.body, idToken = _a.idToken, appleUser = _a.user;
                if (!idToken)
                    return [2 /*return*/, reply.status(400).send({ success: false, message: 'idToken is required' })];
                decoded_1 = jsonwebtoken_1.default.decode(idToken, { complete: true });
                if (!((_b = decoded_1 === null || decoded_1 === void 0 ? void 0 : decoded_1.header) === null || _b === void 0 ? void 0 : _b.kid))
                    return [2 /*return*/, reply.status(401).send({ success: false, message: 'Invalid Apple token' })];
                return [4 /*yield*/, fetch('https://appleid.apple.com/auth/keys')];
            case 2:
                keysRes = _e.sent();
                if (!keysRes.ok)
                    return [2 /*return*/, reply.status(500).send({ success: false, message: 'Could not fetch Apple public keys' })];
                return [4 /*yield*/, keysRes.json()];
            case 3:
                keys = (_e.sent()).keys;
                appleKey = keys.find(function (k) { return k.kid === decoded_1.header.kid; });
                if (!appleKey)
                    return [2 /*return*/, reply.status(401).send({ success: false, message: 'Apple key not found' })];
                jwkToPem = function (jwk) {
                    var crypto = require('crypto');
                    var key = crypto.createPublicKey({ key: jwk, format: 'jwk' });
                    return key.export({ type: 'spki', format: 'pem' });
                };
                payload = void 0;
                try {
                    pem = jwkToPem(appleKey);
                    payload = jsonwebtoken_1.default.verify(idToken, pem, { algorithms: ['RS256'], audience: siteSettings.appleClientId, issuer: 'https://appleid.apple.com' });
                }
                catch (err) {
                    return [2 /*return*/, reply.status(401).send({ success: false, message: 'Apple token verification failed' })];
                }
                email = payload.email || (appleUser === null || appleUser === void 0 ? void 0 : appleUser.email);
                if (!email)
                    return [2 /*return*/, reply.status(400).send({ success: false, message: 'No email in Apple token' })];
                firstName = ((_c = appleUser === null || appleUser === void 0 ? void 0 : appleUser.name) === null || _c === void 0 ? void 0 : _c.firstName) || '';
                lastName = ((_d = appleUser === null || appleUser === void 0 ? void 0 : appleUser.name) === null || _d === void 0 ? void 0 : _d.lastName) || '';
                name_2 = [firstName, lastName].filter(Boolean).join(' ') || email.split('@')[0];
                return [4 /*yield*/, findOrCreateSocialUser(email, name_2, 'apple')];
            case 4:
                user = _e.sent();
                accessToken = signUserToken(request, user);
                return [2 /*return*/, reply.send({ success: true, accessToken: accessToken, userId: user._id.toString(), name: user.name, subscriptionPlan: user.subscriptionPlan || 'free', subscriptionStatus: user.subscriptionStatus || 'inactive', expiresIn: 604800 })];
            case 5:
                error_8 = _e.sent();
                console.error('Apple Auth Error:', error_8);
                return [2 /*return*/, reply.status(500).send({ success: false, message: 'Apple authentication failed' })];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.appleAuth = appleAuth;
// ── App Logout ─────────────────────────────────────────────────────────────
var logoutUser = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                // Verify the JWT is valid before processing logout
                return [4 /*yield*/, request.jwtVerify()];
            case 1:
                // Verify the JWT is valid before processing logout
                _a.sent();
                userId = request.user.id;
                if (!userId) return [3 /*break*/, 3];
                // Remove all devices for this user on logout
                return [4 /*yield*/, User_1.UserModel.findByIdAndUpdate(userId, {
                        $set: { devices: [] },
                    })];
            case 2:
                // Remove all devices for this user on logout
                _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/, reply.status(200).send({
                    success: true,
                    message: 'Logged out successfully',
                })];
            case 4:
                error_9 = _a.sent();
                // If JWT is invalid/expired, the user is already logged out — still return 200
                return [2 /*return*/, reply.status(200).send({
                        success: true,
                        message: 'Logged out successfully',
                    })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.logoutUser = logoutUser;
