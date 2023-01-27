const auth_utils = require("../utils/auth_utils")
const User = require("../models/User")

// Validates blocked, self operations, private, null user case
const validateRequest = auth_utils.validate_action_between_users(User)

module.exports = validateRequest