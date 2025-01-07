import { ApplicationException } from '../../../src/shared/exceptions/ApplicationException';

describe('ApplicationException', () => {

  it('should create the exception with the default message and status code (500)', () => {
    const message = 'Internal server error';
    const exception = new ApplicationException(message);

    expect(exception.message).toBe(message);
    expect(exception.statusCode).toBe(500);
    expect(exception.name).toBe('Internal server error'); 
    expect(exception.stack).toBeDefined(); 
  });

  it('should create the exception with a custom status code', () => {
    const message = 'Resource not found';
    const statusCode = 404;
    const exception = new ApplicationException(message, statusCode);

    expect(exception.message).toBe(message);
    expect(exception.statusCode).toBe(statusCode);
    expect(exception.name).toBe('Resource not found');
    expect(exception.stack).toBeDefined(); 
  });
});
