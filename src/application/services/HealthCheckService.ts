import { DependencyInjector } from "../../infrastructure/DependencyInjector";

export class HealthCheckService {
  constructor(private dependencyInjector: DependencyInjector) {}

  async checkHealth(): Promise<{ status: string; details: any }> {
    const healthStatus =  await this.dependencyInjector.dependencyStatus();
    const overallStatus = healthStatus === true ? "ok" : "degraded";

    return {
      status: overallStatus,
      details: healthStatus,
    };
  }
}
