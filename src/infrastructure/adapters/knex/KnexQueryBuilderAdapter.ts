import { Knex } from "knex";
import { IQueryBuilder } from "./IDatabaseTransaction";

export class KnexQueryBuilderAdapter<T> implements IQueryBuilder<T> {
  private queryBuilder: Knex.QueryBuilder<T, T[]>;

  constructor(queryBuilder: Knex.QueryBuilder<T, T[]>) {
    this.queryBuilder = queryBuilder;
  }

  select(...columns: string[]): this {
    this.queryBuilder.select(...columns);
    return this;
  }

  async insert(data: Partial<T> | Partial<T>[]): Promise<T[]> {
    return this.queryBuilder.insert(data as any) as Promise<T[]>;
  }

  async update(data: Partial<T>, column?: string, value?: any): Promise<number> {
    if (column && value) {
      return this.queryBuilder.where(column, value).update(data as any);
    }
    return this.queryBuilder.update(data as any);
  }

  async delete(column?: string, value?: any): Promise<number> {
    if (column && value) {
      return this.queryBuilder.where(column, value).delete();
    }
    return this.queryBuilder.delete();
  }

  where(columnOrCondition: string | Record<string, any>, value?: any): this {
    if (typeof columnOrCondition === "string") {
      this.queryBuilder.where(columnOrCondition, value);
    } else {
      this.queryBuilder.where(columnOrCondition);
    }
    return this;
  }

  first(): Promise<T | undefined> {
    return this.queryBuilder.first();
  }

}