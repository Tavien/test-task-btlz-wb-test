/**
 * @param {import("knex").Knex} knex
 */
export async function seed(knex) {
    await knex("spreadsheets")
        .insert([{ spreadsheet_id: "1x1t_DgZO7fEwZzOA14H3uO9l1EUQiVLTWWIji993O4g" }])
        .onConflict(["spreadsheet_id"])
        .ignore();
}
