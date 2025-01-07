import { Knex } from "knex";
import { IDatabaseTransaction, IQueryBuilder } from "./IDatabaseTransaction";
import { KnexQueryBuilderAdapter } from "./KnexQueryBuilderAdapter";

export class KnexTransactionAdapter implements IDatabaseTransaction {
  private transaction: Knex.Transaction;


  constructor(transaction: Knex.Transaction) {
    this.transaction = transaction;
  }

  async commit(): Promise<void> {
    await this.transaction.commit();
  }

  async rollback(): Promise<void> {
    await this.transaction.rollback();
  }

  table<T = any>(tableName: string): IQueryBuilder<T> {
    return new KnexQueryBuilderAdapter(this.transaction.table(tableName));
  }
}