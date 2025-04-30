/**
 * Converts any case string (e.g., user-management, user_management, userManagement)
 * into a capitalized, human-readable format.
 * @param str - The input string in any case format.
 * @returns A string in Title Case (e.g., 'User Management').
 */
export const formatToTitleCase = (str: string): string => {
  return (
    str
      // Replace hyphens and underscores with spaces
      .replace(/[-_]/g, ' ')
      // Insert spaces before capital letters (for camelCase)
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      // Convert to an array of words, capitalize the first letter of each word
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      // Join the words back into a single string
      .join(' ')
  );
};
