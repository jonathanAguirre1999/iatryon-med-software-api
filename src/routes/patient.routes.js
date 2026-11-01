import { Router } from "express";
import { requireRole } from "../middlewares/requireRole.middleware.js";
import * as patientController from "../controllers/patient.controller.js";

const router = Router();

router.get(
  "/:id",
  requireRole("ADMIN", "RECEPTIONIST", "DOCTOR"),
  patientController.getPatientById,
);

router.get(
  "/",
  requireRole("ADMIN", "RECEPTIONIST", "DOCTOR"),
  patientController.getAllPatients,
);

router.post(
  "/",
  requireRole("ADMIN", "RECEPTIONIST", "DOCTOR"),
  patientController.createPatient,
);

router.put(
  "/:id",
  requireRole("ADMIN", "RECEPTIONIST"),
  patientController.updatePatient,
);

router.patch(
  "/:id",
  requireRole("ADMIN", "RECEPTIONIST"),
  patientController.partialUpdatePatient,
);

router.delete("/:id", requireRole("ADMIN"), patientController.deletePatient);

export default router;
