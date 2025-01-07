import {
  IRequest,
  IResponse,
} from "../../../infrastructure/adapters/http/IRequest";
import { HealthCheckService } from "../../../application/services/HealthCheckService";

export class HealthCheckController {
  private readonly healthCheckService: HealthCheckService;

  constructor(healthCheckService: HealthCheckService) {
    this.healthCheckService = healthCheckService;
  }

  async handleRequest(request: IRequest, response: IResponse): Promise<void> {
    try {
      const { status, details } = await this.healthCheckService.checkHealth();
      response.status(200).json({ status: status, details: details });
    } catch (error) {
      response
        .status(500)
        .json({ message: "Health check failed", code: 500 });
    }
  }
}
