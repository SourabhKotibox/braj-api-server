import mongoose from 'mongoose';
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '../.env') });

import { VideoMusicModel } from '../src/models/VideoMusic';

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not found');
    process.exit(1);
  }
  
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  const dummyVideo = await VideoMusicModel.findOneAndUpdate(
    { title: 'Dummy Sound Test Video' },
    { 
      title: 'Dummy Sound Test Video',
      artist: 'SoundHelix & Durian Team',
      album: 'Test Music Videos',
      description: 'Official test music video featuring high-fidelity stereo audio track.',
      videoUrl: '/uploads/music-videos/dummy-music-video.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80',
      coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80',
      duration: 52,
      status: 'published',
      featured: true,
      trending: true,
      isNewContent: true,
      videoQualities: [
        {
          quality: '720p',
          url: '/uploads/music-videos/dummy-music-video.mp4',
          size: 4860000,
        },
        {
          quality: '480p',
          url: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
          size: 4372000,
        }
      ]
    },
    { new: true, upsert: true }
  );

  console.log('Dummy video updated successfully:', dummyVideo?._id);
  
  await mongoose.disconnect();
}

main().catch(console.error);
