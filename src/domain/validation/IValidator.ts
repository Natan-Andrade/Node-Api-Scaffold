export interface IValidator {
    validate(data: any, dto: object): void;
}