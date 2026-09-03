import mongoose, { Document, Schema } from 'mongoose';

export interface IVideoMusic extends Document {
  title: string;
  artist: string;
  artistId?: mongoose.Types.ObjectId;
  album?: string;
  albumId?: mongoose.Types.ObjectId;
  description?: string;
  shortDescription?: string;
  thumbnail?: string;
  coverImage?: string;
  bannerImage?: string;
  videoUrl?: string;
  hlsUrl?: string;
  duration?: number;
  genre?: mongoose.Types.ObjectId;
  category?: mongoose.Types.ObjectId;
  language?: mongoose.Types.ObjectId;
  tags: string[];
  status: 'published' | 'draft' | 'processing';
  processingStatus?: 'queued' | 'processing' | 'ready' | 'failed';
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
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  videoQualities?: Array<{
    quality: '144p' | '240p' | '360p' | '480p' | '720p' | '1080p';
    url: string;
    size: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const VideoMusicSchema = new Schema<IVideoMusic>(
  {
    title: { type: String, required: true, index: true },
    artist: { type: String, required: true, index: true },
    artistId: { type: Schema.Types.ObjectId, ref: 'AudioArtist' },
    album: String,
    albumId: { type: Schema.Types.ObjectId, ref: 'AudioAlbum' },
    description: String,
    shortDescription: String,
    thumbnail: String,
    coverImage: String,
    bannerImage: String,
    videoUrl: String,
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
    processingStatus: {
      type: String,
      enum: ['queued', 'processing', 'ready', 'failed'],
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
    slug: { type: String, index: true },
    metaTitle: String,
    metaDescription: String,
    videoQualities: [
      {
        quality: { type: String, enum: ['144p', '240p', '360p', '480p', '720p', '1080p'] },
        url: String,
        size: Number,
      },
    ],
  },
  { timestamps: true }
);

VideoMusicSchema.index({ title: 'text', artist: 'text', album: 'text', tags: 'text' });
VideoMusicSchema.index({ status: 1 });
VideoMusicSchema.index({ genre: 1 });
VideoMusicSchema.index({ category: 1 });
VideoMusicSchema.index({ trending: 1, featured: 1 });

export const VideoMusicModel = mongoose.model<IVideoMusic>('VideoMusic', VideoMusicSchema);
