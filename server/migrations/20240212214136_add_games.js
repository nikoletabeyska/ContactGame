export async function up(knex) {
    const gamesTableExists = await knex.schema.hasTable('games')
    if (!gamesTableExists) {
        await knex.schema.createTableIfNotExists("games", table => {
            table.increments("id").primary();
        });
    }
};

export async function down(knex) {
    await knex.schema.dropTableIfExists("games");
}
