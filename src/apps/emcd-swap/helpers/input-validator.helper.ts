// Тип результата валидации
type ValidationResult = {
  valid: boolean;
  error?: string;
};

const amountValidator = (
  value: string | null,
  max: number | null,
  min: number | null
): ValidationResult => {
  if (!value || value.trim() === '') {
    return { valid: false, error: 'Это поле обязательное' };
  }

  const num = parseFloat(value);
  // Проверка, что строка после трима полностью соответствует числу
  if (isNaN(num) || value.trim() !== num.toString()) {
    return { valid: false, error: 'Введите корректное число' };
  }

  if (min !== null && num < min) {
    return { valid: false, error: `Минимум: ${min}` };
  }

  if (max !== null && num > max) {
    return { valid: false, error: `Максимум: ${max}` };
  }

  return { valid: true };
};

// Старые функции для обратной совместимости
const amountFromValidator = amountValidator;
const amountToValidator = amountValidator;

export {
  amountValidator,
  amountFromValidator,
  amountToValidator,
};
