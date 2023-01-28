const mongoose = require("mongoose")

const User = require("../models/User")
const userConstants = require("../constants/user_constants")
const userUtils = require("../utils/user_utils")

module.exports = {
    follow: async(req, res) => {
        // fetch user
        // make sure user is not current user
        // make sure current user is not already following
        // TODO: Check auth and block status
        // push to followers list and following list
        // Save both users
        try {
            const user = await User.findOne({ username: req.params.username })

            if(user.followers.includes(req.user._id.toString())) {
                return res.send("Already following")
            }

            if(user.private) {
                if(user.followers.includes(req.user._id.toString()) === false) {
                    if(user.followRequests.includes(req.user._id.toString())) {
                        return res.send("Follow request already sent")
                    }
                    // DON'T MAKE THE MISTAKE OF CALLING "req.user.save()" IN THIS SCOPE
                    userUtils.addIDsToArray_double(req.user._id, user._id, [], user.followRequests)

                    await user.save()
    
                    return res.send("Follow request sent")
                } else {
                    return res.send("Already following")
                }
            }

            userUtils.addIDsToArray_double(req.user._id, user._id, req.user.following, user.followers)

            await user.save()
            await req.user.save()

            return res.send("Following")
        } catch (error) {
            return res.status(500).send({ error: "Internal server error" })
        }
    },
    unfollow: async(req, res) => {
        try {
            const user = await User.findOne({ username: req.params.username })
            
            if(user.followers.includes(req.user._id.toString()) === false) {
                return res.send("Already not following")
            }

            userUtils.removeIDsFromArray_double(req.user._id, user._id, req.user.following, user.followers)

            await req.user.save()
            await user.save()

            return res.send("Unfollowed")
        } catch(e) {
            console.log(e)
            return res.status(500).send({ error: "Internal server error" })
        }
    },
    block: async(req, res)=> {
        try {
            const user = await User.findOne({ username: req.params.username })

            if(req.user.blocked.includes(user._id.toString())) {
                return res.send("Already blocked")
            }

            userUtils.addIDsToArray_double(req.user._id, user._id, req.user.blocked, user.blockedBy)

            // TODO: Remove from followers, following and follow requests

            await req.user.save()
            await user.save()

            return res.send("Blocked")
        } catch (e) {
            console.log(e)
            return res.status(500).send({ error: "Internal server error" })
        }
    },
    unblock: async(req, res) => {
        try {
            const user = await User.findOne({ username: req.params.username })

            if(req.user.blocked.includes(user._id.toString()) === false) {
                return res.send("Already unblocked")
            }

            userUtils.removeIDsFromArray_double(req.user._id, user._id, req.user.blocked, user.blockedBy)

            await user.save()
            await req.user.save()

            return res.send("Unblocked")
        } catch (error) {
            console.log(error)
            return res.status(500).send({ error: "Internal server error" })
        }
    },
    revokeFollowRequest: async(req, res) => {
        try {
            const user = await User.findOne({ username: req.params.username })

            if(user.followRequests.includes(req.user._id.toString()) === false) {
                return res.send("Follow request does not exist")
            }

            userUtils.removeIDsFromArray_double(req.user._id, user._id, null, user.followRequests)

            await user.save()

            return res.send("follow request revoked")
        } catch (error) {
            console.log(error)
            return res.status(500).send({ error: "Internal server error" })
        }
    },
    acceptFollowRequest: async(req, res) => {
        try {
            const user = await User.findOne({ username: req.params.username })

            if(req.user.followRequests.includes(user._id.toString()) === false) {
                return res.send("Follow request does not exist")
            }

            userUtils.removeIDsFromArray_double(req.user._id, user._id, req.user.followRequests, null)
            userUtils.addIDsToArray_double(req.user._id, user._id, req.user.followers, user.following)

            await req.user.save()
            await user.save()

            return res.send("Accepted follow request, now following")
        } catch (error) {
            console.log(error)
            return res.status(500).send({ error: "Internal server error" })
        }
    },
    rejectFollowRequest: async(req, res) => {
        try {
            const user = await User.findOne({ username: req.params.username })

            if(req.user.followRequests.includes(user._id.toString()) === false) {
                return res.send("Follow request does not exist")
            }

            userUtils.removeIDsFromArray_double(req.user._id, user._id, req.user.followRequests, null)

            await req.user.save()

            return res.send("Follow request Rejected")
        } catch (error) {
            console.log(error)
            return res.status(500).send({ error: "Internal server error" })
        }
    },
    removeFollower: async(req, res)=> {
        try {
            const user = await User.findOne({ username: req.params.username })

            if(req.user.followers.includes(user._id.toString()) === false) {
                return res.send("Already not following")
            }

            userUtils.removeIDsFromArray_double(req.user._id, user._id, req.user.followers, user.following)

            await user.save()
            await req.user.save()

            return res.send("Follower Removed")
            
        } catch (error) {
            console.log(error)
            return res.status(500).send({ error: "Internal server error" })
        }
    },
    getProfile: async(req, res)=> {
        try {
            const user = await User.findOne({ username: req.params.username })

            if(user.private && user.followers.includes(req.user._id) === false) {
                return res.send({
                    user: userUtils.hide_props_in_js_object(user.toObject(), userConstants.private_data)
                })
            }

            return res.send({ user: userUtils.hide_props_in_js_object(user.toObject(), userConstants.props_to_hide) })
        } catch (error) {
            console.log(error)
            return res.status(500).send({ error: "Internal server error" })
        }
    }
}