import swaggerJsdoc from "swagger-jsdoc";
import { config } from "@/config";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "BookMyEvent Nodejs API",
      version: "1.0.0",
      description: "Backend API for Event Booking System",
    },
    servers: [
      {
        url: config.SWAGGER_URL_DEV,
        description: "Local server",
      },
      {
        url : config.SWAGGER_URL_PROD,
        description : "Production server"
      }
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "accessToken",
        },
      },
    },
    security: [
      {
        cookieAuth: [],
      },
    ],
  },
  apis: [
    "src/presentation/routes/**/*.ts",
    "src/config/swagger/schemas.ts",
  ],
});
