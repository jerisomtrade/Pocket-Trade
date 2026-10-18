import { knexDb } from '../src/common/config/database';
import { fetchAndUpdateAssets } from '../src/jobs/stockSync';

async function check() {
  try {
    const assetCount = await knexDb('assets').count('* as count').first();
    const metricsCount = await knexDb('asset_metrics').count('* as count').first();
    
    console.log('Asset count:', assetCount?.count);
    console.log('Metrics count:', metricsCount?.count);
    
    if (Number(assetCount?.count) > 0) {
      const sampleAssets = await knexDb('assets').limit(5);
      console.log('Sample Assets:', JSON.stringify(sampleAssets, null, 2));
    }
    
    if (Number(metricsCount?.count) > 0) {
      const sampleMetrics = await knexDb('asset_metrics').limit(5);
      console.log('Sample Metrics:', JSON.stringify(sampleMetrics, null, 2));
    }

    process.exit(0);
  } catch (err) {
    console.error('Error checking DB:', err);
    process.exit(1);
  }
}

check();
