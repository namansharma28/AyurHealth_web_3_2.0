import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  recommendations: {
    mental: [{
      title: String,
      description: String,
      benefits: [String],
      instructions: [String],
      contraindications: [String],
    }],
    physical: [{
      title: String,
      description: String,
      benefits: [String],
      instructions: [String],
      contraindications: [String],
    }],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const WellnessRecommendation = mongoose.models.WellnessRecommendation || mongoose.model('WellnessRecommendation', recommendationSchema);