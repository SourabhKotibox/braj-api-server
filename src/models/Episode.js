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
exports.EpisodeModel = void 0;
var adminAuditPlugin_1 = require("../middlewares/adminAuditPlugin");
var mediaLinkerPlugin_1 = require("../middlewares/mediaLinkerPlugin");
var mongoose_1 = __importStar(require("mongoose"));
var EpisodeSchema = new mongoose_1.Schema({
    contentId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Content', required: true, index: true },
    season: { type: Number, required: true, min: 1 },
    episode: { type: Number, required: true, min: 1 },
    title: { type: String, required: true },
    description: String,
    thumbnail: String,
    sourceVideoUrl: String,
    sourceStartSeconds: Number,
    sourceEndSeconds: Number,
    hlsUrl: String,
    hlsS3Prefix: String,
    videoQualities: [
        {
            quality: { type: String, enum: ['144p', '240p', '360p', '480p', '720p', '1080p', '1440p', '2160p'] },
            url: String,
            size: Number,
        },
    ],
    trailerUrl: String,
    duration: Number,
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    downloadAllowed: { type: Boolean, default: true },
    subtitleLanguages: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Language' }],
    audioLanguages: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Language' }],
    subtitles: [{ language: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Language' }, filePath: String }],
    airDate: Date,
    isFree: { type: Boolean, default: false },
    isLocked: { type: Boolean, default: true, index: true },
    coinsRequired: { type: Number, default: 0 },
    processingStatus: {
        type: String,
        enum: ['queued', 'processing', 'ready', 'failed'],
        default: 'queued',
        index: true,
    },
    processingError: String,
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
EpisodeSchema.index({ contentId: 1, season: 1, episode: 1 }, { unique: true });
EpisodeSchema.plugin(adminAuditPlugin_1.adminAuditPlugin);
EpisodeSchema.plugin(mediaLinkerPlugin_1.mediaLinkerPlugin);
exports.EpisodeModel = mongoose_1.default.model('Episode', EpisodeSchema);
