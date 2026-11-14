import { ValidationError } from "../errors/app.error.js";
import * as doctorScheduleService from "../services/doctorSchedule.service.js";

export async function getAvailability(req, res) {
  const { doctorId } = req.params;
  const { date, appointmentType } = req.query;

  if (!date) {
    throw new ValidationError("La fecha es obligatoria");
  }

  if (!appointmentType) {
    throw new ValidationError("El tipo de cita es obligatorio");
  }

  const availability = await doctorScheduleService.getDoctorAvailability(
    doctorId,
    date,
    appointmentType,
  );

  return res.status(200).json(availability);
}

export async function setSchedule(req, res) {
  const { doctorId, dayOfWeek } = req.params;
  const { blocks } = req.body;

  const schedule = await doctorScheduleService.setDoctorSchedule(
    doctorId,
    Number(dayOfWeek),
    blocks,
  );

  return res.status(200).json(schedule);
}
