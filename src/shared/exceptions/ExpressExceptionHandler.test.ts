import { Request, Response, NextFunction } from 'express';
import { ILogger } from '../../shared/logging/ILogger';
import { ApplicationException } from '../../shared/exceptions/ApplicationException';
import { ExpressExceptionHandler } from './ExpressExceptionHandler';

describe('ExpressExceptionHandler', () => {
    let logger: jest.Mocked<ILogger>;
    let handler: ExpressExceptionHandler;
    let req: jest.Mocked<Request>;
    let res: jest.Mocked<Response>;
    let next: jest.Mocked<NextFunction>;

    beforeEach(() => {
        logger = {
            logError: jest.fn(),
            logInfo: jest.fn(),
        } as unknown as jest.Mocked<ILogger>;

        handler = new ExpressExceptionHandler(logger);

        req = {
            path: '/test',
            method: 'GET',
        } as jest.Mocked<Request>;

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as jest.Mocked<Response>;

        next = jest.fn();
    });

    it('should handle ApplicationException correctly', () => {
        const err = new ApplicationException('Validation error', 400);

        handler.handle(err, req, res, next);

        expect(logger.logError).toHaveBeenCalledWith(err.message, {
            stack: err.stack,
            route: req.path,
            method: req.method,
        });
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Validation error',
            code: 400,
        });
    });

    it('should handle generic errors (instance of Error)', () => {
        const err = new Error('General error');

        handler.handle(err, req, res, next);

        expect(logger.logError).toHaveBeenCalledWith(err.message, {
            stack: err.stack,
            route: req.path,
            method: req.method,
        });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'An unexpected error occurred.',
            code: 500
        });
    });

    it('should handle unknown errors', () => {
        const err = 'Unexpected error';

        handler.handle(err, req, res, next);

        expect(logger.logError).toHaveBeenCalledWith('Unknown error', {
            err,
            route: req.path,
            method: req.method,
        });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'An unknown error occurred.',
            code: 500
        });
    });
});
