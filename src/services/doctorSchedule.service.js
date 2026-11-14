import { getUserById } from "./user.service.js";
import { ValidationError } from "../errors/app.error.js";
import { DoctorSchedule } from "../models/doctorSchedule.model.js";
import { Appointment } from "../models/appointment.model.js";

const SLOT_MINUTES = 20;

export async function getDoctorAvailability(doctorId, date, appointmentType) {
  await validateDoctor(doctorId);

  const duration = getAppointmentDuration(appointmentType);

  const dayOfWeek = getDayOfWeek(date);

  const schedule = await getDoctorSchedule(doctorId, dayOfWeek);

  if (!schedule) {
    return {
      doctorId,
      date,
      appointmentType,
      duration,
      slots: [],
    };
  }

  const dayStart = new Date(`${date}T00:00:00-05:00`);

  const dayEnd = new Date(`${date}T23:59:59.999-05:00`);

  const appointments = await Appointment.find({
    doctorId,
    status: {
      $ne: "CANCELADA",
    },
    startAt: {
      $lt: dayEnd,
    },
    endAt: {
      $gt: dayStart,
    },
  });

  const slots = [];

  for (const block of schedule.blocks) {
    const blockStart = new Date(`${date}T${block.start}:00-05:00`);

    const blockEnd = new Date(`${date}T${block.end}:00-05:00`);

    let candidateStart = new Date(blockStart);

    while (candidateStart < blockEnd) {
      const candidateEnd = new Date(
        candidateStart.getTime() + duration * 60_000,
      );

      if (candidateEnd > blockEnd) {
        break;
      }

      const hasConflict = appointments.some(
        (appointment) =>
          appointment.startAt < candidateEnd &&
          appointment.endAt > candidateStart,
      );

      if (!hasConflict) {
        slots.push({
          startAt: candidateStart.toISOString(),
          endAt: candidateEnd.toISOString(),
        });
      }

      candidateStart = new Date(
        candidateStart.getTime() + SLOT_MINUTES * 60_000,
      );
    }
  }

  return {
    doctorId,
    date,
    appointmentType,
    duration,
    slots,
  };
}

export async function setDoctorSchedule(doctorId, dayOfWeek, blocks) {
  await validateDoctor(doctorId);

  validateScheduleBlocks(blocks);

  return DoctorSchedule.findOneAndUpdate(
    {
      doctorId,
      dayOfWeek,
    },
    {
      doctorId,
      dayOfWeek,
      blocks,
      isActive: true,
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
    },
  );
}

function validateScheduleBlocks(blocks) {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    throw new ValidationError("Debe existir al menos un bloque horario");
  }

  for (const block of blocks) {
    if (!block.start || !block.end) {
      throw new ValidationError("Cada bloque debe tener hora de inicio y fin");
    }

    if (block.start >= block.end) {
      throw new ValidationError(
        "La hora de inicio debe ser menor que la hora de fin",
      );
    }
  }
}

function getAppointmentDuration(appointmentType) {
  if (appointmentType === "PRIMERA VEZ") {
    return 40;
  }

  if (appointmentType === "SEGUIMIENTO") {
    return 20;
  }

  throw new ValidationError("Tipo de cita inválido");
}

function getDayOfWeek(date) {
  const parsedDate = new Date(`${date}T12:00:00-05:00`);

  if (isNaN(parsedDate.getTime())) {
    throw new ValidationError("Fecha inválida");
  }

  return parsedDate.getDay();
}

export async function getDoctorSchedule(doctorId, dayOfWeek) {
  await validateDoctor(doctorId);

  return DoctorSchedule.findOne({
    doctorId,
    dayOfWeek,
    isActive: true,
  });
}

//--------------------------- validations ------------------------------------------//
async function validateDoctor(doctorId) {
  const doctor = await getUserById(doctorId);

  if (doctor.role !== "DOCTOR") {
    throw new ValidationError("El usuario no es un doctor");
  }

  if (!doctor.isActive) {
    throw new ValidationError("El doctor no se encuentra activo en el sistema");
  }

  return doctor;
}
