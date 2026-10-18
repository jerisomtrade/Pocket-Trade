require('dotenv').config();
const knexConfig = require('../../knexfile.js');
const knex = require('knex')(knexConfig.development);

async function updateAdmin() {
	try {
		const updated = await knex('users').where({ email: 'admin@gmail.com' }).update({
			isEmailVerified: true,
			role: 'admin',
			tokenIsUsed: true,
		});

		console.log('Admin updated:', updated);
	} catch (error) {
		console.error('Error:', error);
	} finally {
		await knex.destroy();
	}
}

updateAdmin();
