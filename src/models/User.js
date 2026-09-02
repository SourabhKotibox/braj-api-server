"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
var adminAuditPlugin_1 = require("../middlewares/adminAuditPlugin");
var mongoose_1 = __importStar(require("mongoose"));
var UserSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true, index: true, lowercase: true },
    name: { type: String, required: true },
    phone: String,
    avatar: String,
    passwordHash: String,
    subscriptionPlan: {
        type: String,
        enum: ['free', 'basic', 'standard', 'premium'],
        default: 'free',
    },
    subscriptionStatus: {
        type: String,
        enum: ['active', 'inactive', 'cancelled', 'expired'],
        default: 'active',
    },
    subscriptionExpiry: Date,
    subscriptionPlanId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'SubscriptionPlan' },
    profiles: [
        {
            name: { type: String, required: true },
            avatar: String,
            isKids: { type: Boolean, default: false },
            language: String,
            maturityLevel: { type: Number, default: 18 },
        },
    ],
    devices: [
        {
            deviceId: String,
            deviceType: { type: String, enum: ['mobile', 'tablet', 'web', 'tv', 'other'] },
            deviceName: String,
            lastSeen: { type: Date, default: Date.now },
        },
    ],
    preferredLanguage: { type: String, default: 'Hindi' },
    languageSelectionSkipped: { type: Boolean, default: false },
    preferredRegion: String,
    watchlistCount: { type: Number, default: 0 },
    totalWatchTime: { type: Number, default: 0 },
    videoQuality: { type: String, enum: ['auto', 'best', 'data_saver'], default: 'auto' },
    status: { type: String, enum: ['active', 'banned', 'suspended'], default: 'active' },
    banReason: String,
    referralCode: String,
    referredBy: String,
    lastLogin: Date,
    loginCount: { type: Number, default: 0 },
    walletBalance: { type: Number, default: 0 },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
UserSchema.index({ subscriptionPlan: 1, subscriptionStatus: 1 });
UserSchema.index({ status: 1 });
UserSchema.plugin(adminAuditPlugin_1.adminAuditPlugin);
exports.UserModel = mongoose_1.default.model('User', UserSchema);
