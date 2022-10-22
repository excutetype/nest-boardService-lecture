import { randomBytes, pbkdf2 } from 'node:crypto';

export class CryptoUtil {
  static generateSalt(size: number): string {
    return randomBytes(size).toString('hex');
  }

  static pbkdf2(planeText: string, salt: string): Promise<any> {
    return new Promise((resolve, reject) => {
      pbkdf2(planeText, salt, 7028, 64, 'sha512', (err, key) => {
        if (err) {
          reject(err);
        }
        resolve(key.toString('hex'));
      });
    });
  }

  static async compare(planeText: string, salt: string, digest: string) {
    const encryptedPlaneText = await this.pbkdf2(planeText, salt);
    if (encryptedPlaneText === digest) {
      return true;
    }
    return false;
  }
}
