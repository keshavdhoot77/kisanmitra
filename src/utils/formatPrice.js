export const formatPrice = (amount) => {
  if (amount == null) return '';
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const formatPriceRange = (min, max) => {
  if (min == null || max == null) return '';
  return `₹${min.toLocaleString('en-IN')} - ₹${max.toLocaleString('en-IN')}`;
};

export const formatPricePerUnit = (amount, unit) => {
  if (amount == null) return '';
  const formattedUnit = unit ? `/${unit.toUpperCase()}` : '';
  return `₹${amount.toLocaleString('en-IN')}${formattedUnit}`;
};
