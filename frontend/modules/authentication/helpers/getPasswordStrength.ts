export default (password: string) => {
  let strength = 0;
  const attributes = {
    hasMinLength: password.length >= 8,
    hasLowercase: /[a-z]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSymbol: /[^a-zA-Z0-9]/.test(password)
  };

  if (attributes.hasMinLength) strength++;
  if (attributes.hasLowercase) strength++;
  if (attributes.hasUppercase) strength++;
  if (attributes.hasNumber) strength++;
  if (attributes.hasSymbol) strength++;

  return {
    strength,
    attributes
  };
}