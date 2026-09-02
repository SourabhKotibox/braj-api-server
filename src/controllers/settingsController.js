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
exports.testEmail = exports.getEmailStatus = exports.uploadSettingsLogos = exports.updateSettings = exports.getSettings = void 0;
var Settings_1 = require("../models/Settings");
var uploadHandler_1 = __importDefault(require("../lib/uploadHandler"));
var envUpdater_1 = require("../lib/envUpdater");
var email_1 = require("../lib/email");
function getOrCreateSettings() {
    return __awaiter(this, void 0, void 0, function () {
        var settings;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Settings_1.SettingsModel.findOne()];
                case 1:
                    settings = _a.sent();
                    if (!!settings) return [3 /*break*/, 3];
                    return [4 /*yield*/, Settings_1.SettingsModel.create({})];
                case 2:
                    settings = _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/, settings];
            }
        });
    });
}
var getSettings = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var settings, isAdmin, decodedUser, checkUserPermission, permResult, _a, publicSettings, sensitiveFields, _i, sensitiveFields_1, field, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 9, , 10]);
                return [4 /*yield*/, getOrCreateSettings()];
            case 1:
                settings = _b.sent();
                isAdmin = false;
                _b.label = 2;
            case 2:
                _b.trys.push([2, 7, , 8]);
                return [4 /*yield*/, request.jwtVerify()];
            case 3:
                _b.sent();
                decodedUser = request.user;
                if (!(decodedUser === null || decodedUser === void 0 ? void 0 : decodedUser.id)) return [3 /*break*/, 6];
                return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../middlewares/rbac')); })];
            case 4:
                checkUserPermission = (_b.sent()).checkUserPermission;
                return [4 /*yield*/, checkUserPermission(decodedUser.id, 'settings', 'canView')];
            case 5:
                permResult = _b.sent();
                if (permResult.allowed) {
                    isAdmin = true;
                }
                _b.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                _a = _b.sent();
                return [3 /*break*/, 8];
            case 8:
                if (isAdmin) {
                    return [2 /*return*/, reply.send({
                            success: true,
                            data: settings
                        })];
                }
                else {
                    publicSettings = settings.toObject ? settings.toObject() : __assign({}, settings);
                    sensitiveFields = [
                        'mailEmail', 'mailDriver', 'mailHost', 'mailPort', 'mailEncryption', 'mailUsername', 'mailPassword', 'mailFrom', 'mailFromName',
                        'awsAccessKeyId', 'awsSecretAccessKey', 'awsRegion', 'awsBucket', 'awsPathStyleEndpoint', 'bunnyStorageZone', 'bunnyAccessKey',
                        'fcmServerKey', 'fcmSenderId', 'firebaseApiKey', 'firebaseProjectId', 'firebaseAppId'
                    ];
                    for (_i = 0, sensitiveFields_1 = sensitiveFields; _i < sensitiveFields_1.length; _i++) {
                        field = sensitiveFields_1[_i];
                        delete publicSettings[field];
                    }
                    return [2 /*return*/, reply.send({
                            success: true,
                            data: publicSettings
                        })];
                }
                return [3 /*break*/, 10];
            case 9:
                error_1 = _b.sent();
                console.error(error_1);
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_1.message })];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.getSettings = getSettings;
var updateSettings = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var body, settings, envUpdates, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                body = request.body;
                return [4 /*yield*/, Settings_1.SettingsModel.findOneAndUpdate({}, { $set: body }, { returnDocument: 'after', upsert: true })];
            case 1:
                settings = _a.sent();
                envUpdates = {};
                if (body.mailHost !== undefined)
                    envUpdates.EMAIL_HOST = body.mailHost;
                if (body.mailPort !== undefined)
                    envUpdates.EMAIL_PORT = String(body.mailPort);
                if (body.mailEncryption !== undefined)
                    envUpdates.EMAIL_SECURE = body.mailEncryption === 'ssl' ? 'true' : 'false';
                if (body.mailUsername !== undefined)
                    envUpdates.EMAIL_USER = body.mailUsername;
                if (body.mailPassword !== undefined && body.mailPassword)
                    envUpdates.EMAIL_PASS = body.mailPassword;
                if (body.mailFrom !== undefined)
                    envUpdates.EMAIL_FROM = body.mailFrom;
                if (body.mailFromName !== undefined)
                    envUpdates.EMAIL_FROM_NAME = body.mailFromName;
                if (Object.keys(envUpdates).length > 0) {
                    (0, envUpdater_1.updateEnvFile)(envUpdates);
                }
                return [2 /*return*/, reply.send({
                        success: true,
                        data: settings
                    })];
            case 2:
                error_2 = _a.sent();
                console.error(error_2);
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_2.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateSettings = updateSettings;
// File field name -> Settings model field name
var LOGO_FIELD_MAP = {
    logo: 'logoUrl',
    darkLogo: 'darkLogoUrl',
    lightLogo: 'lightLogoUrl',
    favicon: 'faviconUrl',
};
var uploadSettingsLogos = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var parts, updates, _a, parts_1, parts_1_1, part, uploadedFile, e_1_1, settings, error_3;
    var _b, e_1, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 15, , 16]);
                parts = request.parts();
                updates = {};
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
                if (!(part.type === 'file' && LOGO_FIELD_MAP[part.fieldname])) return [3 /*break*/, 5];
                return [4 /*yield*/, uploadHandler_1.default.saveFileFromPart(part, request, 'IMAGE')];
            case 4:
                uploadedFile = _e.sent();
                updates[LOGO_FIELD_MAP[part.fieldname]] = uploadedFile.filePath;
                _e.label = 5;
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
                if (Object.keys(updates).length === 0) {
                    return [2 /*return*/, reply.status(400).send({ success: false, error: 'No logo files provided' })];
                }
                return [4 /*yield*/, Settings_1.SettingsModel.findOneAndUpdate({}, { $set: updates }, { returnDocument: 'after', upsert: true })];
            case 14:
                settings = _e.sent();
                return [2 /*return*/, reply.send({
                        success: true,
                        data: settings
                    })];
            case 15:
                error_3 = _e.sent();
                console.error(error_3);
                return [2 /*return*/, reply.status(500).send({ success: false, error: 'Upload failed' })];
            case 16: return [2 /*return*/];
        }
    });
}); };
exports.uploadSettingsLogos = uploadSettingsLogos;
var getEmailStatus = function (_request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var settings, hasCredentials, hasEnvCredentials, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Settings_1.SettingsModel.findOne().lean()];
            case 1:
                settings = _a.sent();
                hasCredentials = !!(settings && settings.mailUsername && settings.mailPassword);
                hasEnvCredentials = !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);
                return [2 /*return*/, reply.send({
                        success: true,
                        data: {
                            configured: hasCredentials || hasEnvCredentials,
                            fromDb: hasCredentials,
                            fromEnv: hasEnvCredentials,
                            host: (settings === null || settings === void 0 ? void 0 : settings.mailHost) || process.env.EMAIL_HOST || 'smtp.gmail.com',
                            port: (settings === null || settings === void 0 ? void 0 : settings.mailPort) || process.env.EMAIL_PORT || '587',
                            username: ((settings === null || settings === void 0 ? void 0 : settings.mailUsername) || process.env.EMAIL_USER || '').replace(/./g, '*'),
                            from: (settings === null || settings === void 0 ? void 0 : settings.mailFrom) || process.env.EMAIL_FROM || (settings === null || settings === void 0 ? void 0 : settings.mailUsername) || process.env.EMAIL_USER || '',
                        }
                    })];
            case 2:
                error_4 = _a.sent();
                console.error(error_4);
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_4.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getEmailStatus = getEmailStatus;
var testEmail = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var body, to, sent, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                body = request.body;
                to = (body === null || body === void 0 ? void 0 : body.to) || 'test@example.com';
                return [4 /*yield*/, (0, email_1.sendWelcomeEmail)(to, 'Test User', to, 'TestPassword123!')];
            case 1:
                sent = _a.sent();
                if (sent) {
                    return [2 /*return*/, reply.send({ success: true, message: 'Test email sent successfully. Check your inbox.' })];
                }
                return [2 /*return*/, reply.status(400).send({
                        success: false,
                        error: 'Email not sent. SMTP credentials are not configured.',
                        hint: 'Go to Settings → Mail and configure mailUsername, mailPassword, mailHost, and mailPort. Or set EMAIL_USER and EMAIL_PASS in your .env file.'
                    })];
            case 2:
                error_5 = _a.sent();
                console.error(error_5);
                return [2 /*return*/, reply.status(500).send({ success: false, error: error_5.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.testEmail = testEmail;
