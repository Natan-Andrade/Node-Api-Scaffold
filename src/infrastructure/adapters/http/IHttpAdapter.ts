import { IRequest, IResponse } from "./IRequest";

export interface IHttpAdapter {
    handle(request: IRequest, response: IResponse): Promise<void>;
}
