import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      minlength: 4,
      maxlength: 30,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      minlength: 2,
      maxlength: 100,
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
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Email inválido"],
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["ADMIN", "DOCTOR", "RECEPTIONIST"],
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isAccountBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.index({ idType: 1, idNumber: 1 }, { unique: true });

export const User = mongoose.model("User", userSchema);
