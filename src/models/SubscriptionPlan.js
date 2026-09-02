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
exports.SubscriptionPlanModel = void 0;
var adminAuditPlugin_1 = require("../middlewares/adminAuditPlugin");
var mongoose_1 = __importStar(require("mongoose"));
var SubscriptionPlanSchema = new mongoose_1.Schema({
    name: { type: String, required: true, index: true },
    duration: { type: String, required: true },
    durationValue: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, required: true, default: 0, min: 0, max: 100 },
    totalPrice: { type: Number, required: true, min: 0 },
    status: { type: Boolean, default: true },
    description: { type: String, default: '' },
    level: { type: Number, default: 1, min: 1 },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
SubscriptionPlanSchema.plugin(adminAuditPlugin_1.adminAuditPlugin);
exports.SubscriptionPlanModel = mongoose_1.default.model('SubscriptionPlan', SubscriptionPlanSchema);
