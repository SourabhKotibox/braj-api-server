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
exports.BannerModel = void 0;
var mongoose_1 = __importStar(require("mongoose"));
var BannerSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    subtitle: String,
    description: String,
    imageUrl: { type: String, required: true },
    mobileImageUrl: String,
    ctaText: { type: String, default: 'Watch Now' },
    ctaLink: String,
    contentId: { type: mongoose_1.Schema.Types.ObjectId, refPath: 'contentModel' },
    contentModel: { type: String, enum: ['Content', 'Movie', 'Audio', 'VideoMusic'] },
    type: {
        type: String,
        enum: ['hero', 'featured', 'promotional', 'category'],
        default: 'hero',
    },
    contentType: {
        type: String,
        enum: ['drama', 'movie', 'series', 'audio', 'video-music', 'both'],
        default: 'both',
    },
    position: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
    targetPlatforms: {
        type: [String],
        enum: ['web', 'mobile', 'tv'],
        default: ['web', 'mobile'],
    },
    targetPages: {
        type: [String],
        enum: ['home', 'movies', 'tvshows', 'music', 'videos'],
        default: ['home'],
    },
    startDate: Date,
    endDate: Date,
    clickCount: { type: Number, default: 0 },
    impressionCount: { type: Number, default: 0 },
    backgroundColor: String,
    textColor: String,
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
BannerSchema.index({ isActive: 1, position: 1 });
BannerSchema.index({ targetPages: 1, isActive: 1 });
exports.BannerModel = mongoose_1.default.model('Banner', BannerSchema);
