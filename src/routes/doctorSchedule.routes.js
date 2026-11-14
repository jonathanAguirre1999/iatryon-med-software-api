import { Router } from "express";
import { requireRole } from "../middlewares/requireRole.middleware.js";
import * as doctorScheduleController from "../controllers/doctorSchedule.controller.js";

const router = Router();

router.get("/:doctorId/availability", doctorScheduleController.getAvailability);
router.put(
  "/:doctorId/schedule/:dayOfWeek",
  requireRole("ADMIN"),
  doctorScheduleController.setSchedule,
);

export default router;
