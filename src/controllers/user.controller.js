import * as userService from "../services/user.service.js";
import { toUserDTO } from "../mappers/user.mapper.js";

//get
export async function getUserById(req, res) {
  const { id } = req.params;
  const user = await userService.getUserById(id);
  const userDTO = toUserDTO(user);
  return res.status(200).json(userDTO);
}

//getall
export async function getAllUsers(req, res) {
  const users = await userService.getAllUsers();
  return res.status(200).json(users.map(toUserDTO));
}

//post
export async function createUser(req, res) {
  const userData = req.body;
  const newUser = await userService.createUser(userData);
  return res.status(201).json(toUserDTO(newUser));
}

//put
export async function updateUser(req, res) {
  const { id } = req.params;
  const updatedUserData = req.body;
  const updatedUser = await userService.updateUser(id, updatedUserData);
  return res.status(200).json(toUserDTO(updatedUser));
}

//patch
export async function patchUser(req, res) {
  const { id } = req.params;
  const updatedFields = req.body;
  const updatedUser = await userService.partialUpdateUser(id, updatedFields);
  return res.status(200).json(toUserDTO(updatedUser));
}

//delete
export async function deleteUser(req, res) {
  const { id } = req.params;
  await userService.deleteUser(id);
  return res.status(204).send();
}
