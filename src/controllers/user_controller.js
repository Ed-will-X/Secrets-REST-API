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
    }
}