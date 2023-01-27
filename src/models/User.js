const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")

const authUtils = require("../utils/auth_utils")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        minlength: [3, "Username too short"],
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: (value)=> {
            if(!validator.isEmail(value)) {
                throw new error("Not a valid email")
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: [ 8, "Password too short" ]
    },
    likedSecrets: {
        type: Array,
        default: []
    },
    gender: {
        type: Number,
        required: true,
        default: 0
    },
    secrets: {
        type: Array,
        default: []
    },
    imageChangeTimestamp: {
        type: Number,
        default: -1
    },
    profileImage: {
        type: Buffer
    },
    followers: {
        type: Array,
        default: []
    },
    following: {
        type: Array,
        default: []
    },
    blocked: {
        type: Array,
        default: []
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

authUtils.generateToken(userSchema)
authUtils.hashPassword(userSchema)

userSchema.statics.findByCredentials = async function(email, password) {
    const user = await User.findOne({ email: email }).exec()
    

    if(!user) {
        console.error("User is null")
        return {
            error_title: "Can't find Account",
            error_message: `Can't find account with the email ${email}`,
            status: 404,
            isError: true
        }
    } else {
        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch) {
            console.error("No match")
            return {
                error_title: "Incorrect Password",
                error_message: `The password supplied is incorrect.`,
                status: 401,
                isError: true
            }
        }
    }

    return user

}

const User = mongoose.model("User", userSchema)

module.exports = User