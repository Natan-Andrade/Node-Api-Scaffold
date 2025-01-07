import {
  IRequest,
  IResponse,
} from "../../infrastructure/adapters/http/IRequest";

export interface IRouter {
  route(request: IRequest, response: IResponse): Promise<void>;
}
