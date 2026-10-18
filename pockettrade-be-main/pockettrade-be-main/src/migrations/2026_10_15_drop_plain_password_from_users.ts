import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	const hasColumn = await knex.schema.hasColumn('users', 'plainPassword');
	if (hasColumn) {
		await knex.schema.alterTable('users', (table) => {
			table.dropColumn('plainPassword');
		});
	}
}

export async function down(knex: Knex): Promise<void> {
	const hasColumn = await knex.schema.hasColumn('users', 'plainPassword');
	if (!hasColumn) {
		await knex.schema.alterTable('users', (table) => {
			table.string('plainPassword').nullable();
		});
	}
}
