import { Router } from "express";
import * as userController from "../controllers/user.controller.js";

const router = Router();

router.get("/:id", userController.getUserById);
router.get("/", userController.getAllUsers);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.patch("/:id", userController.patchUser);
router.delete("/:id", userController.deleteUser);

export default router;
