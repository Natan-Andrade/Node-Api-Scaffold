import express, { Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import { DependencyInjector } from "./infrastructure/DependencyInjector";
import { HealthCheckService } from "./application/services/HealthCheckService";
import { HealthCheckController } from "./presentation/controllers/healthcheck/HealthCheckController";
import { setupRoutes } from "./presentation/routes/router";
import { ExpressHttpAdapter } from "./infrastructure/adapters/http/ExpressHttpAdapter";
const swaggerDocument = require("./swagger.json");

async function setupDependencies() {
  const dependencyInjector = await DependencyInjector.initialize();
  await dependencyInjector.dependencyStatus();
  return dependencyInjector;
}

function setupServices(dependencyInjector: DependencyInjector) {
  const healthCheckService = new HealthCheckService(dependencyInjector);
  return { healthCheckService };
}

function setupControllers(services: any) {
  const { healthCheckService } = services;

  // Controllers
  const healthCheckController = new HealthCheckController(healthCheckService);

  return { healthCheckController };
}

function setupExpress(expressAdapter: ExpressHttpAdapter, logger: any) {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Middleware para logar requisições
  app.use((req: Request, _res: Response, next: () => void) => {
    logger.logInfo(`Request: ${req.method} ${req.url}`);
    next();
  });

  if(process.env.NODE_ENV === 'development'){
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }

  app.use((req: Request, res: Response) => {
    const { request, response } = expressAdapter.adaptExpressToGeneric(req, res);
    expressAdapter.handle(request, response);
  });

  return app;
}

async function startServer() {
  try {
    const dependencyInjector = await setupDependencies();
    const logger = dependencyInjector.getLogger();
    logger.logInfo("All dependencies are ready!");

    const services = setupServices(dependencyInjector);
    const controllers = setupControllers(services);

    const router = setupRoutes(
      controllers.healthCheckController
    );
    const expressAdapter = new ExpressHttpAdapter(router);

    const app = setupExpress(expressAdapter, logger);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      logger.logInfo(`Server running on port ${PORT}`);
      if(process.env.NODE_ENV === 'development'){
        logger.logInfo(`Swagger UI available at http://localhost:${PORT}/api-docs`);
      }
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();