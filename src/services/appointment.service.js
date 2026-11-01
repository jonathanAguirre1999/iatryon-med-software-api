import { Appointment } from "../models/appointment.model.js";
import { getPatientById } from "./patient.service.js";
import { getUserById } from "./user.service.js";
import {
  ValidationError,
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../errors/app.error.js";

//post
export async function createAppointment(appointmentData) {
  if (!appointmentData || Object.keys(appointmentData).length === 0)
    throw new BadRequestError("Datos de cita no proporcionados");

  //validaciones
  await Promise.all([
    validateDoctor(appointmentData.doctorId),
    validatePatient(appointmentData.patientId),
  ]);

  //calcular duracion y horarios de inicio y fin de la cita
  const duration = getAppointmentDuration(appointmentData.appointmentType);

  const startAt = validateStartAt(appointmentData.startAt);

  const endAt = new Date(startAt.getTime() + duration * 60000);

  await validateAvailability(
    appointmentData.doctorId,
    startAt,
    endAt,
    appointmentData.patientId,
  );

  //creacion de cita con campos validados y persistencia en la db
  const appointment = new Appointment({
    ...appointmentData,
    duration,
    startAt,
    endAt,
    status: "RESERVADA",
  });

  await appointment.save();
  await populateData(appointment);

  return appointment;
}

//get
export async function getAppointmentById(id) {
  const appointment = await Appointment.findById(id);

  if (!appointment) {
    throw new NotFoundError("Cita no encontrada");
  }

  await populateData(appointment);

  return appointment;
}

//get all
export async function getAllAppointments() {
  const appointments = await Appointment.find();

  await Promise.all(
    appointments.map((appointment) => populateData(appointment)),
  );

  return appointments;
}

//put
export async function updateAppointment(id, updatedData) {
  const appointment = await getAppointmentById(id);

  const { patientId, doctorId, appointmentType, startAt, reason } = updatedData;

  if (
    !patientId ||
    !doctorId ||
    !appointmentType ||
    !startAt ||
    reason === undefined
  ) {
    throw new ValidationError("Todos los campos requeridos deben ser enviados");
  }

  //validaciones que impiden modificar citas que ya ocurrieron o que se encuentran cerradas
  if (startAt < new Date()) {
    throw new ConflictError("No se puede modificar una cita que ya ocurrió");
  }

  const lockedStatuses = ["ASISTE", "NO ASISTE", "CANCELADA"];

  if (lockedStatuses.includes(appointment.status)) {
    throw new ConflictError(
      "La cita ya se encuentra cerrada y no puede modificarse",
    );
  }

  await Promise.all([validateDoctor(doctorId), validatePatient(patientId)]);

  const duration = getAppointmentDuration(appointmentType);

  const startDate = validateStartAt(startAt);
  const endDate = new Date(startDate.getTime() + duration * 60000);

  await validateAvailability(doctorId, startDate, endDate, patientId, id);

  appointment.patientId = patientId;
  appointment.doctorId = doctorId;
  appointment.appointmentType = appointmentType;
  appointment.startAt = startDate;
  appointment.endAt = endDate;
  appointment.duration = duration;
  appointment.reason = reason;

  await appointment.save();
  await populateData(appointment);

  return appointment;
}

//patch
export async function partialUpdateAppointment(id, updatedFields) {
  const appointment = await getAppointmentById(id);

  const allowedFields = [
    "patientId",
    "doctorId",
    "appointmentType",
    "startAt",
    "reason",
  ];

  const validEntries = Object.entries(updatedFields).filter(
    ([key, value]) => allowedFields.includes(key) && value !== undefined,
  );

  if (validEntries.length === 0) {
    throw new ValidationError(
      "No se proporcionaron campos válidos para actualizar",
    );
  }

  //validaciones que impiden modificar citas que ya ocurrieron o que se encuentran cerradas

  const lockedStatuses = ["ASISTE", "NO ASISTE", "CANCELADA"];

  if (lockedStatuses.includes(appointment.status)) {
    throw new ConflictError(
      "La cita ya se encuentra cerrada y no puede modificarse",
    );
  }

  const finalDoctorId = updatedFields.doctorId ?? appointment.doctorId;

  const finalPatientId = updatedFields.patientId ?? appointment.patientId;

  const finalAppointmentType =
    updatedFields.appointmentType ?? appointment.appointmentType;

  const finalStartAt = updatedFields.startAt ?? appointment.startAt;

  await Promise.all([
    validateDoctor(finalDoctorId),
    validatePatient(finalPatientId),
  ]);

  const duration = getAppointmentDuration(finalAppointmentType);

  const startAt = validateStartAt(finalStartAt);

  const endAt = new Date(startAt.getTime() + duration * 60_000);

  await validateAvailability(finalDoctorId, startAt, endAt, finalPatientId, id);

  appointment.doctorId = finalDoctorId;
  appointment.patientId = finalPatientId;
  appointment.appointmentType = finalAppointmentType;
  appointment.startAt = startAt;
  appointment.endAt = endAt;
  appointment.duration = duration;

  if (updatedFields.reason !== undefined) {
    appointment.reason = updatedFields.reason;
  }

  await appointment.save();
  await populateData(appointment);

  return appointment;
}

//delete
export async function deleteAppointment(id) {
  const appointment = await getAppointmentById(id);
  return appointment.deleteOne();
}

// ----------------------------- validadores ------------------------------

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

async function validatePatient(patientId) {
  const patient = await getPatientById(patientId);

  if (!patient.isActive) {
    throw new ValidationError(
      "El paciente no se encuentra activo en el sistema",
    );
  }

  return patient;
}

function getAppointmentDuration(appointmentType) {
  let duration;
  if (appointmentType === "PRIMERA VEZ") {
    duration = 40;
  } else if (appointmentType === "SEGUIMIENTO") {
    duration = 20;
  } else {
    throw new ValidationError("Tipo de cita inválido");
  }
  return duration;
}

function validateStartAt(startAt) {
  const startDate = new Date(startAt);
  if (isNaN(startDate.getTime()) || startDate < new Date()) {
    throw new ValidationError("Fecha de inicio inválida");
  }
  return startDate;
}

async function validateAvailability(
  doctorId,
  startAt,
  endAt,
  patientId,
  appointmentId,
) {
  //valida cruces entre citas del mismo doctor
  const doctorQuery = {
    doctorId: doctorId,
    status: { $ne: "CANCELADA" },
    startAt: { $lt: endAt },
    endAt: { $gt: startAt },
  };

  if (appointmentId) doctorQuery._id = { $ne: appointmentId };

  const doctorConflict = await Appointment.findOne(doctorQuery);

  if (doctorConflict) {
    throw new ConflictError("Horario con el doctor no disponible");
  }

  //valida cruces entre citas del mismo paciente
  const patientQuery = {
    patientId: patientId,
    status: { $ne: "CANCELADA" },
    startAt: { $lt: endAt },
    endAt: { $gt: startAt },
  };

  if (appointmentId) patientQuery._id = { $ne: appointmentId };

  const patientConflict = await Appointment.findOne(patientQuery);

  if (patientConflict) {
    throw new ConflictError(
      "Este paciente ya tiene una cita programada en este horario",
    );
  }
}

async function populateData(appointment) {
  return appointment.populate([
    {
      path: "doctorId",
      select: "userName fullName",
    },
    {
      path: "patientId",
      select:
        "firstName middleName firstLastName secondLastName idType idNumber",
    },
    {
      path: "createdBy",
      select: "userName fullName",
    },
  ]);
}
