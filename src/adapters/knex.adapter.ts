import type { Knex } from "knex";

import type { DbAdapter, QueryBuilder } from "#types/index.js";

export const createKnexAdapter = (knex: Knex): DbAdapter => {
    const adapter = {
        queryBuilder: <T>(table: string): QueryBuilder<T> => 
            knex(table) as unknown as QueryBuilder<T>,
        raw: <T>(sql: string, bindings?: any[]): Promise<T> =>
            //@ts-ignore
            knex.raw(sql, bindings) as unknown as Promise<T>,
    };

    return adapter as DbAdapter;
}