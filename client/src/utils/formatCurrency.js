/**
 * Format currency in INR ₹
 * @param {number} amount
 * @returns {string} e.g. "₹280"
 */
export const formatCurrency = (amount) => {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
};

export default formatCurrency;
