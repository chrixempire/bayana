export type ResetPasswordFieldErrors = {
  password?: string
  passwordConfirmation?: string
}

export function validateResetPassword(password: string, passwordConfirmation: string): ResetPasswordFieldErrors {
  const errors: ResetPasswordFieldErrors = {}

  if (!password) {
    errors.password = "Password is required"
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters"
  }

  if (!passwordConfirmation) {
    errors.passwordConfirmation = "Please confirm your password"
  } else if (password !== passwordConfirmation) {
    errors.passwordConfirmation = "Passwords do not match"
  }

  return errors
}

export function mapResetPasswordApiErrors(fieldErrors: Record<string, string[]>): ResetPasswordFieldErrors {
  const mapped: ResetPasswordFieldErrors = {}

  if (fieldErrors.password?.[0]) mapped.password = fieldErrors.password[0]
  if (fieldErrors.password_confirmation?.[0]) mapped.passwordConfirmation = fieldErrors.password_confirmation[0]

  return mapped
}
