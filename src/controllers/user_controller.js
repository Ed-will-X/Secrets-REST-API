const mongoose = require("mongoose")

const User = require("../models/User")
const Secret = require("../models/Secret")
const userConstants = require("../constants/user_constants")
const userUtils = require("../utils/user_utils")

module.exports = {
    getProfile: (req, res)=> {
        try{
            return res.send({ 
                user: userUtils.hide_props_in_js_object(req.user.toObject(), userConstants.current_user_props_to_hide)
            })
        } catch (e) {
            return res.status(500).send({ error: "Internal Server Error" })
        }
    },
    editProfile: async(req, res) => {
        try {
            const updates = Object.keys(req.body)
            const allowed = userConstants.allowed_user_updates

            if(updates.length < 1) {
                return res.status(400).send({ error: "Fields can't be empty" })
            }

            const isValid = updates.every((update)=> {
                return allowed.includes(update)
            })

            if(!isValid) {
                return res.status(400).send({ error: "Invalid updates" })
            }

            updates.forEach((update)=> {
                req.user[update] = req.body[update]
            })

            await req.user.save()
            return res.send("Updated")
        } catch (error) {
            return res.status(500).send({ error: "Internal server error" })
        }
    },
    uploadProfileImage: async(req, res) => {
        try {
            if(req.file === undefined) {
                return res.status(400).send({ error: "Image must not be empty" })
            }

            req.user.profileImage = req.file.buffer
            req.user.imageChangeTimestamp = Date.now()

            await req.user.save()
            return res.send("Image upload successful")
        } catch (error) {
            console.log(error)
            return res.status(500).send({ error: "Internal server error" })
        }
    },
    deleteProfileImage: async(req, res) => {
        try {
            req.user.profileImage = undefined
            req.user.imageChangeTimestamp = -1

            await req.user.save()
            return res.send("Profile Image deleted")
        } catch (error) {
            console.log(error)
            return res.status(500).send({ error: "Internal server error" })
        }
    },
    getCurrentUserProfileImage: async(req, res) => {
        try {
            res.set("Content-Type", "image/png")

            return res.send(req.user.profileImage)
        } catch (error) {
            console.log(error)
            return res.status(500).send({ error: "Internal server error" })
        }
    },
    deleteUser: async(req, res) => {
        try {
            const entries = await Secret.find({ owner_id: req.user._id })

            await req.user.remove()
            
            for(let entry of entries) {
                await entry.remove()
            }

            return res.send("Deleted")
        } catch(e) {
            console.log(e)
            return res.status(500).send({ error: "Internal server error" })
        }
    }
}