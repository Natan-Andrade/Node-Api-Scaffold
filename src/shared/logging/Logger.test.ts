import { Logger } from './Logger';
import { createLogger, transports, format } from 'winston';

jest.mock('winston', () => ({
    createLogger: jest.fn().mockReturnValue({
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn(),
    }),
    format: {
        combine: jest.fn(() => 'combined format'),
        timestamp: jest.fn(() => 'timestamp format'),
        printf: jest.fn(() => 'printf format'),
        colorize: jest.fn(() => 'colorize format'),
    },
    transports: {
        Console: jest.fn().mockImplementation(() => ({ type: 'console' })),
        File: jest.fn().mockImplementation(() => ({ type: 'file' })),
    },
}));

describe('Logger', () => {
    let logger: Logger;
    let mockLogger: any;

    beforeEach(() => {
        logger = new Logger();
        mockLogger = (createLogger as jest.Mock).mock.results[0].value;
    });

    it('should create a logger with the correct configuration', () => {
        new Logger();

        expect(createLogger).toHaveBeenCalledWith({
            level: 'info',
            format: 'combined format',
            transports: expect.arrayContaining([expect.any(Object)]), // Aceita qualquer objeto no array
        });
    });

    it('should log info messages', () => {
        const message = 'Info message';
        const meta = { key: 'value' };

        logger.logInfo(message, meta);

        expect(mockLogger.info).toHaveBeenCalledWith(message, meta);
    });

    it('should log warning messages', () => {
        const message = 'Warning message';
        const meta = { warning: 'Some warning' };

        logger.logWarn(message, meta);

        expect(mockLogger.warn).toHaveBeenCalledWith(message, meta);
    });

    it('should log error messages', () => {
        const message = 'Error message';
        const meta = { error: 'Some error' };

        logger.logError(message, meta);

        expect(mockLogger.error).toHaveBeenCalledWith(message, meta);
    });

    it('should format log message with meta correctly', () => {
        logger.logInfo('Test message', { key: 'value' });

        const formattedMessage = (format.printf as jest.Mock).mock.calls[0][0]({
            timestamp: '2024-09-26T12:34:56Z',
            level: 'info',
            message: 'Test message',
            meta: { key: 'value' },
        });

        expect(formattedMessage).toContain('2024-09-26T12:34:56Z [INFO]: Test message {"meta":{"key":"value"}}');
    });

    it('should format log message without meta correctly', () => {
        logger.logInfo('Test message');

        const formattedMessage = (format.printf as jest.Mock).mock.calls[0][0]({
            timestamp: '2024-09-26T12:34:56Z',
            level: 'info',
            message: 'Test message',
        });

        expect(formattedMessage).toContain('2024-09-26T12:34:56Z [INFO]: Test message');
        expect(formattedMessage).not.toContain('{}');
    });
});