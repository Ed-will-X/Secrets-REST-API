const User = require("../models/User")
const auth_utils = require("../utils/auth_utils")

const auth = auth_utils.verifyToken(User)

module.exports = auth