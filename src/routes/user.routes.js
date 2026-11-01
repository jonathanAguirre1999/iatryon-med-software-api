import { Router } from "express";
import { requireRole } from "../middlewares/requireRole.middleware.js";
import * as userController from "../controllers/user.controller.js";

const router = Router();

router.get("/:id", requireRole("ADMIN"), userController.getUserById);
router.get("/", requireRole("ADMIN"), userController.getAllUsers);
router.post("/", requireRole("ADMIN"), userController.createUser);
router.put("/:id", requireRole("ADMIN"), userController.updateUser);
router.patch("/:id", requireRole("ADMIN"), userController.patchUser);
router.delete("/:id", requireRole("ADMIN"), userController.deleteUser);

export default router;
