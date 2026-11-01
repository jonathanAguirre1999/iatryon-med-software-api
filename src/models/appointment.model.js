import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    appointmentType: {
      type: String,
      enum: ["PRIMERA VEZ", "SEGUIMIENTO"],
      required: true,
    },

    duration: {
      type: Number,
      enum: [40, 20],
      required: true,
    },

    startAt: {
      type: Date,
      required: true,
    },

    endAt: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["RESERVADA", "PAGADA", "ASISTE", "NO ASISTE", "CANCELADA"],
      default: "RESERVADA",
    },

    reason: {
      type: String,
      maxlength: 500,
      trim: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

appointmentSchema.index({ doctorId: 1, startAt: 1 });
appointmentSchema.index({ patientId: 1, startAt: 1 });

export const Appointment = mongoose.model("Appointment", appointmentSchema);
