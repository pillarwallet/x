const amountFromValidator = (
  value: string | null,
  max: number | null,
  min: number | null
) => {
  if (!value || value.trim() === '') {
    return { valid: false, error: 'Это поле обязательное' }
  }

  const num = parseFloat(value)
  if (isNaN(num)) {
    return { valid: false, error: 'Введите корректное число' }
  }

  if (min !== null && num < min) {
    return { valid: false, error: `Минимум: ${min}` }
  }

  if (max !== null && num > max) {
    return { valid: false, error: `Максимум: ${max}` }
  }

  return { valid: true }
}

const amountToValidator = (
  value: string | null,
  max: number | null,
  min: number | null
) => {
  if (!value || value.trim() === '') {
    return { valid: false, error: 'Это поле обязательное' }
  }

  const num = parseFloat(value)
  if (isNaN(num)) {
    return { valid: false, error: 'Введите корректное число' }
  }

  if (min !== null && num < min) {
    return { valid: false, error: `Минимум: ${min}` }
  }

  if (max !== null && num > max) {
    return { valid: false, error: `Максимум: ${max}` }
  }

  return { valid: true }
}

export {
  amountToValidator,
  amountFromValidator,
}