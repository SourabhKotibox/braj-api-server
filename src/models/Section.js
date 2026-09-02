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
exports.SectionModel = void 0;
var mongoose_1 = __importStar(require("mongoose"));
var SectionSchema = new mongoose_1.Schema({
    key: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    contentType: {
        type: String,
        enum: ['drama', 'movie', 'mixed'],
        default: 'drama',
        index: true,
    },
    filter: { type: mongoose_1.Schema.Types.Mixed, default: {} },
    sortBy: { type: mongoose_1.Schema.Types.Mixed, default: { views: -1 } },
    limit: { type: Number, default: 10 },
    position: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
    // Layout fields
    layout: {
        type: String,
        enum: ['horizontal', 'vertical', 'grid-2', 'grid-3', 'reels', 'grid', 'ad'],
        default: 'horizontal'
    },
    // Content selection mode
    contentSelection: {
        type: String,
        enum: ['dynamic', 'manual', 'mixed'],
        default: 'dynamic'
    },
    manualContentIds: [{ type: mongoose_1.Schema.Types.ObjectId, refPath: 'contentType' }],
    showViewAll: { type: Boolean, default: true },
    itemType: {
        type: String,
        enum: ['card', 'poster', 'thumbnail', 'landscape', 'portrait', 'drama', 'home-banner', 'google-adsense'],
        default: 'poster'
    },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
SectionSchema.index({ isActive: 1, position: 1 });
SectionSchema.index({ contentType: 1, isActive: 1, position: 1 });
exports.SectionModel = mongoose_1.default.model('Section', SectionSchema);
