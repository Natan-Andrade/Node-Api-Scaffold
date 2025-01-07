export class ApplicationException extends Error {
    public readonly name: string;
    public readonly statusCode: number;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.name = this.message;
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}
