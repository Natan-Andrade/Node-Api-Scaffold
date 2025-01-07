export interface IRequest {
    body: any;
    headers?: Record<string, string>;
    params?: Record<string, string | undefined>;
    query?: Record<string, string>;
    method: string;
    path: string;
}

export interface IResponse {
    status(code: number): this;
    json(data: any): this;
    send?(data: any): this; 
}
