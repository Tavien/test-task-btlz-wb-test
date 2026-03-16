/**
 * @param {import("knex").Knex} knex
 * @param {string} tableName
 * @returns {Promise<void>}
 */
function addUpdateTrigger(knex, tableName) {
    return knex.raw(`
        CREATE TRIGGER ${tableName}_updated_at
            BEFORE UPDATE ON ${tableName}
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    `);
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {

    await knex.raw(`
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = CURRENT_TIMESTAMP;
            RETURN NEW;
        END;
        $$ language 'plpgsql';
    `);

    await knex.schema.createTable("box_tariffs", (table) => {
        table.increments("id").primary();
        table.date("date").notNullable();

        table.string("warehouse_name", 255);
        table.string("geo_name", 255).notNullable();

        table.date("dt_next_box").notNullable();
        table.date("dt_till_max").notNullable();

        table.decimal("box_delivery_base", 10, 2).notNullable();
        table.decimal("box_delivery_coef_expr", 10, 4).notNullable();
        table.decimal("box_delivery_liter", 10, 2).notNullable();
        table.decimal("box_delivery_marketplace_base", 10, 2).notNullable();
        table.decimal("box_delivery_marketplace_coef_expr", 10, 4).notNullable();
        table.decimal("box_delivery_marketplace_liter", 10, 2).notNullable();
        
        table.decimal("box_storage_base", 10, 2).notNullable();
        table.decimal("box_storage_coef_expr", 10, 4).notNullable();
        table.decimal("box_storage_liter", 10, 2).notNullable();

        table.timestamps(true, true); 

        table.unique(["date", "warehouse_name"], {
            indexName: "box_tariff_date_warehouse_name_uq",
        });

        table.index("date");
        table.index("warehouse_name");
    });

    await addUpdateTrigger(knex, 'box_tariffs');
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
    await knex.raw(`DROP TRIGGER IF EXISTS box_tariff_updated_at ON box_tariffs;`);

    await knex.raw(`DROP FUNCTION IF EXISTS update_updated_at_column();`);

    await knex.schema.dropTableIfExists("box_tariffs");
}
