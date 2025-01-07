interface IDatabaseTransaction {
    commit(): Promise<void>;
    rollback(): Promise<void>;
    table<T = any>(tableName: string): IQueryBuilder<T>;
}

interface IQueryBuilder<T> {
    where(column: string, value: any): this;
    where(condition: Record<string, any>): this;
    select(...columns: string[]): this;
    insert(data: Partial<T> | Partial<T>[]): Promise<T[]>;
    update(data: Partial<T>, column?: string, value?: any): Promise<number>;
    delete(column?: string, value?: any): Promise<number>;
    first(): Promise<T | undefined>;
}

export { IDatabaseTransaction, IQueryBuilder };