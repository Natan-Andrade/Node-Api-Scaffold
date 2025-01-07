import { KnexConfig } from "./adapters/knex/KnexConfig";
import { ILogger } from "../shared/logging/ILogger";
import { Logger } from "../shared/logging/Logger";
import { IValidator } from "../domain/validation/IValidator";
import { Validator } from "../domain/validation/Validator";
import { IDatabaseTransaction } from "./adapters/knex/IDatabaseTransaction";

export class DependencyInjector {
  private logger: ILogger = this.getLogger();
  private transactionManager: () => Promise<IDatabaseTransaction>;

  private constructor(transaction: any) {
    this.transactionManager = async () => await KnexConfig.createTransaction();
  }

  static async initialize(): Promise<DependencyInjector> {
    const transaction = await KnexConfig.createTransaction();
    return new DependencyInjector(transaction);
  }

  async dependencyStatus(): Promise<boolean> {
    try {
      const knex = KnexConfig.getInstance();
      await knex.raw("SELECT 1 FROM header LIMIT 1");
      this.logger.logInfo("Database connection successful.");
      return true;
    } catch (error) {
      this.logger.logError("Failed to connect to the database.", { error });
      process.exit(1);
    }
  }

  getTransactionManager(): () => Promise<IDatabaseTransaction> {
    return this.transactionManager;
  }

  getLogger(): ILogger {
    return new Logger();
  }

  getValidator(): IValidator {
    return new Validator();
  }
}