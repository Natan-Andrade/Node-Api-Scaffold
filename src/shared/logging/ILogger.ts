export interface ILogger {
    logInfo(message: string, meta?: any): void;
    logWarn(message: string, meta?: any): void;
    logError(message: string, meta?: any): void;
}
