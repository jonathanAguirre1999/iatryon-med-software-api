import * as patientService from "../services/patient.service.js";
import { toPatientDTO } from "../mappers/patient.mapper.js";

//get
export async function getPatientById(req, res) {
  const { id } = req.params;
  const patient = await patientService.getPatientById(id);
  const patientDTO = toPatientDTO(patient);
  return res.status(200).json(patientDTO);
}

//getall
export async function getAllPatients(req, res) {
  const patients = await patientService.getAllPatients();
  return res.status(200).json(patients.map(toPatientDTO));
}

//post
export async function createPatient(req, res) {
  const patientData = req.body;
  const newPatient = await patientService.createPatient(patientData);
  return res.status(201).json(toPatientDTO(newPatient));
}

//put
export async function updatePatient(req, res) {
  const { id } = req.params;
  const updatedPatientData = req.body;
  const updatedPatient = await patientService.updatePatient(
    id,
    updatedPatientData,
  );
  return res.status(200).json(toPatientDTO(updatedPatient));
}

//patch
export async function partialUpdatePatient(req, res) {
  const { id } = req.params;
  const updatedFields = req.body;
  const updatedPatient = await patientService.partialUpdatePatient(
    id,
    updatedFields,
  );
  return res.status(200).json(toPatientDTO(updatedPatient));
}

//delete
export async function deletePatient(req, res) {
  const { id } = req.params;
  await patientService.deletePatient(id);
  return res.status(204).send();
}
