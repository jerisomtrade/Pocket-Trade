require('dotenv').config();

const getConnection = (isProd = false) => {
	const dbUrl = process.env.DATABASE_URL || process.env.DB_URL;
	const useSsl =
		isProd ||
		process.env.DB_SSL === 'true' ||
		/sslmode=require|neon\.tech/i.test(dbUrl || '');

	if (dbUrl) {
		return {
			connectionString: dbUrl,
			ssl: useSsl ? { rejectUnauthorized: false } : false,
		};
	}

	return {
		host: process.env.DB_HOST || 'localhost',
		user: process.env.DB_USER || 'postgres',
		password: process.env.DB_PASSWORD || '',
		database: process.env.DB_DATABASE || 'pockettrade',
		port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
		ssl: useSsl ? { rejectUnauthorized: false } : false,
	};
};

module.exports = {
	development: {
		client: 'pg',
		connection: getConnection(false),
		pool: {
			min: 1,
			max: 10,
		},
		migrations: {
			tableName: 'knex_migrations',
			directory: './src/migrations',
		},
		seeds: {
			directory: './src/seeds',
		},
	},

	production: {
		client: 'pg',
		connection: getConnection(true),
		pool: {
			min: 1,
			max: 10,
		},
		migrations: {
			tableName: 'knex_migrations',
			directory: './src/migrations',
		},
		seeds: {
			directory: './src/seeds',
		},
	},
};
