import { HealthCheckController } from "../controllers/healthcheck/HealthCheckController";

/**
 * Creates a specific router for health check routes.
 */
export function healthChecktRouter(healthCheckController: HealthCheckController) {
  const routes = {
    GET: {
      "/healthcheck": (req, res) => healthCheckController.handleRequest(req, res),
    },
  };

  return {
    async route(req, res) {
      try {
        const { method, path } = req;

        const handler = routes[method]?.[path];
        if (handler) {
          return handler(req, res);
        }

        res.status(404).json({ message: "HealthCheck route not found" });
      } catch (error) {
        res.status(error.statusCode || 500).json({
          message: error.message || "Internal Server Error",
          code: error.statusCode || 500,
        });
      }
    },
  };
}
