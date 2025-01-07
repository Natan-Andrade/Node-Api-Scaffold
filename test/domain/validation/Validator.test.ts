import { Validator } from "../../../src/domain/validation/Validator";
import { ApplicationException } from "../../../src/shared/exceptions/ApplicationException";
import FValidator from "fastest-validator";

jest.mock("fastest-validator");

describe("Validator", () => {
  let validator: Validator;
  let fastestValidatorMock: jest.Mocked<FValidator>;

  beforeEach(() => {
    fastestValidatorMock = new FValidator() as jest.Mocked<FValidator>;
    (FValidator as jest.Mock).mockImplementation(() => fastestValidatorMock);

    validator = new Validator();
  });

  describe("validate", () => {
    it("should validate data successfully when there are no validation errors", () => {
      const schema = {
        id: { type: "number", positive: true, integer: true },
        name: { type: "string", min: 3, max: 255 },
      };

      const data = { id: 1, name: "John Doe" };

      const compiledValidatorMock = Object.assign(
        jest.fn().mockReturnValue(true), // Mock da função
        { async: false }                 // Adiciona a propriedade `async`
      );
      fastestValidatorMock.compile.mockReturnValue(compiledValidatorMock);

      expect(() => validator.validate(data, schema)).not.toThrow();
      expect(fastestValidatorMock.compile).toHaveBeenCalledWith(schema);
      expect(compiledValidatorMock).toHaveBeenCalledWith(data);
    });

    it("should throw an ApplicationException when validation fails", () => {
      const schema = {
        id: { type: "number", positive: true, integer: true },
        name: { type: "string", min: 3, max: 255 },
      };

      const data = { id: -1, name: "Jo" };

      const validationErrors = [
        { field: "id", message: "must be a positive number" },
      ];

      const compiledValidatorMock = Object.assign(
        jest.fn().mockReturnValue(validationErrors),
        { async: false }
      );
      fastestValidatorMock.compile.mockReturnValue(compiledValidatorMock);

      expect(() => validator.validate(data, schema)).toThrow(
        new ApplicationException(
          "Validation failed for field 'id': must be a positive number",
          400
        )
      );

      expect(fastestValidatorMock.compile).toHaveBeenCalledWith(schema);
      expect(compiledValidatorMock).toHaveBeenCalledWith(data);
    });

    it("should handle multiple validation errors and throw only the first one", () => {
      const schema = {
        id: { type: "number", positive: true, integer: true },
        name: { type: "string", min: 3, max: 255 },
      };

      const data = { id: -1, name: "" };

      const validationErrors = [
        { field: "id", message: "must be a positive number" },
        { field: "name", message: "must have at least 3 characters" },
      ];

      const compiledValidatorMock = Object.assign(
        jest.fn().mockReturnValue(validationErrors),
        { async: false }
      );
      fastestValidatorMock.compile.mockReturnValue(compiledValidatorMock);

      expect(() => validator.validate(data, schema)).toThrow(
        new ApplicationException(
          "Validation failed for field 'id': must be a positive number",
          400
        )
      );

      expect(fastestValidatorMock.compile).toHaveBeenCalledWith(schema);
      expect(compiledValidatorMock).toHaveBeenCalledWith(data);
    });
  });
});