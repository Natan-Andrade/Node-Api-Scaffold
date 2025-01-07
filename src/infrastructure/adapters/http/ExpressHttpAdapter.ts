import { Request, Response } from 'express';
import { HttpAdapter } from './HttpAdapter';
import { IRouter } from '../../../presentation/routes/IRouter';
import { IRequest, IResponse } from './IRequest';

export class ExpressHttpAdapter extends HttpAdapter {
    constructor(private router: IRouter) {
        super();
    }

    /**
     * Overrides the handle method, keeping the original signature of IRequest and IResponse.
     */
    async handle(request: IRequest, response: IResponse): Promise<void> {
        try {
            await this.router.route(request, response);
        } catch (error) {
            this.handleError(response, error);
        }
    }

    /**
     * Converts Express Request and Response to IRequest and IResponse.
     */
    adaptExpressToGeneric(req: Request, res: Response): { request: IRequest, response: IResponse } {
        const request: IRequest = {
            body: req.body,
            headers: this.normalizeHeaders(req.headers), 
            params: req.params as Record<string, string | undefined>,
            query: req.query as Record<string, string>,
            method: req.method,
            path: req.path || ''
        };

        const response: IResponse = {
            status: (statusCode: number) => {
                res.status(statusCode);
                return response;
            },
            json: (data: any) => {
                res.json(data);
                return response;
            }
        };

        return { request, response };
    }

    /**
     * Helper function to normalize headers from Express.
     */
    private normalizeHeaders(headers: any): Record<string, string> {
        const normalizedHeaders: Record<string, string> = {};
        Object.keys(headers).forEach((key) => {
            const value = headers[key];
            if (typeof value === 'string') {
                normalizedHeaders[key] = value;
            } else if (Array.isArray(value)) {
                normalizedHeaders[key] = value.join(',');
            }
        });
        return normalizedHeaders;
    }
}
