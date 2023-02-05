const auth_utils = require("../utils/auth_utils")
const User = require("../models/User")
const Post = require("../models/Secret")

// Validates blocked, self operations, private, null user case
const validateRequestPost_CurrentUserPost = auth_utils.validate_current_user_post_action(Post)

module.exports = validateRequestPost_CurrentUserPost