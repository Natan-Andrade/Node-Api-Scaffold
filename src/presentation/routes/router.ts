import { HealthCheckController } from "../controllers/healthcheck/HealthCheckController";
import { IRouter } from "./IRouter";
import { healthChecktRouter } from "./healthChecktRouter";
/**
 * Sets up the main routes, integrating different modules.
 */
export function setupRoutes(
  healthCheckController: HealthCheckController,
): IRouter {
  const routes = {
    "/healthcheck": healthChecktRouter(healthCheckController).route,
  };

  return {
    async route(req, res) {
      try {
        const { path } = req;

        for (const [prefix, handler] of Object.entries(routes)) {
          if (path.startsWith(prefix)) {
            return handler(req, res); 
          }
        }

        res.status(404).json({ message: "Route not found" });
      } catch (error) {
        res.status(error.statusCode || 500).json({
          message: error.message || "Internal Server Error",
          code: error.statusCode || 500,
        });
      }
    },
  };
}