import CryptoJS from 'crypto-js';
import { auth } from '@clerk/nextjs';

export class EncryptionService {
  private static getKey(): string {
    const { sessionId } = auth();
    if (!sessionId) {
      throw new Error('No session found');
    }
    return sessionId;
  }

  static encrypt(data: any): string {
    const key = this.getKey();
    const jsonStr = JSON.stringify(data);
    return CryptoJS.AES.encrypt(jsonStr, key).toString();
  }

  static decrypt(encryptedData: string): any {
    const key = this.getKey();
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    const decryptedStr = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedStr);
  }

  static encryptField(field: string): string {
    const key = this.getKey();
    return CryptoJS.AES.encrypt(field, key).toString();
  }

  static decryptField(encryptedField: string): string {
    const key = this.getKey();
    const bytes = CryptoJS.AES.decrypt(encryptedField, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}