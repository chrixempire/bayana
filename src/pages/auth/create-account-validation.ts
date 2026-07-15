export type CreateAccountFieldErrors = {
  email?: string
  password?: string
  passwordConfirmation?: string
}

export function validateCreateAccount(
  email: string,
  password: string,
  passwordConfirmation: string,
): CreateAccountFieldErrors {
  const errors: CreateAccountFieldErrors = {}
  const trimmedEmail = email.trim()

  if (!trimmedEmail) {
    errors.email = "Email is required"
  } else if (!trimmedEmail.includes("@")) {
    errors.email = "Please enter a valid business email address"
  }

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

export function mapRegistrationApiErrors(fieldErrors: Record<string, string[]>): CreateAccountFieldErrors {
  const mapped: CreateAccountFieldErrors = {}

  if (fieldErrors.email?.[0]) mapped.email = fieldErrors.email[0]
  if (fieldErrors.password?.[0]) mapped.password = fieldErrors.password[0]

  return mapped
}
