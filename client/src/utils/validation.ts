export const NAME_MIN = 20;
export const NAME_MAX = 60;
export const ADDRESS_MAX = 400;
export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;

export type ValidationError = {
  field: string;
  message: string;
};

export const validateName = (name: string): string | null => {
  const trimmed = name.trim();
  if (trimmed.length < NAME_MIN || trimmed.length > NAME_MAX) {
    return `Name must be between ${NAME_MIN} and ${NAME_MAX} characters.`;
  }
  return null;
};

export const validateEmail = (email: string): string | null => {
  const trimmed = email.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return "Please provide a valid email.";
  }
  return null;
};

export const validateAddress = (address: string): string | null => {
  if (address.trim().length > ADDRESS_MAX) {
    return `Address cannot exceed ${ADDRESS_MAX} characters.`;
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!PASSWORD_REGEX.test(password)) {
    return "Password must be 8-16 characters with at least one uppercase letter and one special character.";
  }
  return null;
};

export type ServerValidationError = {
  path?: string;
  msg?: string;
  message?: string;
};

export const formatServerErrors = (
  errors: ServerValidationError[]
): string => {
  return errors
    .map((err) => err.msg || err.message || "Validation failed")
    .join(" ");
};

export const getFieldErrors = (
  errors: ServerValidationError[]
): Record<string, string> => {
  const fieldErrors: Record<string, string> = {};
  for (const err of errors) {
    if (err.path) {
      fieldErrors[err.path] = err.msg || err.message || "Invalid value";
    }
  }
  return fieldErrors;
};
