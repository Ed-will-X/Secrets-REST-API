const express = require("express")
const multer = require("multer")


const secretsController = require("../controllers/secrets_controller")
const validatePostUpload = require("../middlewares/validatePostUpload")
const validateRequest_post = require("../middlewares/validateRequestPost")
const validateRequest_currentUser_post = require("../middlewares/validateRequest_CurrentUserPost")
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
router.post("/profile/secrets/:secret/upload-entry-image", auth, validateRequest_currentUser_post, imageUpload.single("image"), secretsController.uploadEntryImage, (error, req, res, next)=> {
    return res.status(400).send({ error: error.message })
})
router.post("/secrets/:id/like", auth, validateRequest_post, secretsController.likeSecret)
router.post("/secrets/:id/unlike", auth, validateRequest_post, secretsController.unlikeSecret)
router.delete("/profile/secrets/:id/delete", auth, validateRequest_currentUser_post, secretsController.deleteEntry)
router.patch("/profile/secrets/:secret", auth, validateRequest_currentUser_post, secretsController.editSecret)

router.post("/profile/saved/:id", auth, validateRequest_post, secretsController.savePost)
router.delete("/profile/saved/:id", auth, validateRequest_post, secretsController.unsavePost)
router.post("/secrets/:id/comment", auth, validateRequest_post, secretsController.addComment)
router.delete("/secrets/:id/:comment", auth, validateRequest_post, secretsController.removeComment)
router.post("/secrets/:id/:comment/like", auth, validateRequest_post, secretsController.likeComment)
router.post("/secrets/:id/:comment/unlike", auth, validateRequest_post, secretsController.unlikeComment)
router.patch("/secrets/:id/:comment", auth, validateRequest_post, secretsController.editComment)


module.exports = router