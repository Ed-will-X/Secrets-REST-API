const express = require("express")
const multer = require("multer")

const auth_controller = require("../controllers/auth_controller")
const user_controller = require("../controllers/user_controller")
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

router.get("/", (req, res)=> {
    // var datetime = new Date();
    // const today = `${datetime.getFullYear()}-${datetime.getMonth() + 1}-${datetime.getDate()}`
    console.log(Date.now());

    res.status(200).send("Success")
})

router.post("/signup", auth_controller.signUp)
router.post("/signin", auth_controller.signIn)
router.get("/profile", auth, user_controller.getProfile)
router.patch("/profile", auth, user_controller.editProfile)
router.post("/signout", auth, auth_controller.signOut)
router.post("/signout-all", auth, auth_controller.signoutAll)
router.patch("/profile/profile-image", auth, imageUpload.single("image"), user_controller.uploadProfileImage, (error, req, res, next)=> {
    return res.status(400).send({ error: error.message })
})
router.delete("/profile/profile-image", auth, user_controller.deleteProfileImage)
router.get("/profile/profile-image", auth, user_controller.getCurrentUserProfileImage)
router.delete("/profile", auth, user_controller.deleteUser)

router.get('/test', (req, res)=> {
    res.send({ name: "test" })
})

module.exports = router