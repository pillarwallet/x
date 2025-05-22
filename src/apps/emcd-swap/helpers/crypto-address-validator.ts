export function isValidCryptoAddress(address: string): boolean {
  if (!address) return false;
  const trimmed = address.trim();

  // Общие правила — длина от 26 до 64, допустимые символы (буквы/цифры)
  if (trimmed.length < 26 || trimmed.length > 64) return false;

  // Проверяем, что строка состоит только из латинских букв и цифр
  if (!/^[A-Za-z0-9]+$/.test(trimmed)) return false;

  return true;
}