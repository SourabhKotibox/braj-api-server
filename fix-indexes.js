import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import { MovieModel } from './src/models/Movie.js';
import { VideoMusicModel } from './src/models/VideoMusic.js';
import { AudioModel } from './src/models/Audio.js';
import { ContentModel } from './src/models/Content.js';
import { ContestVideoModel } from './src/models/ContestVideo.js';

async function run() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/brajcinema');
        console.log('Connected to MongoDB');

        console.log('Syncing indexes for Movie...');
        await MovieModel.syncIndexes();

        console.log('Syncing indexes for VideoMusic...');
        await VideoMusicModel.syncIndexes();

        console.log('Syncing indexes for Audio...');
        await AudioModel.syncIndexes();

        console.log('Syncing indexes for Content...');
        await ContentModel.syncIndexes();

        console.log('All indexes synced successfully!');
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await mongoose.disconnect();
    }
}
run();
