exports.up = function (knex) {
	return knex.schema.createTable('users', (table) => {
		table.increments('id').primary();
		table.string('first_name').notNullable();
		table.string('last_name').notNullable();
		table.string('email').notNullable();
		table.string('password').notNullable();
		table.boolean('is_admin').notNullable().defaultTo(false);
		table.timestamps(true, true);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable('users');
};
