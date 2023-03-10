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
        maxLength: [20, "Username too long"],
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
    about: {
        type: String,
        maxLength: 150,
        required: false
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: [ 8, "Password too short" ]
    },
    // TODO: Uncomment and implement validation
    // DOB: {
    //     type: String,
    //     required: true,
    //     minlength: [ 10, "Date of birth too short" ],
    //     maxLength: [ 10, "Date of birth too long" ]
    // },
    likedSecrets: {
        type: Array,
        default: []
    },
    posts_commented_on: {
        type: Array,
        default: []
    },
    NSFW: {
        type: Boolean,
        required: true,
        default: false
    },
    viewedSecrets: {
        type: Array,
        default: []
    },
    private: {
        type: Boolean,
        required: true,
        default: false
    },
    gender: {
        type: Number,
        required: true,
        default: 0
    },
    imageChangeTimestamp: {
        type: Number,
        default: -1
    },
    profileImage: {
        type: Buffer
    },
    likedComments: {
        type: Array,
        default: []
    },
    followers: {
        type: Array,
        default: []
    },
    following: {
        type: Array,
        default: []
    },
    followRequests: {
        type: Array,
        default: []
    },
    blocked: {
        type: Array,
        default: []
    },
    blockedBy: {
        type: Array,
        default: []
    },
    savedPosts: {
        type: Array,
        default: []
    },
    updatePrivacyMethod: {  // [ "none", "share_with", "share_with_all_except" ]
        type: String,
        required: true,
        default: "none"
    },
    share_with: {
        type: Array,
        default: []
    },
    share_with_all_except: {
        type: Array,
        default: []
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    customEntrySort: [{ // TODO: Create custom entry sort
        date: {
            type: String,
            required: true
        },
        order: {
            type: Array,
            required: true
        }
    }]
}, {
    timestamps: true
})

userSchema.virtual("secrets", {
    ref: "Secret",
    localField: "_id",
    foreignField: "owner"
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