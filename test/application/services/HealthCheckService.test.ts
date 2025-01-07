import { DependencyInjector } from "../../../src/infrastructure/DependencyInjector";
import { HealthCheckService } from "../../../src/application/services/HealthCheckService";

describe("HealthCheckService", () => {
  let dependencyInjectorMock: jest.Mocked<DependencyInjector>;
  let healthCheckService: HealthCheckService;

  beforeEach(() => {
    dependencyInjectorMock = {
      dependencyStatus: jest.fn(),
    } as unknown as jest.Mocked<DependencyInjector>;

    healthCheckService = new HealthCheckService(dependencyInjectorMock);
  });

  it("should return status 'ok' when dependencies are healthy", async () => {
    dependencyInjectorMock.dependencyStatus.mockResolvedValueOnce(true);

    const result = await healthCheckService.checkHealth();

    expect(dependencyInjectorMock.dependencyStatus).toHaveBeenCalled();
    expect(result).toEqual({
      status: "ok",
      details: true,
    });
  });

  it("should return status 'degraded' when dependencies are not healthy", async () => {
    dependencyInjectorMock.dependencyStatus.mockResolvedValueOnce(false);

    const result = await healthCheckService.checkHealth();

    expect(dependencyInjectorMock.dependencyStatus).toHaveBeenCalled();
    expect(result).toEqual({
      status: "degraded",
      details: false,
    });
  });

  it("should throw an error if dependencyStatus throws", async () => {
    const error = new Error("Dependency check failed");
    dependencyInjectorMock.dependencyStatus.mockRejectedValueOnce(error);

    await expect(healthCheckService.checkHealth()).rejects.toThrow("Dependency check failed");
    expect(dependencyInjectorMock.dependencyStatus).toHaveBeenCalled();
  });
});
