/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const isValidPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Validate phone number
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^(?:\+62|0)[0-9]{9,12}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ''));
};

/**
 * Validate URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate numeric value
 */
export const isValidNumber = (value: unknown): boolean => {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
};

/**
 * Validate required field
 */
export const isRequired = (value: unknown): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined && value !== '';
};

/**
 * Validate min length
 */
export const minLength = (value: string, length: number): boolean => {
  return value.length >= length;
};

/**
 * Validate max length
 */
export const maxLength = (value: string, length: number): boolean => {
  return value.length <= length;
};