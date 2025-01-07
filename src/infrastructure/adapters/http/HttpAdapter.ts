import { Logger } from "../../../shared/logging/Logger";
import { IHttpAdapter } from "./IHttpAdapter";
import { IRequest, IResponse } from "./IRequest";

export abstract class HttpAdapter implements IHttpAdapter {
  abstract handle(request: IRequest, response: IResponse): Promise<void>;

  sendResponse(response: IResponse, statusCode: number, data: any): void {
    response.status(statusCode).json(data);
  }

  handleError(response: IResponse, error: any): void {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    const logger = new Logger();
    logger.logError(message, error);

    this.sendResponse(response, statusCode, {
      message: message,
      code: statusCode,
    });
  }
}
