import { useState } from 'react'

export function useValidatedInput(
  initialValue: string | null,
) {
  const [value, setValue] = useState<string | null>(initialValue)
  const [valid, setValid] = useState<boolean>(true)
  const [error, setError] = useState<string | undefined>(undefined)

  const changeValid = ({ valid, error }: { valid: boolean, error?: string }) => {
    setValid(valid)
    setError(error)
  }

  return {
    value,
    setValue,
    changeValid,
    valid,
    error,
  }
}