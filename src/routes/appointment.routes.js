import * as appointmentController from "../controllers/appointment.controller.js";
import { requireRole } from "../middlewares/requireRole.middleware.js";
import { Router } from "express";

const router = Router();

router.post(
  "/",
  requireRole("ADMIN", "RECEPTIONIST", "DOCTOR"),
  appointmentController.createAppointment,
);

router.get(
  "/:id",
  requireRole("ADMIN", "RECEPTIONIST", "DOCTOR"),
  appointmentController.getAppointmentById,
);

router.get(
  "/",
  requireRole("ADMIN", "RECEPTIONIST", "DOCTOR"),
  appointmentController.getAllAppointments,
);

router.put(
  "/:id",
  requireRole("ADMIN", "RECEPTIONIST"),
  appointmentController.updateAppointment,
);

router.patch(
  "/:id",
  requireRole("ADMIN", "RECEPTIONIST"),
  appointmentController.patchAppointment,
);

router.delete(
  "/:id",
  requireRole("ADMIN"),
  appointmentController.deleteAppointment,
);

export default router;
