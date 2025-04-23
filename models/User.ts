import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  subscriptionStatus: {
    type: String,
    enum: ['unpaid', 'paid'],
    default: 'unpaid'
  },
  bodyNature: {
    type: String,
    enum: ['vata', 'pitta', 'kapha', 'vata-pitta', 'pitta-kapha', 'vata-kapha'],
  },
  profile: {
    weight: Number,
    height: Number,
    age: Number,
    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    },
    foodPreference: {
      type: String,
      enum: ['vegan', 'vegetarian', 'non-vegetarian']
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);