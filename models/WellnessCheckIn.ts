import mongoose from 'mongoose';

const wellnessCheckInSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  date: {
    type: Date,
    required: true,
  },
  responses: {
    type: Map,
    of: String,
    required: true,
  },
});

// Compound index for userId and date to ensure one check-in per day per user
wellnessCheckInSchema.index({ userId: 1, date: 1 }, { unique: true });

export const WellnessCheckIn = mongoose.models.WellnessCheckIn || mongoose.model('WellnessCheckIn', wellnessCheckInSchema);