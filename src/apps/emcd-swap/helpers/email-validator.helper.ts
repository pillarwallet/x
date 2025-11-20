const isValidEmail = (email: string | null | undefined): boolean => {
  if (!email) return false;

  // Trim the email before validation
  const trimmedEmail = email.trim();
  if (trimmedEmail.length === 0) return false;

  // RFC 5322 compliant email regex (упрощённый)
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(trimmedEmail);
}

export {
  isValidEmail
}