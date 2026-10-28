import { Patient } from "../models/patient.model.js";

//get
export async function getPatientById(id) {
  const patient = await Patient.findById(id);
  if (!patient) throw new NotFoundError("Paciente no encontrado");
  return patient;
}

//getall
export async function getAllPatients() {
  return await Patient.find();
}

//post
export async function createPatient(patientData) {
  if (!patientData) throw new BadRequestError("Datos de paciente inválidos");
  return await Patient.create(patientData);
}

//put
export async function updatePatient(id, updatedPatientData) {
  const patient = await Patient.findById(id);

  if (!patient) throw new NotFoundError("Paciente no encontrado");

  const {
    firstName,
    middleName,
    firstLastName,
    secondLastName,
    idType,
    idNumber,
    country,
    city,
    stateProvince,
    address,
    gender,
    birthDate,
    phone,
    educationLevel,
    occupation,
    isActive,
    email,
  } = updatedPatientData;

  if (
    !firstName ||
    !firstLastName ||
    !idType ||
    !idNumber ||
    !country ||
    !city ||
    !stateProvince ||
    !address ||
    !email ||
    !gender ||
    !birthDate ||
    !phone ||
    !educationLevel ||
    !occupation ||
    isActive === undefined
  ) {
    throw new ValidationError("Todos los campos requeridos deben ser enviados");
  }

  patient.firstName = firstName;
  patient.middleName = middleName;
  patient.firstLastName = firstLastName;
  patient.secondLastName = secondLastName;
  patient.idType = idType;
  patient.idNumber = idNumber;
  patient.country = country;
  patient.city = city;
  patient.stateProvince = stateProvince;
  patient.address = address;
  patient.gender = gender;
  patient.email = email;
  return await patient.save();
}

//patch
export async function partialUpdatePatient(id, updatedPatientData) {
  const patient = await Patient.findById(id);
  if (!patient) throw new NotFoundError("Paciente no encontrado");

  const allowedFields = [
    "firstName",
    "middleName",
    "firstLastName",
    "secondLastName",
    "idType",
    "idNumber",
    "country",
    "city",
    "stateProvince",
    "address",
    "gender",
    "email",
    "birthDate",
    "phone",
    "educationLevel",
    "occupation",
    "isActive",
  ];

  const validEntries = Object.entries(updatedPatientData).filter(
    ([key, value]) => allowedFields.includes(key) && value !== undefined,
  );

  if (validEntries.length === 0) {
    throw new ValidationError(
      "Al menos un campo debe ser enviado para la actualización",
    );
  }

  validEntries.forEach(([key, value]) => {
    patient[key] = value;
  });

  return await patient.save();
}

//delete
export async function deletePatient(id) {
  const patient = await Patient.findById(id);

  if (!patient) throw new NotFoundError("Paciente no encontrado");

  await patient.deleteOne();
}
