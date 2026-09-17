import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import { MovieModel } from './src/models/Movie.ts';
import { VideoMusicModel } from './src/models/VideoMusic.ts';
import { AudioModel } from './src/models/Audio.ts';
import { ContentModel } from './src/models/Content.ts';
import { ContestVideoModel } from './src/models/ContestVideo.ts';

async function run() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/brajcinema');
        console.log('Connected to MongoDB');

        const models = [MovieModel, VideoMusicModel, AudioModel, ContentModel, ContestVideoModel];

        for (const model of models) {
            console.log(`Processing ${model.modelName}...`);
            try {
                await model.collection.dropIndexes();
                console.log(`- Dropped old indexes for ${model.modelName}`);
            } catch (err) {
                console.log(`- Note: Could not drop indexes for ${model.modelName} (might not exist):`, err.message);
            }
            
            await model.syncIndexes();
            console.log(`- Synced new indexes for ${model.modelName}`);
        }

        console.log('\nAll indexes fixed successfully! You can now create videos.');
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await mongoose.disconnect();
    }
}
run();
