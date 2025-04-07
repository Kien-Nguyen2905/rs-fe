/**
 * Format a date string to a localized date format
 * @param {string} dateString - The date string to format
 * @returns {string} - The formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch {
    return dateString;
  }
};

/**
 * Format a number as currency (VND)
 * @param {number|string} value - The value to format
 * @returns {string} - The formatted currency string
 */
export const formatCurrency = (value) => {
  if (value === null || value === undefined || value === '') return 'N/A';

  try {
    const number = typeof value === 'string' ? parseFloat(value) : value;
    return number.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    });
  } catch {
    return value;
  }
};
