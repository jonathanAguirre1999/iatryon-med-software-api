import mongoose from "mongoose";

const timeBlockSchema = new mongoose.Schema(
  {
    start: {
      type: String,
      required: true,
    },
    end: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const doctorScheduleSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  dayOfWeek: {
    type: Number,
    required: true,
    min: 0,
    max: 6,
  },

  blocks: {
    type: [timeBlockSchema],
    required: true,
  },

  isActive: {
    type: Boolean,
    default: true,
  },
});

doctorScheduleSchema.index(
  {
    doctorId: 1,
    dayOfWeek: 1,
  },
  {
    unique: true,
  },
);

export const DoctorSchedule = mongoose.model(
  "DoctorSchedule",
  doctorScheduleSchema,
);
