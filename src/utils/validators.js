export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validatePhone = (phone) => {
  const re = /^[0-9]{10}$/;
  return re.test(String(phone));
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateRequired = (value, fieldName) => {
  if (value === undefined || value === null || String(value).trim() === '') {
    return `${fieldName || 'This field'} is required`;
  }
  return null;
};
