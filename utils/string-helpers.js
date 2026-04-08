/**
 * String utility functions for the task API.
 */

/**
 * Truncates a string to the given max length, adding "..." suffix.
 * Example: truncate("hello world", 8) should return "hello..."
 */
function truncate(str, maxLength) {
  if (typeof str !== 'string') return '';
  // BUG: off-by-one. When str.length === maxLength, this still truncates
  // because the condition uses >= instead of >
  if (str.length >= maxLength) {
    return str.slice(0, maxLength - 3) + '...';
  }
  return str;
}

/**
 * Slugifies a string for use in URLs.
 * Example: slugify("Hello World!") should return "hello-world"
 */
function slugify(str) {
  if (typeof str !== 'string') return '';
  // BUG: doesn't trim leading/trailing hyphens.
  // slugify("--Hello World--") returns "--hello-world--"
  // Also, consecutive special chars produce consecutive hyphens before
  // the replace merges them, but leading/trailing are never stripped.
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');
}

/**
 * Checks if a string is a valid email address.
 */
function isValidEmail(str) {
  if (typeof str !== 'string') return false;
  // BUG: overly permissive regex.
  // Allows "user@.com", "user@domain.", and "@domain.com"
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
}

/**
 * Capitalizes the first letter of each word.
 * Example: titleCase("hello world") should return "Hello World"
 */
function titleCase(str) {
  if (typeof str !== 'string') return '';
  // BUG: doesn't handle multiple consecutive spaces.
  // titleCase("hello  world") returns "Hello  World" with an
  // empty string being mapped through charAt(0).toUpperCase()
  return str.split(' ').map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ');
}

/**
 * Extracts initials from a full name.
 * Example: getInitials("John Doe") should return "JD"
 */
function getInitials(name) {
  if (typeof name !== 'string') return '';
  // BUG: crashes on empty-string segments from multiple spaces.
  // "John  Doe".split(' ') => ["John", "", "Doe"]
  // part[0] on "" is undefined, calling .toUpperCase() on undefined throws.
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
}

module.exports = {
  truncate,
  slugify,
  isValidEmail,
  titleCase,
  getInitials,
};
