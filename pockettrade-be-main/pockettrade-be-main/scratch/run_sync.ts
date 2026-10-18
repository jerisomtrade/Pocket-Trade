import * as dotenv from 'dotenv';
dotenv.config();
import { fetchAndUpdateAssets } from '../src/jobs/stockSync';
import { connectDb, disconnectDb } from '../src/common/config/database';

async function run() {
  try {
    await connectDb();
    console.log('Starting sync...');
    await fetchAndUpdateAssets();
    console.log('Sync completed!');
    await disconnectDb();
    process.exit(0);
  } catch (err) {
    console.error('Error during sync:', err);
    process.exit(1);
  }
}

run();
