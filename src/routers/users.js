const express = require("express")

const users_controller = require("../controllers/users_controller")
const auth_controller = require("../controllers/auth_controller")
const user_constroller = require("../controllers/user_controller")
const auth = require("../middlewares/auth")
const validateBlocked = require("../middlewares/validateBlocked")

const router = express.Router()


router.post("/users/:username/follow", auth, validateBlocked, users_controller.follow)
router.post("/users/:username/unfollow", auth, validateBlocked, users_controller.unfollow)
router.post("/users/:username/block", auth, validateBlocked, users_controller.block)
router.post("/users/:username/unblock", auth, validateBlocked, users_controller.unblock)
router.post("/users/:username/revoke-follow-request", auth, validateBlocked, users_controller.revokeFollowRequest)
router.post("/profile/requests/:username/accept", auth, validateBlocked, users_controller.acceptFollowRequest)
router.post("/profile/requests/:username/reject", auth, validateBlocked, users_controller.rejectFollowRequest)
router.post("/profile/followers/:username/remove", auth, validateBlocked, users_controller.removeFollower)
router.get("/users/:username", auth, validateBlocked, users_controller.getProfile)
router.get("/users/:username/profile-image", auth, validateBlocked, users_controller.getOtherUserProfileImage)
router.get("/users/search/:term", auth, users_controller.queryUsers)
module.exports = router