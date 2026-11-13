export function toAppointmentDTO(appointment) {
  return {
    id: appointment._id,

    patient: {
      id: appointment.patientId._id,
      name: `${appointment.patientId.firstName} ${appointment.patientId.middleName ?? ""} ${appointment.patientId.firstLastName} ${appointment.patientId.secondLastName ?? ""}`.trim(),
      idType: appointment.patientId.idType,
      idNumber: appointment.patientId.idNumber,
    },

    doctor: {
      id: appointment.doctorId._id,
      fullName: appointment.doctorId.fullName,
    },

    appointmentType: appointment.appointmentType,
    startAt: appointment.startAt,
    endAt: appointment.endAt,
    duration: appointment.duration,
    reason: appointment.reason ?? "",
    status: appointment.status,

    createdBy: {
      id: appointment.createdBy._id,
      userName: appointment.createdBy.userName,
      fullName: appointment.createdBy.fullName,
    },
  };
}
