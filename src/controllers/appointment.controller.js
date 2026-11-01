import * as appointmentService from "../services/appointment.service.js";
import { toAppointmentDTO } from "../mappers/appointment.mapper.js";
import { getIO } from "../sockets/socket.instance.js";

//post
export async function createAppointment(req, res) {
  const appointmentData = { ...req.body, createdBy: req.session.user.id };

  const newAppointment =
    await appointmentService.createAppointment(appointmentData);

  getIO().emit("appointmentCreated", toAppointmentDTO(newAppointment));
  return res.status(201).json(toAppointmentDTO(newAppointment));
}

//get
export async function getAppointmentById(req, res) {
  const { id } = req.params;
  const appointment = await appointmentService.getAppointmentById(id);
  return res.status(200).json(toAppointmentDTO(appointment));
}

//get all
export async function getAllAppointments(req, res) {
  const appointments = await appointmentService.getAllAppointments();
  return res.status(200).json(appointments.map(toAppointmentDTO));
}

//put
export async function updateAppointment(req, res) {
  const { id } = req.params;
  const updatedAppointmentData = req.body;
  const updatedAppointment = await appointmentService.updateAppointment(
    id,
    updatedAppointmentData,
  );
  return res.status(200).json(toAppointmentDTO(updatedAppointment));
}

//patch
export async function patchAppointment(req, res) {
  const { id } = req.params;
  const updatedFields = req.body;
  const updatedAppointment = await appointmentService.partialUpdateAppointment(
    id,
    updatedFields,
  );
  return res.status(200).json(toAppointmentDTO(updatedAppointment));
}

//delete
export async function deleteAppointment(req, res) {
  const { id } = req.params;
  await appointmentService.deleteAppointment(id);
  return res.status(204).send();
}
