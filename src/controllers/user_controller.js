const mongoose = require("mongoose")

const User = require("../models/User")
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
            const allowed = userConstants.allowed_updates

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
    }
}