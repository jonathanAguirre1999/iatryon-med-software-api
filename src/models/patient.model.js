import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      minlength: 1,
      maxlength: 20,
    },

    middleName: {
      type: String,
      trim: true,
      uppercase: true,
      minlength: 1,
      maxlength: 20,
    },

    firstLastName: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      minlength: 1,
      maxlength: 20,
    },

    secondLastName: {
      type: String,
      trim: true,
      uppercase: true,
      minlength: 1,
      maxlength: 20,
    },

    idType: {
      type: String,
      enum: ["CEDULA", "PASAPORTE", "LICENCIA", "OTRO"],
      required: true,
    },

    idNumber: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Email inválido"],
    },

    country: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    stateProvince: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    gender: {
      type: String,
      enum: ["MASCULINO", "FEMENINO", "OTRO", "NO ESPECIFICADO"],
      required: true,
    },

    birthDate: {
      type: Date,
      required: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    educationLevel: {
      type: String,
      enum: [
        "PRIMARIA INCOMPLETA",
        "SECUNDARIA INCOMPLETA",
        "SUPERIOR INCOMPLETA",
        "PRIMARIA COMPLETA",
        "SECUNDARIA COMPLETA",
        "SUPERIOR COMPLETA",
        "NINGUNA",
      ],
      required: true,
    },

    occupation: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

patientSchema.index({ idType: 1, idNumber: 1 }, { unique: true });

export const Patient = mongoose.model("Patient", patientSchema);
