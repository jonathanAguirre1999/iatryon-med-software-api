import { UnauthorizedError } from "../errors/app.error.js";

export function requireAuth(req, res, next) {
  if (!req.session?.user) {
    throw new UnauthorizedError("No autorizado");
  }
  next();
}
