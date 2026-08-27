import { isValidEmail } from './email-validator.helper';

describe('isValidEmail', () => {
  test('возвращает false для null, undefined и пустой строки', () => {
    expect(isValidEmail(null)).toBe(false);
    expect(isValidEmail(undefined)).toBe(false);
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('   ')).toBe(false);
  });

  test('валидные email адреса возвращают true', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user.name@example.co.uk')).toBe(true);
    expect(isValidEmail('user+tag@example.com')).toBe(true);
    expect(isValidEmail('user-name@example.org')).toBe(true);
    expect(isValidEmail('user_name@example.io')).toBe(true);
  });

  test('невалидные форматы возвращают false', () => {
    expect(isValidEmail('plaintext')).toBe(false);
    expect(isValidEmail('user@')).toBe(false);
    expect(isValidEmail('@example.com')).toBe(false);
    expect(isValidEmail('user@domain')).toBe(false);
  });

  test('email с пробелами считаются невалидными', () => {
    expect(isValidEmail('user @example.com')).toBe(false);
    expect(isValidEmail('user@ example.com')).toBe(false);
    expect(isValidEmail('user@example. com')).toBe(false);
  });
});