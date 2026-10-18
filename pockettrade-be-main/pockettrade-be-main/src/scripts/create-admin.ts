import knex from 'knex';
import bcrypt from 'bcryptjs';

const knexConfig = require('../../knexfile.js');

const db = knex(knexConfig.development);

async function createAdmin() {
	try {
		const adminEmail = process.env.ADMIN_SEED_EMAIL || process.env.ADMIN_EMAIL || 'admin@pockettrade.internal';
		const adminPassword = process.env.ADMIN_SEED_PASSWORD || process.env.ADMIN_PASSWORD || 'ChangeMeProd2026!#Secure';

		const existingAdmin = await db('users').where({ email: adminEmail }).first();

		if (existingAdmin) {
			console.log(`Admin user (${adminEmail}) already exists`);
			process.exit(0);
		}

		const hashedPassword = await bcrypt.hash(adminPassword, 12);

		await db('users').insert({
			email: adminEmail,
			firstName: 'Admin',
			lastName: 'User',
			password: hashedPassword,
			phone: '+1234567890',
			country: 'United States',
			role: 'admin',
			isSuspended: false,
			isDeleted: false,
			isEmailVerified: true,
			verificationToken: 'admin-verification-token',
			tokenIsUsed: true,
			created_at: db.fn.now(),
			updated_at: db.fn.now(),
		});

		console.log('Admin user created successfully!');
		console.log(`Email: ${adminEmail}`);
		console.log(`Password: ${adminPassword}`);
	} catch (error) {
		console.error('Error creating admin:', error);
	} finally {
		await db.destroy();
	}
}

createAdmin();
