// Every validator returns an error message (string).
// An EMPTY string means "the value is valid".

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MOBILE_REGEX = /^[6-9]\d{9}$/; // Indian mobile: 10 digits starting with 6-9
const PINCODE_REGEX = /^[1-9]\d{5}$/; // Indian PIN code: 6 digits
const UPI_REGEX = /^[\w.-]{2,}@[a-zA-Z]{2,}$/;

export const validateRequired = (value: string, label: string): string =>
  value.trim() === '' ? `${label} is required` : '';

export const validateEmail = (value: string): string => {
  if (value.trim() === '') return 'Email is required';
  return EMAIL_REGEX.test(value.trim()) ? '' : 'Enter a valid email address';
};

export const validateMobile = (value: string): string => {
  if (value.trim() === '') return 'Mobile number is required';
  return MOBILE_REGEX.test(value.trim()) ? '' : 'Enter a valid 10 digit mobile number';
};

// Login field accepts either an email or a mobile number.
export const validateEmailOrMobile = (value: string): string => {
  if (value.trim() === '') return 'Email or mobile number is required';
  const text = value.trim();
  const looksLikeNumber = /^\d+$/.test(text);
  if (looksLikeNumber) return validateMobile(text);
  return validateEmail(text);
};

export const validatePassword = (value: string): string => {
  if (value === '') return 'Password is required';
  if (value.length < 6) return 'Password must be at least 6 characters';
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) {
    return 'Password must contain a letter and a number';
  }
  return '';
};

export const validateConfirmPassword = (password: string, confirm: string): string => {
  if (confirm === '') return 'Please confirm your password';
  return password === confirm ? '' : 'Passwords do not match';
};

export const validatePincode = (value: string): string => {
  if (value.trim() === '') return 'PIN code is required';
  return PINCODE_REGEX.test(value.trim()) ? '' : 'Enter a valid 6 digit PIN code';
};

export const validateUpi = (value: string): string => {
  if (value.trim() === '') return 'UPI ID is required';
  return UPI_REGEX.test(value.trim()) ? '' : 'Enter a valid UPI ID (example: name@upi)';
};

export const validateCardNumber = (value: string): string => {
  const digits = value.replace(/\s/g, '');
  if (digits === '') return 'Card number is required';
  return /^\d{16}$/.test(digits) ? '' : 'Card number must be 16 digits';
};

export const validateExpiry = (value: string): string => {
  if (value.trim() === '') return 'Expiry date is required';
  const match = /^(\d{2})\/(\d{2})$/.exec(value.trim());
  if (!match) return 'Use MM/YY format';
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return 'Month must be between 01 and 12';
  const now = new Date();
  const expiresAtEndOfMonth = new Date(year, month, 0, 23, 59, 59);
  return expiresAtEndOfMonth < now ? 'This card has expired' : '';
};

export const validateCvv = (value: string): string => {
  if (value === '') return 'CVV is required';
  return /^\d{3}$/.test(value) ? '' : 'CVV must be 3 digits';
};
