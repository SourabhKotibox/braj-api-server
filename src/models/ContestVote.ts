import { adminAuditPlugin } from '../middlewares/adminAuditPlugin';
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IContestVote extends Document {
  contestVideoId: Types.ObjectId;
  contestantId: Types.ObjectId;
  userId?: Types.ObjectId;
  ipAddress?: string;
  createdAt: Date;
}

const ContestVoteSchema = new Schema<IContestVote>(
  {
    contestVideoId: { type: Schema.Types.ObjectId, ref: 'ContestVideo', required: true, index: true },
    contestantId: { type: Schema.Types.ObjectId, ref: 'Contestant', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    ipAddress: String,
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ContestVoteSchema.index({ contestantId: 1, userId: 1 }, { unique: true, sparse: true });
ContestVoteSchema.index({ contestantId: 1, ipAddress: 1 }, { unique: true, sparse: true });
ContestVoteSchema.index({ contestVideoId: 1, createdAt: -1 });

ContestVoteSchema.plugin(adminAuditPlugin);
export const ContestVoteModel = mongoose.model<IContestVote>('ContestVote', ContestVoteSchema);
