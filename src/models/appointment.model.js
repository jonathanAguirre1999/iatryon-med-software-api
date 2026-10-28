import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Patient',
      required: true,
    },

    doctorId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },

    type: {
      type: String,
      enum: ['PRIMERA_VEZ', 'SEGUIMIENTO'],
      default: 'PRIMERA VEZ',
    },

    startAt: {
      type: Date,
      required: true,
    },

    endAt: {
      type: Date,
      required: true,
    },

    duration: {
      type: Number,
      enum: [40, 20],
      default: 40,
    },

    status: {
      type: String,
      enum: ['RESERVADA', 'PAGADA', 'ASISTE', 'NO_ASISTE', 'CANCELADA'],
      default: 'RESERVADA',
    },

    reason: {
      type: String,
      maxlength: 500,
      trim: true,
    },

    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

appointmentSchema.index({ doctorId: 1, startAt: 1 });
appointmentSchema.index({ patientId: 1, startAt: 1 });

export const Appointment = mongoose.model('Appointment', appointmentSchema);
