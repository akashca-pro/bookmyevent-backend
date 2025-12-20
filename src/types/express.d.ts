import "express";

declare module "express" {
  interface Request {
    userId?: string;
    name? : string;
    email?: string;
    role?: string;
    validated?: Record<"body" | "query" | "params", any>;
  }
}
