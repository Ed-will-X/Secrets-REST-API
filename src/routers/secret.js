const express = require("express")

const secretsController = require("../controllers/secrets_controller")
const validatePostUpload = require("../middlewares/validatePostUpload")
const auth = require("../middlewares/auth")

const router = express.Router()

router.post("/profile/secrets/upload", auth, validatePostUpload, secretsController.uploadSecret)


module.exports = router