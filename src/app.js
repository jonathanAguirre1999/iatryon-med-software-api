import express from "express";
import "dotenv/config";
import { connectDatabase } from "./config/database.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import userRoutes from "./routes/user.routes.js";
import patientRoutes from "./routes/patient.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import authRoutes from "./auth/auth.routes.js";
import sessionConfig from "./config/session.js";
import { requireAuth } from "./middlewares/requireAuth.middleware.js";

const app = express();

app.use(express.json());

app.use(sessionConfig);

// Rutas públicas
app.use("/api/auth", authRoutes);

app.use(requireAuth);

// Rutas protegidas
app.use("/api/users", userRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);

app.use(errorHandler);

export default app;
