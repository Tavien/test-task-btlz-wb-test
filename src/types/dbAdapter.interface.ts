export interface DbAdapter {
    queryBuilder<T = any>(table: string): QueryBuilder<T>;
    raw<T = any>(sql: string, bindings?: any[]): Promise<T>;
}

export interface QueryBuilder<T = any> extends Promise<T[]> {
    select(columns?: string | string[]): this;
    insert(data: T | T[]): this;
    update(data: Partial<T>): this;
    delete(): this;
    where(conditions: Partial<T> | Record<string, any>): this;
    returning(columns: string | string[]): this;

    onConflict(columns: string[]): ConflictBuilder<T>;
}

export interface ConflictBuilder<T = any> extends Promise<T[]> {
    merge(columns: string[]): QueryBuilder<T>;
    ignore(): QueryBuilder<T>;
}
