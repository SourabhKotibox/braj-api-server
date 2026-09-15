import { adminAuditPlugin } from '../middlewares/adminAuditPlugin';
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IContestPurchase extends Document {
  contestVideoId: Types.ObjectId;
  userId?: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  amount: number;
  currency: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  status: 'pending' | 'completed' | 'failed';
  watchGranted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ContestPurchaseSchema = new Schema<IContestPurchase>(
  {
    contestVideoId: { type: Schema.Types.ObjectId, ref: 'ContestVideo', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
      index: true,
    },
    watchGranted: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ContestPurchaseSchema.index({ contestVideoId: 1, userId: 1 });
ContestPurchaseSchema.index({ razorpayPaymentId: 1 });
ContestPurchaseSchema.index({ email: 1, contestVideoId: 1 });

ContestPurchaseSchema.plugin(adminAuditPlugin);
export const ContestPurchaseModel = mongoose.model<IContestPurchase>('ContestPurchase', ContestPurchaseSchema);
