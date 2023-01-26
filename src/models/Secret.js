const mongoose = require("mongoose")

const secretSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    title: {
        type: String,
        retuired: true,
    },
    body: {
        type: String,
        required: true,
    },
    image: {
        type: Buffer
    },
    comments: [{
        user: {
            type: String,
            required: true
        },
        comment: {
            type: String,
            required: true
        },
        likes: {
            type: Array,
            required: true,
            default: []
        },
        edited: {
            type: Boolean,
            required: true,
            default: false
        },
        replies: [{
            user: {
                type: String,
                required: true
            },
            comment: {
                type: String,
                required: true
            },
            likes: {
                type: Array,
                required: true,
                default: []
            },
            edited: {
                type: Boolean,
                required: true,
                default: false
            },
        }]
    }]
})


const Secret = mongoose.model("Secret", secretSchema)

module.exports = Secret