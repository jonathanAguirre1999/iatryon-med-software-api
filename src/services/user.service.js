import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import {
  NotFoundError,
  BadRequestError,
  ValidationError,
} from "../errors/app.error.js";

//get
export async function getUserById(id) {
  const foundUser = await User.findById(id);
  if (!foundUser) throw new NotFoundError("Usuario no encontrado");
  return foundUser;
}

//getall
export function getAllUsers() {
  return User.find();
}

//post
export async function createUser(userData) {
  if (!userData || Object.keys(userData).length === 0)
    throw new BadRequestError("Datos de usuario inválidos");

  const passwordHash = await bcrypt.hash(userData.password, 12);
  return User.create({ ...userData, password: passwordHash });
}

//put
export async function updateUser(id, updatedUserData) {
  const user = await User.findById(id);

  if (!user) throw new NotFoundError("Usuario no encontrado");

  const {
    userName,
    fullName,
    idType,
    idNumber,
    email,
    isActive,
    isAccountBlocked,
  } = updatedUserData;

  if (
    !userName ||
    !fullName ||
    !email ||
    !idType ||
    !idNumber ||
    isActive === undefined ||
    isAccountBlocked === undefined
  ) {
    throw new ValidationError("Todos los campos requeridos deben ser enviados");
  }

  user.userName = userName;
  user.fullName = fullName;
  user.idType = idType;
  user.idNumber = idNumber;
  user.email = email;
  user.isActive = isActive;
  user.isAccountBlocked = isAccountBlocked;

  return user.save();
}

//patch
export async function partialUpdateUser(id, updatedUserData) {
  const user = await User.findById(id);
  if (!user) throw new NotFoundError("Usuario no encontrado");

  const allowedFields = [
    "userName",
    "fullName",
    "email",
    "isActive",
    "isAccountBlocked",
    "idType",
    "idNumber",
  ];

  const validEntries = Object.entries(updatedUserData).filter(
    ([key, value]) => allowedFields.includes(key) && value !== undefined,
  );

  if (validEntries.length === 0) {
    throw new ValidationError(
      "Al menos un campo debe ser enviado para la actualización",
    );
  }

  validEntries.forEach(([key, value]) => {
    user[key] = value;
  });
  return user.save();
}

//delete
export async function deleteUser(id) {
  const user = await User.findById(id);

  if (!user) throw new NotFoundError("Usuario no encontrado");

  await user.deleteOne();
}
