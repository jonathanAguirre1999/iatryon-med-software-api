import { User } from "../models/user.model.js";
import { UnauthorizedError } from "../errors/app.error.js";
import bcrypt from "bcrypt";

export async function authenticateUser(userName, password) {
  const user = await User.findOne({ userName }).select("+password");
  if (!user) {
    throw new UnauthorizedError("Usuario o contraseña incorrectos");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError("Usuario o contraseña incorrectos");
  }

  if (!user.isActive || user.isAccountBlocked) {
    throw new UnauthorizedError(
      "Cuenta bloqueada o desactivada. Por favor, contacte al administrador.",
    );
  }

  return user;
}
