import { Request, Response } from "express";
import { ExpressHttpAdapter } from "../../../../src/infrastructure/adapters/http/ExpressHttpAdapter";
import { IRouter } from "../../../../src/presentation/routes/IRouter";
import { IRequest, IResponse } from "../../../../src/infrastructure/adapters/http/IRequest";

describe("ExpressHttpAdapter", () => {
  let routerMock: jest.Mocked<IRouter>;
  let adapter: ExpressHttpAdapter;

  beforeEach(() => {
    routerMock = {
      route: jest.fn(),
    } as unknown as jest.Mocked<IRouter>;

    adapter = new ExpressHttpAdapter(routerMock);
  });

  describe("handle", () => {
    it("should call the router's route method", async () => {
      const requestMock = {} as IRequest;
      const responseMock = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as unknown as IResponse;

      await adapter.handle(requestMock, responseMock);

      expect(routerMock.route).toHaveBeenCalledWith(requestMock, responseMock);
    });

    it("should handle errors and call handleError", async () => {
        const requestMock = {} as IRequest;
        const responseMock = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn().mockReturnThis(),
        } as unknown as IResponse;
      
        const error = new Error("Test error");
        routerMock.route.mockRejectedValueOnce(error);
      
        await adapter.handle(requestMock, responseMock);
      
        expect(responseMock.status).toHaveBeenCalledWith(500);
        expect(responseMock.json).toHaveBeenCalledWith({
          message: "Test error",
          code: 500, // Adicione o código correto que o adaptador está configurando
        });
      });
  });

  describe("adaptExpressToGeneric", () => {
    it("should adapt Express Request and Response to IRequest and IResponse", () => {
      const reqMock = {
        body: { key: "value" },
        headers: { "x-custom-header": "custom-value" },
        params: { id: "123" },
        query: { search: "test" },
        method: "GET",
        path: "/test",
      } as unknown as Request;

      const resMock = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as unknown as Response;

      const { request, response } = adapter.adaptExpressToGeneric(reqMock, resMock);

      expect(request.body).toEqual(reqMock.body);
      expect(request.headers).toEqual({ "x-custom-header": "custom-value" });
      expect(request.params).toEqual(reqMock.params);
      expect(request.query).toEqual(reqMock.query);
      expect(request.method).toEqual(reqMock.method);
      expect(request.path).toEqual(reqMock.path);

      response.status(200);
      expect(resMock.status).toHaveBeenCalledWith(200);

      response.json({ success: true });
      expect(resMock.json).toHaveBeenCalledWith({ success: true });
    });

    it("should set path to an empty string if req.path is undefined", () => {
        const reqMock = {
          body: { key: "value" },
          headers: { "x-custom-header": "custom-value" },
          params: { id: "123" },
          query: { search: "test" },
          method: "GET",
          path: undefined, // Simula o `path` como `undefined`
        } as unknown as Request;
      
        const resMock = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn().mockReturnThis(),
        } as unknown as Response;
      
        const { request } = adapter.adaptExpressToGeneric(reqMock, resMock);
      
        expect(request.path).toEqual(""); // Valida que `path` foi setado como string vazia
      });
      
  });

  describe("normalizeHeaders", () => {
    it("should normalize headers with string values", () => {
      const headers = {
        "content-type": "application/json",
        "x-custom-header": "custom-value",
      };

      const result = (adapter as any).normalizeHeaders(headers);

      expect(result).toEqual(headers);
    });

    it("should normalize headers with array values", () => {
      const headers = {
        "set-cookie": ["cookie1=value1", "cookie2=value2"],
      };

      const result = (adapter as any).normalizeHeaders(headers);

      expect(result).toEqual({
        "set-cookie": "cookie1=value1,cookie2=value2",
      });
    });

    it("should ignore non-string and non-array header values", () => {
      const headers = {
        "x-invalid-header": undefined,
      };

      const result = (adapter as any).normalizeHeaders(headers);

      expect(result).toEqual({});
    });
  });
});