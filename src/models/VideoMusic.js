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
exports.VideoMusicModel = void 0;
var mongoose_1 = __importStar(require("mongoose"));
var VideoMusicSchema = new mongoose_1.Schema({
    title: { type: String, required: true, index: true },
    artist: { type: String, required: true, index: true },
    album: String,
    description: String,
    thumbnail: String,
    coverImage: String,
    bannerImage: String,
    videoUrl: String,
    hlsUrl: String,
    duration: Number,
    genre: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Genre' },
    category: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Category' },
    language: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Language' },
    tags: { type: [String], default: [] },
    status: {
        type: String,
        enum: ['published', 'draft', 'processing'],
        default: 'draft',
    },
    processingStatus: {
        type: String,
        enum: ['queued', 'processing', 'ready', 'failed'],
    },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    isNewContent: { type: Boolean, default: true },
    downloadAllowed: { type: Boolean, default: true },
    planRequired: { type: String, enum: ['free', 'basic', 'standard', 'premium'], default: 'free' },
    releaseDate: Date,
    videoQualities: [
        {
            quality: { type: String, enum: ['144p', '240p', '360p', '480p', '720p', '1080p'] },
            url: String,
            size: Number,
        },
    ],
}, { timestamps: true });
VideoMusicSchema.index({ title: 'text', artist: 'text', album: 'text', tags: 'text' });
VideoMusicSchema.index({ status: 1 });
VideoMusicSchema.index({ genre: 1 });
VideoMusicSchema.index({ category: 1 });
VideoMusicSchema.index({ trending: 1, featured: 1 });
exports.VideoMusicModel = mongoose_1.default.model('VideoMusic', VideoMusicSchema);
