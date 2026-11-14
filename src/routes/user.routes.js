import { Router } from "express";
import { requireRole } from "../middlewares/requireRole.middleware.js";
import * as userController from "../controllers/user.controller.js";

const router = Router();

router.get(
  "/doctors",
  requireRole("ADMIN", "DOCTOR", "RECEPTIONIST"),
  userController.getDoctors,
);
router.get("/", requireRole("ADMIN"), userController.getAllUsers);
router.get(
  "/inactive",
  requireRole("ADMIN"),
  userController.getAllInactiveUsers,
);
router.get("/:id", requireRole("ADMIN"), userController.getUserById);
router.post("/", requireRole("ADMIN"), userController.createUser);
router.put("/:id", requireRole("ADMIN"), userController.updateUser);
router.patch("/:id", requireRole("ADMIN"), userController.patchUser);
router.patch(
  "/:id/status",
  requireRole("ADMIN"),
  userController.changeActiveStatus,
);
router.patch(
  "/:id/block",
  requireRole("ADMIN"),
  userController.changeBlockStatus,
);

export default router;
