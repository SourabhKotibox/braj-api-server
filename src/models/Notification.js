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
exports.NotificationModel = void 0;
var mongoose_1 = __importStar(require("mongoose"));
var NotificationSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    imageUrl: String,
    deepLink: String,
    type: {
        type: String,
        enum: ['content_release', 'subscription', 'system', 'promotional', 'reminder', 'alert'],
        default: 'system',
    },
    targetAudience: {
        type: String,
        enum: ['all', 'premium', 'standard', 'basic', 'free', 'inactive'],
        default: 'all',
    },
    targetUserIds: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    scheduledAt: Date,
    sentAt: Date,
    status: {
        type: String,
        enum: ['draft', 'scheduled', 'sending', 'sent', 'failed'],
        default: 'draft',
        index: true,
    },
    metrics: {
        targetCount: { type: Number, default: 0 },
        sentCount: { type: Number, default: 0 },
        openedCount: { type: Number, default: 0 },
        clickedCount: { type: Number, default: 0 },
    },
    contentId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Content' },
    priority: { type: String, enum: ['low', 'normal', 'high'], default: 'normal' },
    createdBy: String,
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
exports.NotificationModel = mongoose_1.default.model('Notification', NotificationSchema);
