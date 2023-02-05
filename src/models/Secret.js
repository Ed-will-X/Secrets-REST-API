const mongoose = require("mongoose")

const secretSchema = new mongoose.Schema({
    owner_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    entryTitle: {
        type: String,
        required: true,
    },
    entryBody: {
        type: String,
        required: true
    },
    edited: {
        type: Boolean,
        required: true,
        default: false
    },
    entryImage: {
        type: Buffer
    },
    mediaType: {
        type: String,
        required: true
    },
    tags: {
        type: Array,
        default: []
    },
    isPublic: {
        type: Boolean,
        required: true,
        default: false
    },
    savedBy: {
        type: Array,
        default: []
    },
    uploadTimestamp: {
        type: Number,
        required: true
    },
    lastUpdated: {
        type: Number,
        required: true,
        default: -1
    },
    NSFW: {
        type: Boolean,
        required: true,
    },
    entryMediaVersion: {
        type: Number,
        default: 0
    },
    likes: {
        type: Array,
        default: []
    },
    date: {
        type: String,
        required: true,
        unique: false
    },
    shadowBan: {
        type: Boolean,
        required: true,
        default: true
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
}, {
    timestamps: true
})


const Secret = mongoose.model("Secret", secretSchema)

module.exports = Secret