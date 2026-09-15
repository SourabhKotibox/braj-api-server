import { adminAuditPlugin } from '../middlewares/adminAuditPlugin';
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IContestVideo extends Document {
  title: string;
  description: string;
  shortDescription?: string;
  videoUrl: string;
  videoQualities?: Array<{
    quality: string;
    url: string;
    size: number;
  }>;
  hlsUrl?: string;
  thumbnail: string;
  coverImage?: string;
  bannerImage?: string;
  genre?: Types.ObjectId;
  category?: Types.ObjectId;
  language?: Types.ObjectId;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  price: number;
  currency: string;
  isContest: boolean;
  maxContestants?: number;
  votingEnabled: boolean;
  votingEndDate?: Date;
  allowGuestPurchase: boolean;
  views: number;
  likes: number;
  totalVotes: number;
  totalParticipants: number;
  featured: boolean;
  trending: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ContestVideoSchema = new Schema<IContestVideo>(
  {
    title: { type: String, required: true, index: true },
    description: { type: String, required: true },
    shortDescription: String,
    videoUrl: { type: String, required: true },
    videoQualities: [
      {
        quality: String,
        url: String,
        size: Number,
      },
    ],
    hlsUrl: String,
    thumbnail: { type: String, required: true },
    coverImage: String,
    bannerImage: String,
    genre: { type: Schema.Types.ObjectId, ref: 'Genre' },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    language: { type: Schema.Types.ObjectId, ref: 'Language' },
    tags: { type: [String], default: [] },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
      index: true,
    },
    price: { type: Number, required: true, default: 0 },
    currency: { type: String, default: 'INR' },
    isContest: { type: Boolean, default: true },
    maxContestants: { type: Number, default: 100 },
    votingEnabled: { type: Boolean, default: true },
    votingEndDate: Date,
    allowGuestPurchase: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    totalVotes: { type: Number, default: 0 },
    totalParticipants: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ContestVideoSchema.index({ title: 'text', description: 'text', tags: 'text' });
ContestVideoSchema.index({ status: 1, featured: 1, trending: 1 });
ContestVideoSchema.index({ genre: 1, category: 1, language: 1 });

ContestVideoSchema.plugin(adminAuditPlugin);
export const ContestVideoModel = mongoose.model<IContestVideo>('ContestVideo', ContestVideoSchema);
