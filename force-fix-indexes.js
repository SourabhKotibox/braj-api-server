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
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/braj_ott');
        console.log('Connected to MongoDB');

        console.log('Dropping indexes...');
        const models = [MovieModel, VideoMusicModel, AudioModel, ContentModel, ContestVideoModel];
        
        for (const model of models) {
            try {
                await model.collection.dropIndexes();
                console.log(`Dropped indexes for ${model.modelName}`);
            } catch (err) {
                console.log(`Could not drop indexes for ${model.modelName} (maybe none existed): ${err.message}`);
            }
        }

        console.log('Rebuilding indexes with the fixed schema (language_override)...');
        for (const model of models) {
            try {
                await model.syncIndexes();
                console.log(`Synced indexes for ${model.modelName}`);
            } catch (err) {
                console.error(`Failed to sync indexes for ${model.modelName}: ${err.message}`);
            }
        }

        console.log('Done! You should no longer see the language override error.');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
run();
