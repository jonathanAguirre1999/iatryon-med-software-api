import { authenticateUser } from "../auth/auth.service.js";
import { InternalServerError } from "../errors/app.error.js";
import { getIO } from "../sockets/socket.instance.js";

export async function login(req, res) {
  const { userName, password } = req.body;

  const user = await authenticateUser(userName, password);

  req.session.user = {
    id: user._id,
    role: user.role,
  };

  getIO().emit("userLoggedIn", { userName: user.userName });
  return res.status(200).json({ message: "Inicio de sesión exitoso" });
}

export function logout(req, res, next) {
  req.session.destroy((err) => {
    if (err) {
      return next(new InternalServerError("Error al cerrar sesión"));
    }

    res.clearCookie("iatryon_session.sid", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.status(200).json({ message: "Sesión cerrada exitosamente" });
  });
}
