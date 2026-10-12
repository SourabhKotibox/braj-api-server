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
    { videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4' },
    { new: true }
  );

  console.log('Dummy video updated successfully:', dummyVideo?._id);
  
  await mongoose.disconnect();
}

main().catch(console.error);
