import { User } from "../models/user.model.js";

//get
export async function getUserById(id) {
  const foundUser = await User.findById(id);
  if (!foundUser) throw new NotFoundError("Usuario no encontrado");
  return foundUser;
}

//getall
export async function getAllUsers() {
  return await User.find();
}

//post
export async function createUser(userData) {
  if (!userData) throw new BadRequestError("Datos de usuario inválidos");
  return await User.create(userData);
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

  return await user.save();
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
  return await user.save();
}

//delete
export async function deleteUser(id) {
  const user = await User.findById(id);

  if (!user) throw new NotFoundError("Usuario no encontrado");

  await user.deleteOne();
  return user;
}
