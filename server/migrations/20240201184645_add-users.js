export async function up(knex) {
    const tableExists = await knex.schema.hasTable('users')
    if (!tableExists) {
        await knex.schema.createTableIfNotExists("users", table => {
            table.increments("id").primary()
            table.string("name").notNullable()
            table.string("email").notNullable().unique()
            table.string('password').notNullable()
            table.integer("score").defaultTo(0)
        })
    }
}

export async function down(knex) {
    await knex.schema.dropTableIfExists("users")
}
