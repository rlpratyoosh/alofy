import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

@Injectable()
export class EncryptionService {
  private readonly key = Buffer.from(process.env.ENCRYPTION_KEY as string, 'hex');

  async encrypt(data: string): Promise<string> {
    const iv = randomBytes(16);
    const cipher = createCipheriv('aes-256-ctr', this.key, iv);
    const encrypted = Buffer.concat([
      cipher.update(data, 'utf8'),
      cipher.final()
    ]);
    return `${encrypted.toString('hex')}:${iv.toString('hex')}`;
  }

  async decrypt(encryptedString: string): Promise<string> {
    const [encryptedData, ivHex] = encryptedString.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = createDecipheriv('aes-256-ctr', this.key, iv);
    const decryptedText = Buffer.concat([
      decipher.update(encryptedData, 'hex'),
      decipher.final(),
    ]);
    return decryptedText.toString('utf8');
  }
}
