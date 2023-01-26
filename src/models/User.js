const mongoose = require("mongoose")
const validator = require("validator")

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
        required: true
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
})

const User = mongoose.model("User", userSchema)

module.exports = User