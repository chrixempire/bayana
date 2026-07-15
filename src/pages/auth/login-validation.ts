export type LoginFieldErrors = {
  email?: string
  password?: string
}

export function validateLogin(email: string, password: string): LoginFieldErrors {
  const errors: LoginFieldErrors = {}
  const trimmedEmail = email.trim()

  if (!trimmedEmail) {
    errors.email = "Email is required"
  } else if (!trimmedEmail.includes("@")) {
    errors.email = "Please enter a valid email address"
  }

  if (!password) {
    errors.password = "Password is required"
  }

  return errors
}

export function mapLoginApiErrors(fieldErrors: Record<string, string[]>): LoginFieldErrors {
  const mapped: LoginFieldErrors = {}

  if (fieldErrors.email?.[0]) mapped.email = fieldErrors.email[0]
  if (fieldErrors.password?.[0]) mapped.password = fieldErrors.password[0]

  return mapped
}
