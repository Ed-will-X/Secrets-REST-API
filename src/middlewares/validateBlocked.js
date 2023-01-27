const auth_utils = require("../utils/auth_utils")
const User = require("../models/User")

// This middleware checks if the current user has been blocked by the other user
const validateBlocked = auth_utils.validate_action_between_users_blocked(User)

module.exports = validateBlocked