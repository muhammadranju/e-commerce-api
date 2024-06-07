// Import necessary modules and utilities
const defineAbilitiesFor = require("../utils/abilities");
const ApiError = require("../utils/ApiError");

/**
 * Middleware to set abilities for the current user or seller.
 *
 * Defines the abilities (permissions) for the user or seller based on their role and stores it in the request object.
 */
function setAbilities(req, res, next) {
  // Define abilities for the current user or seller and store them in the request object
  req.ability = defineAbilitiesFor(req.seller || req.user);
  next();
}

/**
 * Middleware to check if the user or seller can perform a specific action on a subject.
 *
 * Validates if the user or seller has permission to perform the specified action on the given subject.
 * If not, throws an ApiError with a 403 status.
 *
 * @param {string} action - The action to be performed (e.g., 'read', 'update').
 * @param {string} subject - The subject on which the action is to be performed (e.g., 'Product', 'Order').
 * @returns {Function} Middleware function to validate permissions.
 */
function canPerform(action, subject) {
  return (req, res, next) => {
    // Check if the current abilities allow the specified action on the subject
    if (req.ability.can(action, subject)) {
      return next();
    }
    // If the user does not have permission, throw a 403 error
    throw new ApiError(
      403,
      "You don't have permission to access. Forbidden to perform this action."
    );
  };
}

// Export the middleware functions to be used in other parts of the application
module.exports = {
  setAbilities,
  canPerform,
};
