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
    startAt: formatDate(appointment.startAt),
    endAt: formatDate(appointment.endAt),
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

//helper para las fechas
function formatDate(date) {
  const d = new Date(date);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} - ${hours}:${minutes}`;
}
