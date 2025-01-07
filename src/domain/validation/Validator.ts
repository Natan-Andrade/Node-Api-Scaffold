import { IValidator } from "./IValidator";
import { ApplicationException } from "../../shared/exceptions/ApplicationException";
import FValidator from "fastest-validator";

export class Validator implements IValidator {
  private validator: FValidator;

  constructor() {
    this.validator = new FValidator();
  }

  validate(data: any, schema: object): void {
    const compiledValidator = this.validator.compile(schema);
    const result = compiledValidator(data);
  
    if (Array.isArray(result)) {
      const firstError = result[0];
      const message = `Validation failed for field '${firstError.field}': ${firstError.message}`;
      throw new ApplicationException(message, 400);
    }
  }
}