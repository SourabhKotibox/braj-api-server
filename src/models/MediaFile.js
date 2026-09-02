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
exports.MediaFileModel = void 0;
var mongoose_1 = __importStar(require("mongoose"));
var HlsQualitySchema = new mongoose_1.Schema({
    quality: { type: String, required: true },
    url: { type: String, required: true },
    filePath: { type: String, required: true },
    bitrate: { type: Number, required: true },
    resolution: { type: String, required: true },
}, { _id: false });
var MediaFileSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    url: { type: String, required: true },
    filePath: { type: String, required: true },
    fileSize: { type: Number, required: true },
    fileType: { type: String, required: true },
    folder: { type: mongoose_1.Schema.Types.ObjectId, ref: "MediaFolder", required: false },
    source: { type: String, required: false }, // e.g., 'banner', 'show', 'media-library', etc.
    sourceId: { type: mongoose_1.Schema.Types.ObjectId, required: false }, // Reference to the entity
    contentHash: { type: String, required: false, index: true },
    contentName: { type: String, required: false, index: true },
    contentType: { type: String, required: false, index: true },
    storageType: { type: String, enum: ['local', 's3'], default: 'local', required: true },
    s3Key: { type: String, required: false },
    // HLS fields
    isHls: { type: Boolean, default: false },
    hlsMasterPlaylistUrl: { type: String, required: false },
    hlsMasterPlaylistPath: { type: String, required: false },
    hlsQualities: [HlsQualitySchema],
    hlsStatus: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
    hlsError: { type: String, required: false },
    duration: { type: Number, required: false }, // in seconds
}, { timestamps: true });
exports.MediaFileModel = mongoose_1.default.model("MediaFile", MediaFileSchema);
