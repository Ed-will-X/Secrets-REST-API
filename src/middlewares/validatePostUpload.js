const secret_utils = require("../utils/secret_utils")
const Secret = require("../models/Secret")

const validatePostUpload = secret_utils.validate_post_upload(Secret)

module.exports = validatePostUpload