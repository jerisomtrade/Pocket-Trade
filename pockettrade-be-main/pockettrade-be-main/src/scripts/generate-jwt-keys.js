const crypto = require('crypto');

console.log('==========================================');
console.log('   PRODUCTION CRYPTOGRAPHIC KEYS GENERATOR');
console.log('==========================================\n');

const authSecret = crypto.randomBytes(48).toString('hex');
const accessTokenSecret = crypto.randomBytes(48).toString('hex');
const refreshTokenSecret = crypto.randomBytes(48).toString('hex');

console.log('Copy and paste these into your production .env:');
console.log('--------------------------------------------------');
console.log(`AUTH_SECRET=${authSecret}`);
console.log(`ACCESS_TOKEN=${accessTokenSecret}`);
console.log(`REFRESH_TOKEN=${refreshTokenSecret}`);
console.log('--------------------------------------------------\n');
