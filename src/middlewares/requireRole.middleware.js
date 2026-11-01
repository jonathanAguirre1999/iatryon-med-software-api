import { ForbiddenError } from "../errors/app.error.js";

export function requireRole(...allowedRoles) {
  return function (req, res, next) {
    if (!allowedRoles.includes(req.session?.user?.role)) {
      throw new ForbiddenError("No tienes permiso para acceder a este recurso");
    }

    next();
  };
}
