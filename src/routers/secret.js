const express = require("express")
const multer = require("multer")


const secretsController = require("../controllers/secrets_controller")
const validatePostUpload = require("../middlewares/validatePostUpload")
const auth = require("../middlewares/auth")

const router = express.Router()

const imageUpload = multer({
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error("Please, upload a valid file"))
        }

        cb(undefined, true)
    },
    limits: {
        fileSize: 5000000
    }
})

router.post("/profile/secrets/upload", auth, validatePostUpload, secretsController.uploadSecret)
router.post("/profile/secrets/:secret/upload-entry-image", auth, imageUpload.single("image"), secretsController.uploadEntryImage, (error, req, res, next)=> {
    return res.status(400).send({ error: error.message })
})


module.exports = router