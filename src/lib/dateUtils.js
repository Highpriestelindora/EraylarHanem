/**
 * Production-level Date & Time Utilities
 * Enforces UTC-based comparisons and ISO strings
 */

/**
 * Returns current time in ISO format (UTC)
 * @returns {string} e.g. "2026-04-27T14:16:04.000Z"
 */
export const getNowUTC = () => new Date().toISOString();

/**
 * Converts any date-like input to a plain YYYY-MM-DD string for comparison
 * @param {Date|string} date 
 * @returns {string}
 */
export const toISODate = (date) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

/**
 * Calculates trip status based on current UTC time
 * @param {string} startDate - YYYY-MM-DD
 * @param {string} endDate - YYYY-MM-DD
 * @returns {'planned' | 'active' | 'completed'}
 */
export const calculateTripStatus = (startDate, endDate) => {
  const nowStr = getNowUTC().split('T')[0]; // Current date UTC
  
  if (nowStr < startDate) return 'planned';
  if (nowStr >= startDate && nowStr <= endDate) return 'active';
  return 'completed';
};

/**
 * Normalizes a date to UTC at midnight for safe comparison
 * @param {string|Date} date 
 * @returns {number} timestamp
 */
export const getUTCTimestamp = (date) => {
  const d = new Date(date);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
};
