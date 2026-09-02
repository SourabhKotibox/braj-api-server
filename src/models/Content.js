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
exports.ContentModel = void 0;
var adminAuditPlugin_1 = require("../middlewares/adminAuditPlugin");
var mediaLinkerPlugin_1 = require("../middlewares/mediaLinkerPlugin");
var mongoose_1 = __importStar(require("mongoose"));
var ContentSchema = new mongoose_1.Schema({
    title: { type: String, required: true, index: true },
    originalTitle: String,
    type: { type: String, enum: ['movie', 'series'], required: true },
    contentType: { type: String, enum: ['drama', 'movie', 'series'], required: true, default: 'drama' },
    sections: { type: [String], default: [] },
    description: String,
    shortDescription: String,
    thumbnail: String,
    bannerImage: String,
    posterImage: String,
    trailerUrl: String,
    genres: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Genre' }],
    languages: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Language' }],
    subtitleLanguages: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Language' }],
    audioLanguages: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Language' }],
    categories: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Category' }],
    year: Number,
    releaseDate: Date,
    rating: String,
    ageRating: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['published', 'draft', 'processing', 'moderation', 'rejected'],
        default: 'draft',
        index: true,
    },
    rejectionReason: String,
    hlsUrl: String,
    hlsS3Prefix: String,
    videoQualities: [
        {
            quality: { type: String, enum: ['144p', '240p', '360p', '480p', '720p', '1080p', '1440p', '2160p'] },
            url: String,
            size: Number,
        },
    ],
    duration: Number,
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
    crewMembers: { type: [{ crewMember: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Crew' }, role: String }], default: [] },
    director: String,
    producer: String,
    studio: String,
    country: String,
    tags: { type: [String], default: [] },
    imdbRating: { type: Number, min: 0, max: 10 },
    maturityContent: { type: [String], default: [] },
    seasons: Number,
    planRequired: { type: String, enum: ['free', 'basic', 'standard', 'premium'], default: 'premium' },
    slug: { type: String, index: true },
    metaTitle: String,
    metaDescription: String,
    seoImage: String,
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
ContentSchema.index({ title: 'text', description: 'text', tags: 'text' });
ContentSchema.index({ status: 1, type: 1 });
ContentSchema.index({ genres: 1 });
ContentSchema.index({ trending: 1, featured: 1 });
ContentSchema.plugin(adminAuditPlugin_1.adminAuditPlugin);
ContentSchema.plugin(mediaLinkerPlugin_1.mediaLinkerPlugin);
exports.ContentModel = mongoose_1.default.model('Content', ContentSchema);
