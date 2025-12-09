import "express";

declare module "express" {
  interface Request {
    userId?: string;
    role?: string;
    username?: string;
    email?: string;
    accessTokenId?: string;
    refreshTokenId?: string;
    accessTokenExp?: number;
    refreshTokenExp?: number;
    validated?: Record<"body" | "query" | "params", any>;
  }
}
