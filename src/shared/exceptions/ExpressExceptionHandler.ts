import { Request, Response, NextFunction } from 'express';
import { ILogger } from '../../shared/logging/ILogger';
import { ApplicationException } from '../../shared/exceptions/ApplicationException';

export class ExpressExceptionHandler {
    constructor(private logger: ILogger) {}

    handle = (err: any, req: Request, res: Response, next: NextFunction) => {
        if (err instanceof ApplicationException) {
            this.logger.logError(err.message, {
                stack: err.stack,
                route: req.path,
                method: req.method
            });
            res.status(err.statusCode).json({
                    message: err.message,
                    code: err.statusCode
            });
        } else if (err instanceof Error) {
            this.logger.logError(err.message, {
                stack: err.stack,
                route: req.path,
                method: req.method
            });
            res.status(500).json({
                message: 'An unexpected error occurred.',
                code: 500
            });
        } else {
            this.logger.logError('Unknown error', {
                err,
                route: req.path,
                method: req.method
            });
            res.status(500).json({
                    message: 'An unknown error occurred.',
                    code: 500
            });
        }
    }
}