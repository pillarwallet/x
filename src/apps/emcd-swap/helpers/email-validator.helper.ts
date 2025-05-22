const isValidEmail = (email: string | null | undefined): boolean => {
  if (!email) return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export {
  isValidEmail,
}