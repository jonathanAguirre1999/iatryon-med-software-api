import { InternalServerError } from "../errors/app.error.js";

export const healthcheck = async (req, res) => {
  try {
    res.status(200).json({ status: "OK", message: "Servicio en línea" });
  } catch (error) {
    throw new InternalServerError(
      "Error durante la verificación de salud del servicio",
      error,
    );
  }
};
