import { createLogger, format, transports } from "winston";
import { ILogger } from "./ILogger";

export class Logger implements ILogger {
  private logger;
  constructor() {
    this.logger = createLogger({
      level: "info",
      format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message, ...meta }) => {
          const hasMeta = Object.keys(meta).length > 0;
          const metaString = hasMeta ? JSON.stringify(meta) : "";
          return `${timestamp} [${level.toUpperCase()}]: ${message} ${metaString}`;
        })
      ),
      transports: [new transports.Console()],
    });
  }

  logInfo(message: string, meta?: object): void {
    this.logger.info(message, meta);
  }

  logWarn(message: string, meta?: object): void {
    this.logger.warn(message, meta);
  }

  logError(message: string, meta?: object): void {
    this.logger.error(message, meta);
  }
}
