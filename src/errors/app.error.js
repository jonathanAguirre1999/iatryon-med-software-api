export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Recurso no encontrado") {
    super(message, 404);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Solicitud incorrecta") {
    super(message, 400);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Existe un conflicto en la solicitud") {
    super(message, 409);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "No tiene autorización para acceder a este recurso") {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "No tiene permisos para acceder a este recurso") {
    super(message, 403);
  }
}

export class InternalServerError extends AppError {
  constructor(message = "Error interno del servidor") {
    super(message, 500);
  }
}
