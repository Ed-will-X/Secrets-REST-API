const mongoose = require("mongoose")

const updateSchema = new mongoose.Schema({
    owner_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    image: {
        type: Buffer
    },
    mediaType: {
        type: String,   // [ "image", "video" ]
        required: true
    },
    caption: {
        type: String
    },
    timestamp: {
        type: Number,
        required: true,
        default: -1
    }
}, {
    timestamps: true
})

const Update = mongoose.model(updateSchema)

module.exports = Update