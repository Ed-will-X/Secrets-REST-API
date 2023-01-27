const express = require("express")
const auth_controller = require("../controllers/auth_controller")
const user_constroller = require("../controllers/user_controller")
const auth = require("../middlewares/auth")

const router = express.Router()

router.get("/", (req, res)=> {
    res.status(200).send("Success")
})

router.post("/signup", auth_controller.signUp)
router.post("/signin", auth_controller.signIn)
router.get("/profile", auth, user_constroller.getProfile)
router.get('/test', (req, res)=> {
    res.send({ name: "test" })
})

module.exports = router