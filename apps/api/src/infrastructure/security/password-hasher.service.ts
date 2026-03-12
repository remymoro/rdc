import { Injectable } from '@nestjs/common';
import { pbkdf2Sync, randomBytes, timingSafeEqual } from 'node:crypto';

@Injectable()
export class PasswordHasherService {
  private readonly iterations = 150000;
  private readonly keyLength = 32;
  private readonly digest = 'sha256';

  hash(value: string): string {
    const salt = randomBytes(16).toString('base64url');
    const hash = pbkdf2Sync(value, salt, this.iterations, this.keyLength, this.digest).toString('base64url');
    return `pbkdf2$${this.iterations}$${salt}$${hash}`;
  }

  verify(value: string, encoded: string): boolean {
    const [algo, iterationsRaw, salt, expectedHash] = encoded.split('$');
    if (algo !== 'pbkdf2' || !iterationsRaw || !salt || !expectedHash) {
      return false;
    }

    const iterations = Number(iterationsRaw);
    if (!Number.isFinite(iterations) || iterations < 10000) {
      return false;
    }

    const computed = pbkdf2Sync(value, salt, iterations, this.keyLength, this.digest).toString('base64url');

    try {
      return timingSafeEqual(Buffer.from(computed), Buffer.from(expectedHash));
    } catch {
      return false;
    }
  }
}
