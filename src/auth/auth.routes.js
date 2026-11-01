import * as authController from "../auth/auth.controller.js";
import { Router } from "express";

const router = Router();

router.post("/login", authController.login);
router.post("/logout", authController.logout);

export default router;
