const auth_utils = require("../utils/auth_utils")
const User = require("../models/User")
const Post = require("../models/Secret")

// Validates blocked, self operations, private, null user case
const validateRequestPost = auth_utils.validate_action_between_users_post(User, Post)

module.exports = validateRequestPost