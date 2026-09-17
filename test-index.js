import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AudioModel } from './src/models/Audio.js';

async function run() {
  const mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
  
  try {
    await AudioModel.syncIndexes();
    console.log("Indexes created successfully!");
    
    // Now try creating a document with a non-string language field (ObjectId)
    await AudioModel.create({
      title: "Test",
      artist: "Test",
      language: new mongoose.Types.ObjectId()
    });
    console.log("Document created successfully!");
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await mongoose.disconnect();
    await mongod.stop();
  }
}
run();
