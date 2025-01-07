import { HttpAdapter } from "../../../../src/infrastructure/adapters/http/HttpAdapter";
import { Logger } from "../../../../src/shared/logging/Logger";
import { IResponse } from "../../../../src/infrastructure/adapters/http/IRequest";

class TestHttpAdapter extends HttpAdapter {
  async handle(): Promise<void> {
    // implementation not needed for the test
  }
}

describe("HttpAdapter", () => {
  let adapter: TestHttpAdapter;
  let mockResponse: Partial<IResponse>;
  let loggerSpy: jest.SpyInstance;

  beforeEach(() => {
    adapter = new TestHttpAdapter();

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    loggerSpy = jest.spyOn(Logger.prototype, "logError");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should send a response with the correct status and data", () => {
    const data = { message: "Success" };
    const statusCode = 200;

    adapter.sendResponse(mockResponse as IResponse, statusCode, data);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(data);
  });

  it("should handle errors correctly with default statusCode 500", () => {
    const error = new Error("Unexpected error");
    adapter.handleError(mockResponse as IResponse, error);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Unexpected error",
      code: 500,
    });

    expect(loggerSpy).toHaveBeenCalledWith("Unexpected error", error);
  });

  it("should handle errors correctly with custom statusCode", () => {
    const error = {
      message: "Specific error",
      statusCode: 400,
      details: "Details",
    };
    adapter.handleError(mockResponse as IResponse, error);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Specific error",
      code: 400,
    });

    expect(loggerSpy).toHaveBeenCalledWith("Specific error", error);
  });

  it("should handle errors correctly when there is no error message", () => {
    const error = { statusCode: 500 };
    adapter.handleError(mockResponse as IResponse, error);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Internal Server Error",
      code: 500,
    });

    expect(loggerSpy).toHaveBeenCalledWith("Internal Server Error", error);
  });
});
