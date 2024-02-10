export async function up(knex) {
    const tableExists = await knex.schema.hasTable('users')
    const gamesTableExists = await knex.schema.hasTable('games')
    if (!tableExists) {
        await knex.schema.createTableIfNotExists("users", table => {
            table.increments("id").primary()
            table.string("name").notNullable()
            table.string("email").notNullable().unique()
            table.string('password').notNullable()
            table.integer("score").defaultTo(0)
        })
    }
    if (!gamesTableExists) {
        await knex.schema.createTableIfNotExists("games", table => {
            table.increments("id").primary();
        });
    }
}

export async function down(knex) {
    await knex.schema.dropTableIfExists("users")
    await knex.schema.dropTableIfExists("games");
}
