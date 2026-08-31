import mongoose, { Document, Schema } from 'mongoose';

export interface IAudio extends Document {
  title: string;
  artist: string;
  album?: string;
  description?: string;
  shortDescription?: string;
  thumbnail?: string;
  coverImage?: string;
  bannerImage?: string;
  audioQualities?: Array<{
    quality: 'low' | 'medium' | 'high' | 'lossless';
    url: string;
    bitrate: number;
    size: number;
  }>;
  hlsUrl?: string;
  duration?: number;
  genre?: mongoose.Types.ObjectId;
  category?: mongoose.Types.ObjectId;
  language?: mongoose.Types.ObjectId;
  tags: string[];
  status: 'published' | 'draft' | 'processing';
  views: number;
  likes: number;
  shares: number;
  featured: boolean;
  trending: boolean;
  isNewContent: boolean;
  isExclusive: boolean;
  downloadAllowed: boolean;
  planRequired: 'free' | 'basic' | 'standard' | 'premium';
  releaseDate?: Date;
  lyrics?: string;
  trackNumber?: number;
  bitrate?: number;
  sampleRate?: number;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AudioSchema = new Schema<IAudio>(
  {
    title: { type: String, required: true, index: true },
    artist: { type: String, required: true, index: true },
    album: String,
    description: String,
    shortDescription: String,
    thumbnail: String,
    coverImage: String,
    bannerImage: String,
    audioQualities: [
      {
        quality: { type: String, enum: ['low', 'medium', 'high', 'lossless'] },
        url: String,
        bitrate: Number,
        size: Number,
      },
    ],
    hlsUrl: String,
    duration: Number,
    genre: { type: Schema.Types.ObjectId, ref: 'Genre' },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    language: { type: Schema.Types.ObjectId, ref: 'Language' },
    tags: { type: [String], default: [] },
    status: {
      type: String,
      enum: ['published', 'draft', 'processing'],
      default: 'draft',
    },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    isNewContent: { type: Boolean, default: true },
    isExclusive: { type: Boolean, default: false },
    downloadAllowed: { type: Boolean, default: true },
    planRequired: { type: String, enum: ['free', 'basic', 'standard', 'premium'], default: 'free' },
    releaseDate: Date,
    lyrics: String,
    trackNumber: Number,
    bitrate: Number,
    sampleRate: Number,
    slug: { type: String, index: true },
    metaTitle: String,
    metaDescription: String,
  },
  { timestamps: true }
);

AudioSchema.index({ title: 'text', artist: 'text', album: 'text', tags: 'text' });
AudioSchema.index({ status: 1 });
AudioSchema.index({ genre: 1 });
AudioSchema.index({ category: 1 });
AudioSchema.index({ trending: 1, featured: 1 });

export const AudioModel = mongoose.model<IAudio>('Audio', AudioSchema);
