import mongoose from 'mongoose';
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '../.env') });

import { AudioModel } from '../src/models/Audio';

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not found');
    process.exit(1);
  }
  
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  const dummyAudio = await AudioModel.findOneAndUpdate(
    { title: 'Dummy SoundHelix Test Audio' },
    {
      title: 'Dummy SoundHelix Test Audio',
      artist: 'SoundHelix',
      album: 'Test Albums',
      description: 'This is a test audio track to verify audio playback and the global player functionality.',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80',
      coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80',
      duration: 372,
      status: 'published',
      featured: true,
      trending: true,
      isNewContent: true
    },
    { new: true, upsert: true }
  );

  console.log('Dummy audio added/updated successfully:', dummyAudio?._id);
  
  await mongoose.disconnect();
}

main().catch(console.error);
