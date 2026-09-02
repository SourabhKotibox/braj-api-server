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
exports.LiveChannelModel = void 0;
var mongoose_1 = __importStar(require("mongoose"));
var LiveChannelSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    logo: { type: String, required: true },
    bannerImage: String,
    description: String,
    category: {
        type: String,
        enum: ['news', 'sports', 'entertainment', 'kids', 'movies', 'music', 'devotional', 'lifestyle', 'education', 'business'],
        required: true,
    },
    language: { type: String, default: 'English' },
    country: { type: String, default: 'India' },
    streamUrl: { type: String, required: true },
    backupStreamUrl: String,
    isActive: { type: Boolean, default: true, index: true },
    isPremium: { type: Boolean, default: false },
    isHD: { type: Boolean, default: false },
    is4K: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    currentViewers: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    currentProgram: {
        title: String,
        description: String,
        startTime: Date,
        endTime: Date,
        thumbnail: String,
        genre: String,
    },
    nextProgram: {
        title: String,
        description: String,
        startTime: Date,
        endTime: Date,
        thumbnail: String,
        genre: String,
    },
    planRequired: { type: String, enum: ['free', 'basic', 'standard', 'premium'], default: 'premium' },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
LiveChannelSchema.index({ category: 1, isActive: 1 });
exports.LiveChannelModel = mongoose_1.default.model('LiveChannel', LiveChannelSchema);
