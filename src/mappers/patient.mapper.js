export function toPatientDTO(patient) {
  return {
    id: patient._id,
    firstName: patient.firstName,
    middleName: patient.middleName ?? "",
    firstLastName: patient.firstLastName,
    secondLastName: patient.secondLastName ?? "",
    idType: patient.idType,
    idNumber: patient.idNumber,
    country: patient.country,
    city: patient.city,
    stateProvince: patient.stateProvince,
    address: patient.address,
    gender: patient.gender,
    birthDate: patient.birthDate,
    phone: patient.phone,
    educationLevel: patient.educationLevel,
    occupation: patient.occupation,
    isActive: patient.isActive,
    email: patient.email ?? "",
  };
}
