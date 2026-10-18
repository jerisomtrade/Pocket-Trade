import * as dotenv from 'dotenv';
dotenv.config();

import { fetchAndUpdateAssets } from '../src/jobs/stockSync';
import { connectDb, disconnectDb } from '../src/common/config';

async function run() {
	console.log('Starting manual sync...');
	try {
		await connectDb();
		await fetchAndUpdateAssets();
		console.log('Manual sync completed successfully.');
	} catch (error) {
		console.error('Manual sync failed:', error);
	} finally {
		await disconnectDb();
	}
}

run();
