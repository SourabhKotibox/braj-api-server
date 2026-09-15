import { adminAuditPlugin } from '../middlewares/adminAuditPlugin';
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IContestant extends Document {
  contestVideoId: Types.ObjectId;
  userId?: Types.ObjectId;
  name: string;
  email?: string;
  phone?: string;
  photo?: string;
  intro?: string;
  order: number;
  votes: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ContestantSchema = new Schema<IContestant>(
  {
    contestVideoId: { type: Schema.Types.ObjectId, ref: 'ContestVideo', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    email: String,
    phone: String,
    photo: String,
    intro: String,
    order: { type: Number, default: 0 },
    votes: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ContestantSchema.index({ contestVideoId: 1, order: 1 });
ContestantSchema.index({ userId: 1 });

ContestantSchema.plugin(adminAuditPlugin);
export const ContestantModel = mongoose.model<IContestant>('Contestant', ContestantSchema);
