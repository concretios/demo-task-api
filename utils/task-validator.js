/**
 * Task validation utilities.
 * Used by routes/tasks.js to validate incoming task data.
 */

const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 2000;

// Valid priority levels accepted by the validator
const VALID_PRIORITIES = ['low', 'medium', 'high', 'critical'];

/**
 * Validates a task object for creation.
 *
 * Returns { valid: true } or { valid: false, errors: [...] }
 *
 * Accepts: title (required, max 200 chars), description (optional, max 2000 chars),
 * priority (optional, one of low/medium/high/critical), dueDate (optional, ISO string)
 */
function validateTask(data) {
  const errors = [];

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Request body must be a JSON object'] };
  }

  // Title validation
  if (!data.title || typeof data.title !== 'string') {
    errors.push('title is required and must be a string');
  } else if (data.title.trim().length === 0) {
    errors.push('title cannot be empty or whitespace-only');
  } else if (data.title.length > MAX_TITLE_LENGTH) {
    errors.push(`title must be ${MAX_TITLE_LENGTH} characters or fewer`);
  }

  // Description validation (optional)
  if (data.description !== undefined) {
    if (typeof data.description !== 'string') {
      errors.push('description must be a string');
    } else if (data.description.length > MAX_DESCRIPTION_LENGTH) {
      errors.push(`description must be ${MAX_DESCRIPTION_LENGTH} characters or fewer`);
    }
  }

  // Priority validation (optional, accepted by validator but ignored by route handler)
  if (data.priority !== undefined) {
    if (!VALID_PRIORITIES.includes(data.priority)) {
      errors.push(`priority must be one of: ${VALID_PRIORITIES.join(', ')}`);
    }
  }

  // Due date validation (optional, accepted by validator but ignored by route handler)
  if (data.dueDate !== undefined) {
    if (typeof data.dueDate !== 'string') {
      errors.push('dueDate must be an ISO 8601 date string');
    } else {
      const parsed = new Date(data.dueDate);
      if (isNaN(parsed.getTime())) {
        errors.push('dueDate must be a valid ISO 8601 date string');
      }
    }
  }

  return errors.length > 0 ? { valid: false, errors } : { valid: true };
}

module.exports = {
  validateTask,
  MAX_TITLE_LENGTH,
  MAX_DESCRIPTION_LENGTH,
  VALID_PRIORITIES,
};
