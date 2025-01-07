import "dotenv/config";
import knex, { Knex } from "knex";
import { KnexTransactionAdapter } from "./KnexTransactionAdapter";

export class KnexConfig {
  private static instance: Knex;

  /**
   * Retorna a instância configurada do knex
   */
  public static getInstance(): Knex {
    if (!KnexConfig.instance) {
      KnexConfig.instance = knex({
        client: 'mysql2',
        connection: {
          host: process.env.MYSQL_HOST || 'localhost',
          user: process.env.MYSQL_USER,
          password: process.env.MYSQL_PASS,
          database: process.env.MYSQL_DATABASE,
        },
        pool: { min: 0, max: 10 },
      });
    }

    return KnexConfig.instance;
  }

  static async createTransaction(): Promise<KnexTransactionAdapter> {
    const knex = KnexConfig.getInstance();
    const trx = await knex.transaction();
    return new KnexTransactionAdapter(trx);
  }

  /**
   * Finaliza a conexão do knex (para uso em shutdown ou testes)
   */
  public static async destroy(): Promise<void> {
    if (KnexConfig.instance) {
      await KnexConfig.instance.destroy();
      KnexConfig.instance = null;
    }
  }
}
