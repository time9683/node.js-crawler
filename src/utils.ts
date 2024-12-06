

/**
 * Checks if a given date string is in the valid format YYYY-MM-DD and represents a valid date.
 *
 * @param dateString - The date string to validate.
 * @returns `true` if the date string is in the valid format and represents a valid date, otherwise `false`.
 *
 * @example
 * ```typescript
 * isValidDateFormat("2023-10-15"); // true
 * isValidDateFormat("invalid-date"); // false
 * ```
 */
export function isValidDateFormat(dateString: string): boolean {
  // Regular expression to match the date format YYYY-MM-DD
  const regex = /^\d{4}-\d{2}-\d{2}$/;

  // Check if the date string matches the regex
  if (!regex.test(dateString)) {
    return false;
  }

  // Parse the date parts to integers
  const parts = dateString.split("-");
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  // Check the ranges of month and day
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return false;
  }

  // Check for valid days in February
  if (month === 2) {
    const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    if (day > (isLeap ? 29 : 28)) {
      return false;
    }
  }

  // Check for valid days in April, June, September, and November
  if ([4, 6, 9, 11].includes(month) && day > 30) {
    return false;
  }

  return true;
}