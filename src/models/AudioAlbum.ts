import { adminAuditPlugin } from '../middlewares/adminAuditPlugin';
import mongoose, { Schema, Document } from 'mongoose';

export interface IAudioAlbum extends Document {
  name: string;
  artist: string;
  artistId: mongoose.Types.ObjectId;
  image: string;
  coverImage: string;
  description: string;
  genre: string;
  releaseDate: Date;
  songs: mongoose.Types.ObjectId[];
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AudioAlbumSchema = new Schema<IAudioAlbum>(
  {
    name: { type: String, required: true, index: true },
    artist: String,
    artistId: { type: Schema.Types.ObjectId, ref: 'AudioArtist' },
    image: String,
    coverImage: String,
    description: String,
    genre: String,
    releaseDate: Date,
    songs: [{ type: Schema.Types.ObjectId, ref: 'Audio' }],
    status: { type: Boolean, default: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

AudioAlbumSchema.virtual('totalTracks', {
  ref: 'Audio',
  localField: '_id',
  foreignField: 'albumId',
  count: true,
});

AudioAlbumSchema.plugin(adminAuditPlugin);
export const AudioAlbumModel = mongoose.model<IAudioAlbum>('AudioAlbum', AudioAlbumSchema);
