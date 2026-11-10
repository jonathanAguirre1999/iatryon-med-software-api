import * as authController from "../auth/auth.controller.js";
import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.middleware.js";

const router = Router();

router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/me", requireAuth, authController.me);

export default router;
