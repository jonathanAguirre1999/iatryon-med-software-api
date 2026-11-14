import express from "express";
import "dotenv/config";
import { errorHandler } from "./middlewares/error.middleware.js";
import userRoutes from "./routes/user.routes.js";
import patientRoutes from "./routes/patient.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import authRoutes from "./auth/auth.routes.js";
import healthcheckRoutes from "./routes/healthcheck.routes.js";
import doctorScheduleRoutes from "./routes/doctorSchedule.routes.js";
import sessionConfig from "./config/session.js";
import { requireAuth } from "./middlewares/requireAuth.middleware.js";
import cors from "cors";

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(express.json());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(sessionConfig);

// Rutas públicas
app.use("/api/auth", authRoutes);
app.use("/api/healthcheck", healthcheckRoutes);

app.use(requireAuth);

// Rutas protegidas
app.use("/api/users", userRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/doctors", doctorScheduleRoutes);

app.use(errorHandler);

export default app;
