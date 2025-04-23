import mongoose from 'mongoose';
import { EncryptionService } from '@/lib/encryption';

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    set: (content: string) => EncryptionService.encryptField(content),
    get: (encryptedContent: string) => {
      try {
        return EncryptionService.decryptField(encryptedContent);
      } catch (error) {
        return encryptedContent;
      }
    }
  },
  role: {
    type: String,
    enum: ['user', 'system', 'assistant'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const chatSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
    set: (title: string) => EncryptionService.encryptField(title),
    get: (encryptedTitle: string) => {
      try {
        return EncryptionService.decryptField(encryptedTitle);
      } catch (error) {
        return encryptedTitle;
      }
    }
  },
  messages: [messageSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Enable getters and setters
chatSchema.set('toJSON', { getters: true });
chatSchema.set('toObject', { getters: true });
messageSchema.set('toJSON', { getters: true });
messageSchema.set('toObject', { getters: true });

export const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema);