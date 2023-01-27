const mongoose = require("mongoose")

const User = require("../models/User")
const userConstants = require("../constants/user_constants")
const userUtils = require("../utils/user_utils")

module.exports = {
    signUp: async (req, res) => {
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        })

        try {
            await user.save()

            const token = await user.generateToken()
            // TODO: Hide password

            return res.status(201).send({ 
                user: userUtils.hide_props_in_js_object(user.toObject(), userConstants.current_user_props_to_hide), 
                token: token
            })
        } catch (error) {
            return res.status(400).send({ error: error })
        }
    },
    signIn: async(req, res) => {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        console.log(req.body.email)


        try {
            if(!user.error) {
                const token = await user.generateToken()
    
                return res.status(200).send({
                    user: userUtils.hide_props_in_js_object(user.toObject(), userConstants.current_user_props_to_hide), token: token
                })
            } else {
                return res.status(user.status).send({ error: { title: user.title, message: user.message } })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).send({ error: "Internal server error" })
        }
    }
}