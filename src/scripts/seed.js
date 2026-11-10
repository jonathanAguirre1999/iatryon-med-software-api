import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

import { connectDatabase } from "../src/config/database.js";
import { User } from "../src/models/user.model.js";
import { Patient } from "../src/models/patient.model.js";
import { Appointment } from "../src/models/appointment.model.js";

function futureDate(days, hour, minute = 0) {
  const date = new Date();

  date.setDate(date.getDate() + days);
  date.setHours(hour, minute, 0, 0);

  return date;
}

async function seed() {
  try {
    await connectDatabase();

    console.log("Limpiando datos anteriores");

    await Appointment.deleteMany({});
    await Patient.deleteMany({});
    await User.deleteMany({});

    console.log("Creando usuarios");

    const passwordHash = await bcrypt.hash("Iatryon123!", 12);

    const [admin, doctor, receptionist] = await User.create([
      {
        userName: "admin",
        fullName: "ADMINISTRADOR",
        idType: "CEDULA",
        idNumber: "1700000001",
        email: "admin@iatryon.com",
        password: passwordHash,
        role: "ADMIN",
      },
      {
        userName: "doctor01",
        fullName: "CARLOS ANDRADE",
        idType: "CEDULA",
        idNumber: "1700000002",
        email: "doctor@iatryon.com",
        password: passwordHash,
        role: "DOCTOR",
      },
      {
        userName: "recepcion01",
        fullName: "MARIA TORRES",
        idType: "CEDULA",
        idNumber: "1700000003",
        email: "recepcion@iatryon.com",
        password: passwordHash,
        role: "RECEPTIONIST",
      },
    ]);

    console.log("Creando pacientes");

    const [patient1, patient2] = await Patient.create([
      {
        firstName: "JUAN",
        middleName: "CARLOS",
        firstLastName: "PEREZ",
        secondLastName: "LOPEZ",
        idType: "CEDULA",
        idNumber: "1712345678",
        email: "juan.perez@example.com",
        country: "ECUADOR",
        city: "QUITO",
        stateProvince: "PICHINCHA",
        address: "AV. PRINCIPAL 123",
        gender: "MASCULINO",
        birthDate: new Date("1995-06-15"),
        phone: "0991234567",
        educationLevel: "SUPERIOR COMPLETA",
        occupation: "INGENIERO",
      },
      {
        firstName: "ANA",
        firstLastName: "GOMEZ",
        idType: "CEDULA",
        idNumber: "1712345679",
        country: "ECUADOR",
        city: "QUITO",
        stateProvince: "PICHINCHA",
        address: "CALLE SECUNDARIA 456",
        gender: "FEMENINO",
        birthDate: new Date("1998-03-22"),
        phone: "0987654321",
        educationLevel: "SUPERIOR COMPLETA",
        occupation: "ARQUITECTA",
      },
    ]);

    console.log("Creando citas");

    const firstStart = futureDate(2, 10);
    const firstEnd = new Date(firstStart.getTime() + 40 * 60_000);

    const followUpStart = futureDate(3, 14);
    const followUpEnd = new Date(followUpStart.getTime() + 20 * 60_000);

    await Appointment.create([
      {
        patientId: patient1._id,
        doctorId: doctor._id,
        appointmentType: "PRIMERA VEZ",
        startAt: firstStart,
        endAt: firstEnd,
        duration: 40,
        status: "RESERVADA",
        reason: "Consulta médica inicial",
        createdBy: receptionist._id,
      },
      {
        patientId: patient2._id,
        doctorId: doctor._id,
        appointmentType: "SEGUIMIENTO",
        startAt: followUpStart,
        endAt: followUpEnd,
        duration: 20,
        status: "RESERVADA",
        reason: "Control de seguimiento",
        createdBy: admin._id,
      },
    ]);

    console.log("\nSeed completado correctamente.");
    console.log("Credenciales de prueba:");
    console.log("ADMIN: \nadmin / Iatryon123!");
    console.log("DOCTOR: \ndoctor01 / Iatryon123!");
    console.log("RECEPTIONIST: \nrecepcion01 / Iatryon123!");
  } catch (error) {
    console.error("Error ejecutando seed:");
    console.error(error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seed();
