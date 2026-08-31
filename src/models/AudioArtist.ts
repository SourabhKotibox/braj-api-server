import { adminAuditPlugin } from '../middlewares/adminAuditPlugin';
import mongoose, { Schema, Document } from 'mongoose';

export interface IAudioArtist extends Document {
  name: string;
  image: string;
  coverImage: string;
  bio: string;
  genre: string;
  country: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AudioArtistSchema = new Schema<IAudioArtist>(
  {
    name: { type: String, required: true, index: true },
    image: String,
    coverImage: String,
    bio: String,
    genre: String,
    country: String,
    status: { type: Boolean, default: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

AudioArtistSchema.virtual('totalTracks', {
  ref: 'Audio',
  localField: '_id',
  foreignField: 'artistId',
  count: true,
});

AudioArtistSchema.virtual('totalAlbums', {
  ref: 'AudioAlbum',
  localField: '_id',
  foreignField: 'artistId',
  count: true,
});

AudioArtistSchema.plugin(adminAuditPlugin);
export const AudioArtistModel = mongoose.model<IAudioArtist>('AudioArtist', AudioArtistSchema);
