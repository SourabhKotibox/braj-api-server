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
exports.MovieModel = void 0;
var adminAuditPlugin_1 = require("../middlewares/adminAuditPlugin");
var mediaLinkerPlugin_1 = require("../middlewares/mediaLinkerPlugin");
var mongoose_1 = __importStar(require("mongoose"));
var MovieSchema = new mongoose_1.Schema({
    title: { type: String, required: true, index: true },
    originalTitle: String,
    description: String,
    shortDescription: String,
    thumbnail: String,
    bannerImage: String,
    posterImage: String,
    trailerUrl: String,
    genres: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Genre' }],
    categories: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Category' }],
    sections: { type: [String], default: [] },
    languages: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Language' }],
    subtitleLanguages: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Language' }],
    audioLanguages: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Language' }],
    year: Number,
    rating: String,
    ageRating: { type: Number, default: 0 },
    duration: Number,
    releaseDate: Date,
    status: {
        type: String,
        enum: ['published', 'draft', 'processing', 'moderation', 'rejected'],
        default: 'draft',
    },
    processingStatus: {
        type: String,
        enum: ['queued', 'processing', 'ready', 'failed'],
    },
    processingError: String,
    rejectionReason: String,
    approvedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'AdminUser' },
    approvedAt: Date,
    rejectedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'AdminUser' },
    rejectedAt: Date,
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'AdminUser' },
    hlsUrl: String,
    videoUrl: String,
    hlsS3Prefix: String,
    videoQualities: [
        {
            quality: { type: String, enum: ['144p', '240p', '360p', '480p', '720p', '1080p', '1440p', '2160p'] },
            url: String,
            size: Number,
        },
    ],
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    isNewContent: { type: Boolean, default: true },
    isExclusive: { type: Boolean, default: false },
    downloadAllowed: { type: Boolean, default: true },
    cast: [{ actor: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Actor' }, character: String, role: String }],
    crew: [{ director: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Director' }, role: String }],
    producer: String,
    studio: String,
    country: String,
    tags: { type: [String], default: [] },
    imdbRating: { type: Number, min: 0, max: 10 },
    maturityContent: { type: [String], default: [] },
    subtitles: [{ language: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Language' }, filePath: String }],
    planRequired: { type: String, enum: ['free', 'basic', 'standard', 'premium'], default: 'premium' },
    slug: { type: String, index: true },
    metaTitle: String,
    metaDescription: String,
    seoImage: String,
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
MovieSchema.index({ title: 'text', description: 'text', tags: 'text' });
MovieSchema.index({ status: 1 });
MovieSchema.index({ genres: 1 });
MovieSchema.index({ categories: 1 });
MovieSchema.index({ trending: 1, featured: 1 });
MovieSchema.index({ releaseDate: -1 });
MovieSchema.plugin(adminAuditPlugin_1.adminAuditPlugin);
MovieSchema.plugin(mediaLinkerPlugin_1.mediaLinkerPlugin);
exports.MovieModel = mongoose_1.default.model('Movie', MovieSchema);
