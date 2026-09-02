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
exports.AdminUserModel = void 0;
var adminAuditPlugin_1 = require("../middlewares/adminAuditPlugin");
var mongoose_1 = __importStar(require("mongoose"));
var defaultModulePermissions = {
    movies: { canView: true, canCreate: false, canEdit: false, canDelete: false },
    shows: { canView: true, canCreate: false, canEdit: false, canDelete: false },
    shortDramas: { canView: true, canCreate: false, canEdit: false, canDelete: false },
    audio: { canView: true, canCreate: false, canEdit: false, canDelete: false },
    videoMusic: { canView: true, canCreate: false, canEdit: false, canDelete: false },
    genres: { canView: true, canCreate: false, canEdit: false, canDelete: false },
    actors: { canView: true, canCreate: false, canEdit: false, canDelete: false },
    directors: { canView: true, canCreate: false, canEdit: false, canDelete: false },
    languages: { canView: true, canCreate: false, canEdit: false, canDelete: false },
    categories: { canView: true, canCreate: false, canEdit: false, canDelete: false },
    mediaLibrary: { canView: true, canUpload: false, canDelete: false },
    banners: { canView: true, canCreate: false, canEdit: false, canDelete: false },
    promotions: { canView: true, canCreate: false, canEdit: false, canDelete: false },
    influencers: { canView: true, canCreate: false, canEdit: false, canDelete: false },
    ads: { canView: true, canCreate: false, canEdit: false, canDelete: false },
    pages: { canView: true, canCreate: false, canEdit: false, canDelete: false },
    faqs: { canView: true, canCreate: false, canEdit: false, canDelete: false },
    subscriptions: { canView: true, canCreate: false, canEdit: false, canDelete: false },
    subscriptionPlans: { canView: true, canCreate: false, canEdit: false, canDelete: false },
    planLimits: { canView: true, canCreate: false, canEdit: false, canDelete: false },
    notifications: { canView: true, canCreate: false, canEdit: false, canDelete: false },
    notificationTemplates: { canView: true, canCreate: false, canEdit: false, canDelete: false },
    settings: { canView: true, canCreate: false, canEdit: false, canDelete: false },
    reviews: { canView: true, canCreate: false, canEdit: false, canDelete: false },
};
var AdminUserSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    name: { type: String, required: true },
    passwordHash: { type: String, required: true },
    role: {
        type: String,
        enum: ['superadmin', 'admin', 'moderator', 'influencer'],
        default: 'influencer',
    },
    avatar: String,
    phone: String,
    modulePermissions: {
        type: {
            movies: { canView: Boolean, canCreate: Boolean, canEdit: Boolean, canDelete: Boolean },
            shows: { canView: Boolean, canCreate: Boolean, canEdit: Boolean, canDelete: Boolean },
            shortDramas: { canView: Boolean, canCreate: Boolean, canEdit: Boolean, canDelete: Boolean },
            genres: { canView: Boolean, canCreate: Boolean, canEdit: Boolean, canDelete: Boolean },
            actors: { canView: Boolean, canCreate: Boolean, canEdit: Boolean, canDelete: Boolean },
            directors: { canView: Boolean, canCreate: Boolean, canEdit: Boolean, canDelete: Boolean },
            languages: { canView: Boolean, canCreate: Boolean, canEdit: Boolean, canDelete: Boolean },
            categories: { canView: Boolean, canCreate: Boolean, canEdit: Boolean, canDelete: Boolean },
            mediaLibrary: { canView: Boolean, canUpload: Boolean, canDelete: Boolean },
            banners: { canView: Boolean, canCreate: Boolean, canEdit: Boolean, canDelete: Boolean },
            promotions: { canView: Boolean, canCreate: Boolean, canEdit: Boolean, canDelete: Boolean },
            influencers: { canView: Boolean, canCreate: Boolean, canEdit: Boolean, canDelete: Boolean },
            ads: { canView: Boolean, canCreate: Boolean, canEdit: Boolean, canDelete: Boolean },
            pages: { canView: Boolean, canCreate: Boolean, canEdit: Boolean, canDelete: Boolean },
            faqs: { canView: Boolean, canCreate: Boolean, canEdit: Boolean, canDelete: Boolean },
            subscriptions: { canView: Boolean, canCreate: Boolean, canEdit: Boolean, canDelete: Boolean },
            subscriptionPlans: { canView: Boolean, canCreate: Boolean, canEdit: Boolean, canDelete: Boolean },
            planLimits: { canView: Boolean, canCreate: Boolean, canEdit: Boolean, canDelete: Boolean },
            notifications: { canView: Boolean, canCreate: Boolean, canEdit: Boolean, canDelete: Boolean },
            notificationTemplates: { canView: Boolean, canCreate: Boolean, canEdit: Boolean, canDelete: Boolean },
            settings: { canView: Boolean, canCreate: Boolean, canEdit: Boolean, canDelete: Boolean },
            reviews: { canView: Boolean, canCreate: Boolean, canEdit: Boolean, canDelete: Boolean },
        },
        default: defaultModulePermissions,
    },
    isActive: { type: Boolean, default: true },
    lastLogin: Date,
    loginCount: { type: Number, default: 0 },
    walletBalance: { type: Number, default: 0 },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'AdminUser' },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
AdminUserSchema.plugin(adminAuditPlugin_1.adminAuditPlugin);
exports.AdminUserModel = mongoose_1.default.model('AdminUser', AdminUserSchema);
