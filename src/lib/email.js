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
exports.sendPasswordResetEmail = exports.sendRejectionEmail = exports.sendApprovalEmail = exports.sendAdminPasswordResetEmail = exports.sendWelcomeEmail = exports.sendTemplateEmail = void 0;
var nodemailer_1 = __importDefault(require("nodemailer"));
var Settings_1 = require("../models/Settings");
var NotificationTemplate_1 = require("../models/NotificationTemplate");
// Replace [[ variable_name ]] placeholders in a template string
var replaceVariables = function (template, variables) {
    return template.replace(/\[\[\s*([^\]]+?)\s*\]\]/g, function (_match, key) {
        var _a, _b;
        // Normalize the same way the dashboard does: lowercase + replace whitespace/apostrophe/slash with _
        var normalized = key.trim().toLowerCase().replace(/[\s'/]+/g, '_');
        return (_b = (_a = variables[normalized]) !== null && _a !== void 0 ? _a : variables[key.trim()]) !== null && _b !== void 0 ? _b : _match;
    });
};
var getPlatformName = function () { return __awaiter(void 0, void 0, void 0, function () {
    var settings, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Settings_1.SettingsModel.findOne().lean()];
            case 1:
                settings = _b.sent();
                return [2 /*return*/, (settings === null || settings === void 0 ? void 0 : settings.platformName) || process.env.PLATFORM_NAME || 'Braj Cinema TV'];
            case 2:
                _a = _b.sent();
                return [2 /*return*/, process.env.PLATFORM_NAME || 'Braj Cinema TV'];
            case 3: return [2 /*return*/];
        }
    });
}); };
// Wrap body content in a branded email shell. If content is already a full HTML doc, return as-is.
var wrapEmail = function (bodyContent, platformName) {
    if (/^<!DOCTYPE|^<html/i.test(bodyContent.trim()))
        return bodyContent;
    var inner = /<[a-z][\s\S]*>/i.test(bodyContent)
        ? bodyContent
        : bodyContent.replace(/\n/g, '<br>');
    return "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"utf-8\">\n  <meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">\n</head>\n<body style=\"margin:0;padding:0;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;\">\n  <table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"100%\" style=\"background:#f4f4f4;padding:30px 10px;\">\n    <tr><td align=\"center\">\n      <table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"100%\" style=\"max-width:600px;\">\n        <tr>\n          <td style=\"background:linear-gradient(135deg,#ef4444 0%,#dc2626 100%);padding:28px 40px;border-radius:10px 10px 0 0;text-align:center;\">\n            <h1 style=\"color:#fff;margin:0;font-size:22px;font-weight:700;letter-spacing:0.5px;\">".concat(platformName, "</h1>\n          </td>\n        </tr>\n        <tr>\n          <td style=\"background:#fff;padding:32px 40px;border:1px solid #e5e7eb;border-top:none;color:#374151;font-size:15px;line-height:1.7;\">\n            ").concat(inner, "\n          </td>\n        </tr>\n        <tr>\n          <td style=\"background:#f9fafb;padding:20px 40px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 10px 10px;text-align:center;\">\n            <p style=\"color:#9ca3af;font-size:12px;margin:0;\">\u00A9 ").concat(new Date().getFullYear(), " ").concat(platformName, ". All rights reserved.</p>\n            <p style=\"color:#d1d5db;font-size:11px;margin:5px 0 0;\">This is an automated message \u2014 please do not reply.</p>\n          </td>\n        </tr>\n      </table>\n    </td></tr>\n  </table>\n</body>\n</html>");
};
// Get mail config — prefers DB settings, falls back to env vars
var getMailConfig = function () { return __awaiter(void 0, void 0, void 0, function () {
    var settings, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Settings_1.SettingsModel.findOne().lean()];
            case 1:
                settings = _b.sent();
                if (settings && settings.mailUsername && settings.mailPassword) {
                    return [2 /*return*/, {
                            host: settings.mailHost || process.env.EMAIL_HOST || 'smtp.gmail.com',
                            port: parseInt(settings.mailPort || process.env.EMAIL_PORT || '587', 10),
                            secure: settings.mailEncryption === 'ssl',
                            auth: {
                                user: settings.mailUsername,
                                pass: settings.mailPassword,
                            },
                            from: settings.mailFrom || settings.mailUsername,
                            fromName: settings.mailFromName || settings.platformName || 'Admin Panel',
                        }];
                }
                return [3 /*break*/, 3];
            case 2:
                _a = _b.sent();
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/, {
                    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
                    port: parseInt(process.env.EMAIL_PORT || '587', 10),
                    secure: process.env.EMAIL_SECURE === 'true',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    },
                    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
                    fromName: process.env.EMAIL_FROM_NAME || 'Admin Panel',
                }];
        }
    });
}); };
var createTransporter = function () { return __awaiter(void 0, void 0, void 0, function () {
    var config;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getMailConfig()];
            case 1:
                config = _a.sent();
                if (!config.auth.user || !config.auth.pass) {
                    console.warn('Email credentials not configured. Set mailUsername/mailPassword in Settings or EMAIL_USER/EMAIL_PASS in .env');
                    return [2 /*return*/, null];
                }
                return [2 /*return*/, {
                        transporter: nodemailer_1.default.createTransport({
                            host: config.host,
                            port: config.port,
                            secure: config.secure,
                            auth: config.auth,
                        }),
                        from: "\"".concat(config.fromName, "\" <").concat(config.from || config.auth.user, ">"),
                    }];
        }
    });
}); };
/**
 * Core dynamic email sender.
 * Looks up NotificationTemplate by `type`, replaces [[ variable ]] placeholders,
 * wraps in branded HTML shell, and sends via nodemailer.
 * Logs and returns false (without throwing) if template missing/disabled or mail not configured.
 */
var sendTemplateEmail = function (type, to, variables) { return __awaiter(void 0, void 0, void 0, function () {
    var result, transporter, from, platformName, template, subject, html, allVars, bodyContent, rows, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, createTransporter()];
            case 1:
                result = _a.sent();
                if (!result) {
                    console.log("[email] Skipped (no credentials). type=".concat(type, " to=").concat(to));
                    return [2 /*return*/, false];
                }
                transporter = result.transporter, from = result.from;
                _a.label = 2;
            case 2:
                _a.trys.push([2, 6, , 7]);
                return [4 /*yield*/, getPlatformName()];
            case 3:
                platformName = _a.sent();
                return [4 /*yield*/, NotificationTemplate_1.NotificationTemplateModel.findOne({ type: type }).lean()];
            case 4:
                template = _a.sent();
                subject = void 0;
                html = void 0;
                allVars = __assign({ platform_name: platformName }, variables);
                if (template && template.status && template.emailTemplate) {
                    subject = replaceVariables(template.emailSubject || type, allVars);
                    bodyContent = replaceVariables(template.emailTemplate, allVars);
                    html = wrapEmail(bodyContent, platformName);
                }
                else {
                    // Minimal fallback — still sends something meaningful
                    subject = type;
                    rows = Object.entries(allVars)
                        .filter(function (_a) {
                        var k = _a[0], v = _a[1];
                        return v && k !== 'platform_name';
                    })
                        .map(function (_a) {
                        var k = _a[0], v = _a[1];
                        return "<tr><td style=\"padding:6px 0;color:#6b7280;font-size:13px;width:140px;text-transform:capitalize;\">".concat(k.replace(/_/g, ' '), "</td><td style=\"padding:6px 0;color:#111827;font-weight:600;\">").concat(v, "</td></tr>");
                    })
                        .join('');
                    html = wrapEmail("<p>You have a new notification from <strong>".concat(platformName, "</strong>.</p><table style=\"border-collapse:collapse;width:100%;margin-top:16px;\">").concat(rows, "</table>"), platformName);
                }
                return [4 /*yield*/, transporter.sendMail({ from: from, to: to, subject: subject, html: html })];
            case 5:
                _a.sent();
                console.log("[email] Sent type=".concat(type, " to=").concat(to));
                return [2 /*return*/, true];
            case 6:
                error_1 = _a.sent();
                console.error("[email] Failed type=".concat(type, " to=").concat(to, ":"), error_1);
                return [2 /*return*/, false];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.sendTemplateEmail = sendTemplateEmail;
// ---- Named convenience wrappers (backward-compatible) ----
var sendWelcomeEmail = function (email, name, username, password) { return __awaiter(void 0, void 0, void 0, function () {
    var result, transporter, from, platformName, template, subject, html, variables, bodyContent, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, createTransporter()];
            case 1:
                result = _a.sent();
                if (!result) {
                    console.log("[email] Skipped welcome email (no credentials). to=".concat(email));
                    return [2 /*return*/, false];
                }
                transporter = result.transporter, from = result.from;
                _a.label = 2;
            case 2:
                _a.trys.push([2, 6, , 7]);
                return [4 /*yield*/, getPlatformName()];
            case 3:
                platformName = _a.sent();
                return [4 /*yield*/, NotificationTemplate_1.NotificationTemplateModel.findOne({ type: 'Admin Credentials' }).lean()];
            case 4:
                template = _a.sent();
                subject = void 0;
                html = void 0;
                variables = {
                    platform_name: platformName,
                    user_name: name,
                    user_id: username,
                    user_password: password,
                    site_url: process.env.ADMIN_PANEL_URL || 'http://localhost:5173',
                };
                if (template && template.status && template.emailTemplate) {
                    subject = replaceVariables(template.emailSubject || 'Your Admin Panel Credentials', variables);
                    bodyContent = replaceVariables(template.emailTemplate, variables);
                    html = wrapEmail(bodyContent, platformName);
                }
                else {
                    // Beautiful default welcome email with clear credentials
                    subject = "Your ".concat(platformName, " Admin Panel Login Credentials");
                    html = wrapEmail("\n        <p>Hi <strong>".concat(name, "</strong>,</p>\n        <p>Welcome to <strong>").concat(platformName, "</strong>! Your admin panel account has been created successfully.</p>\n        <p style=\"margin-top:20px;\">Here are your login credentials:</p>\n        <table style=\"border-collapse:collapse;width:100%;max-width:400px;margin-top:12px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;\">\n          <tr>\n            <td style=\"padding:14px 18px;color:#6b7280;font-size:13px;width:120px;background:#fff;border-bottom:1px solid #e5e7eb;\">Login ID</td>\n            <td style=\"padding:14px 18px;color:#111827;font-weight:700;font-size:14px;background:#fff;border-bottom:1px solid #e5e7eb;\">").concat(username, "</td>\n          </tr>\n          <tr>\n            <td style=\"padding:14px 18px;color:#6b7280;font-size:13px;width:120px;background:#fff;\">Password</td>\n            <td style=\"padding:14px 18px;color:#dc2626;font-weight:700;font-size:14px;background:#fff;font-family:monospace;\">").concat(password, "</td>\n          </tr>\n        </table>\n        <p style=\"margin-top:20px;\">\n          <a href=\"").concat(process.env.ADMIN_PANEL_URL || 'http://localhost:5173', "/admin/login\" \n             style=\"display:inline-block;background:linear-gradient(135deg,#ef4444 0%,#dc2626 100%);color:#fff;text-decoration:none;padding:12px 28px;border-radius:6px;font-weight:600;font-size:14px;\">\n            Log In to Admin Panel\n          </a>\n        </p>\n        <p style=\"margin-top:24px;color:#6b7280;font-size:13px;\">\n          <strong style=\"color:#dc2626;\">Important:</strong> For security reasons, please change your password after your first login. Do not share these credentials with anyone.\n        </p>\n      "), platformName);
                }
                return [4 /*yield*/, transporter.sendMail({ from: from, to: email, subject: subject, html: html })];
            case 5:
                _a.sent();
                console.log("[email] Sent welcome credentials to=".concat(email));
                return [2 /*return*/, true];
            case 6:
                error_2 = _a.sent();
                console.error("[email] Failed welcome email to=".concat(email, ":"), error_2);
                return [2 /*return*/, false];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.sendWelcomeEmail = sendWelcomeEmail;
var sendAdminPasswordResetEmail = function (email, name, username, password) { return __awaiter(void 0, void 0, void 0, function () {
    var result, transporter, from, platformName, template, subject, html, variables, bodyContent, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, createTransporter()];
            case 1:
                result = _a.sent();
                if (!result) {
                    console.log("[email] Skipped password reset email (no credentials). to=".concat(email));
                    return [2 /*return*/, false];
                }
                transporter = result.transporter, from = result.from;
                _a.label = 2;
            case 2:
                _a.trys.push([2, 6, , 7]);
                return [4 /*yield*/, getPlatformName()];
            case 3:
                platformName = _a.sent();
                return [4 /*yield*/, NotificationTemplate_1.NotificationTemplateModel.findOne({ type: 'Admin Password Reset' }).lean()];
            case 4:
                template = _a.sent();
                subject = void 0;
                html = void 0;
                variables = {
                    platform_name: platformName,
                    user_name: name,
                    user_id: username,
                    user_password: password,
                    site_url: process.env.ADMIN_PANEL_URL || 'http://localhost:5173',
                };
                if (template && template.status && template.emailTemplate) {
                    subject = replaceVariables(template.emailSubject || 'Your Admin Password Has Been Reset', variables);
                    bodyContent = replaceVariables(template.emailTemplate, variables);
                    html = wrapEmail(bodyContent, platformName);
                }
                else {
                    // Beautiful default password reset email with clear credentials
                    subject = "Your ".concat(platformName, " Admin Password Has Been Reset");
                    html = wrapEmail("\n        <p>Hi <strong>".concat(name, "</strong>,</p>\n        <p>Your <strong>").concat(platformName, "</strong> admin panel password has been reset by an administrator.</p>\n        <p style=\"margin-top:20px;\">Here are your updated login credentials:</p>\n        <table style=\"border-collapse:collapse;width:100%;max-width:400px;margin-top:12px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;\">\n          <tr>\n            <td style=\"padding:14px 18px;color:#6b7280;font-size:13px;width:120px;background:#fff;border-bottom:1px solid #e5e7eb;\">Login ID</td>\n            <td style=\"padding:14px 18px;color:#111827;font-weight:700;font-size:14px;background:#fff;border-bottom:1px solid #e5e7eb;\">").concat(username, "</td>\n          </tr>\n          <tr>\n            <td style=\"padding:14px 18px;color:#6b7280;font-size:13px;width:120px;background:#fff;\">New Password</td>\n            <td style=\"padding:14px 18px;color:#dc2626;font-weight:700;font-size:14px;background:#fff;font-family:monospace;\">").concat(password, "</td>\n          </tr>\n        </table>\n        <p style=\"margin-top:20px;\">\n          <a href=\"").concat(process.env.ADMIN_PANEL_URL || 'http://localhost:5173', "/admin/login\" \n             style=\"display:inline-block;background:linear-gradient(135deg,#ef4444 0%,#dc2626 100%);color:#fff;text-decoration:none;padding:12px 28px;border-radius:6px;font-weight:600;font-size:14px;\">\n            Log In to Admin Panel\n          </a>\n        </p>\n        <p style=\"margin-top:24px;color:#6b7280;font-size:13px;\">\n          <strong style=\"color:#dc2626;\">Important:</strong> For security reasons, please change your password after logging in. If you did not request this reset, contact your administrator immediately.\n        </p>\n      "), platformName);
                }
                return [4 /*yield*/, transporter.sendMail({ from: from, to: email, subject: subject, html: html })];
            case 5:
                _a.sent();
                console.log("[email] Sent password reset credentials to=".concat(email));
                return [2 /*return*/, true];
            case 6:
                error_3 = _a.sent();
                console.error("[email] Failed password reset email to=".concat(email, ":"), error_3);
                return [2 /*return*/, false];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.sendAdminPasswordResetEmail = sendAdminPasswordResetEmail;
var sendApprovalEmail = function (email, name, itemType, itemName) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, (0, exports.sendTemplateEmail)('Content Approved', email, {
                user_name: name,
                content_type: itemType,
                movie_name: itemName,
                site_url: process.env.ADMIN_PANEL_URL || 'http://localhost:5173',
            })];
    });
}); };
exports.sendApprovalEmail = sendApprovalEmail;
var sendRejectionEmail = function (email, name, itemType, itemName, reason) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, (0, exports.sendTemplateEmail)('Content Rejected', email, {
                user_name: name,
                content_type: itemType,
                movie_name: itemName,
                description_note: reason,
                site_url: process.env.ADMIN_PANEL_URL || 'http://localhost:5173',
            })];
    });
}); };
exports.sendRejectionEmail = sendRejectionEmail;
var sendPasswordResetEmail = function (email, name, resetToken) { return __awaiter(void 0, void 0, void 0, function () {
    var resetUrl;
    return __generator(this, function (_a) {
        resetUrl = "".concat(process.env.ADMIN_PANEL_URL || 'http://localhost:5173', "/reset-password?token=").concat(resetToken);
        return [2 /*return*/, (0, exports.sendTemplateEmail)('Admin Password Reset', email, {
                user_name: name,
                otp_code: resetToken,
                site_url: resetUrl,
            })];
    });
}); };
exports.sendPasswordResetEmail = sendPasswordResetEmail;
