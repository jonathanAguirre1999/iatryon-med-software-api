import { AppError } from "../errors/app.error.js";

export function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err.name === "ValidationError") {
    return res.status(422).json({ message: err.message });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ message: "ID inválido" });
  }

  if (err.code === 11000) {
    return res
      .status(409)
      .json({ message: "Ya existe un recurso con estos datos" });
  }

  console.error(err);
  return res.status(500).json({ message: "Error interno del servidor" });
}
