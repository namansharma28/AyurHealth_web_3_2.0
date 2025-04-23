import mongoose from 'mongoose';
import { EncryptionService } from '@/lib/encryption';

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    set: (name: string) => EncryptionService.encryptField(name),
    get: (encryptedName: string) => {
      try {
        return EncryptionService.decryptField(encryptedName);
      } catch (error) {
        return encryptedName;
      }
    }
  },
  ingredients: {
    type: [String],
    set: (ingredients: string[]) => ingredients.map(ingredient => EncryptionService.encryptField(ingredient)),
    get: (encryptedIngredients: string[]) => {
      try {
        return encryptedIngredients.map(ingredient => EncryptionService.decryptField(ingredient));
      } catch (error) {
        return encryptedIngredients;
      }
    }
  },
  instructions: {
    type: [String],
    set: (instructions: string[]) => instructions.map(instruction => EncryptionService.encryptField(instruction)),
    get: (encryptedInstructions: string[]) => {
      try {
        return encryptedInstructions.map(instruction => EncryptionService.decryptField(instruction));
      } catch (error) {
        return encryptedInstructions;
      }
    }
  },
});

const mealSchema = new mongoose.Schema({
  time: {
    type: String,
    set: (time: string) => EncryptionService.encryptField(time),
    get: (encryptedTime: string) => {
      try {
        return EncryptionService.decryptField(encryptedTime);
      } catch (error) {
        return encryptedTime;
      }
    }
  },
  items: {
    type: [String],
    set: (items: string[]) => items.map(item => EncryptionService.encryptField(item)),
    get: (encryptedItems: string[]) => {
      try {
        return encryptedItems.map(item => EncryptionService.decryptField(item));
      } catch (error) {
        return encryptedItems;
      }
    }
  },
  herbs: {
    type: [String],
    set: (herbs: string[]) => herbs.map(herb => EncryptionService.encryptField(herb)),
    get: (encryptedHerbs: string[]) => {
      try {
        return encryptedHerbs.map(herb => EncryptionService.decryptField(herb));
      } catch (error) {
        return encryptedHerbs;
      }
    }
  },
  recipe: recipeSchema,
});

const dailyPlanSchema = new mongoose.Schema({
  day: {
    type: String,
    set: (day: string) => EncryptionService.encryptField(day),
    get: (encryptedDay: string) => {
      try {
        return EncryptionService.decryptField(encryptedDay);
      } catch (error) {
        return encryptedDay;
      }
    }
  },
  meals: [mealSchema],
  remedies: {
    type: [String],
    set: (remedies: string[]) => remedies.map(remedy => EncryptionService.encryptField(remedy)),
    get: (encryptedRemedies: string[]) => {
      try {
        return encryptedRemedies.map(remedy => EncryptionService.decryptField(remedy));
      } catch (error) {
        return encryptedRemedies;
      }
    }
  },
});

const dietPlanSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  weekStartDate: {
    type: Date,
    required: true,
  },
  dailyPlans: [dailyPlanSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Enable getters and setters
dietPlanSchema.set('toJSON', { getters: true });
dietPlanSchema.set('toObject', { getters: true });
dailyPlanSchema.set('toJSON', { getters: true });
dailyPlanSchema.set('toObject', { getters: true });
mealSchema.set('toJSON', { getters: true });
mealSchema.set('toObject', { getters: true });
recipeSchema.set('toJSON', { getters: true });
recipeSchema.set('toObject', { getters: true });

export const DietPlan = mongoose.models.DietPlan || mongoose.model('DietPlan', dietPlanSchema);