import { expect } from '@jest/globals';
import { DomainException } from './exceptions/domain.exception';

export function expectDomainCode(fn: () => void, code: string): void {
  let caught: unknown;
  try { fn(); } catch (e) { caught = e; }
  expect(caught).toBeInstanceOf(DomainException);
  expect((caught as DomainException).code).toBe(code);
}
