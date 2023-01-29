const mongoose = require("mongoose")

const Secret = require("../models/Secret")
const User = require("../models/User")

module.exports = {
    uploadSecret: async(req, res) => {
        try {
            const _id = mongoose.Types.ObjectId()

            const secret = new Secret({
                entryTitle: req.body.entryTitle,
                entryBody: req.body.entryBody,
                date: req.body.date,
                uploadTimestamp: Date.now(),
                owner_id: req.user._id,
                tags: req.body.tags,
                NSFW: req.body.NSFW,
                mediaType: req.body.mediaType,
                _id: _id
            })

            await secret.save()


            setTimeout(async()=> {
                // Fetch secret with ID
                const secret = await Secret.findOne({ _id: _id })
                // if it has a media type, check if the media type is stored in the secret object
                if(secret.mediaType === "image" && secret.entryImage == null) {
                    // If media type is not stored in the appropriate format, delete the secret
                    await secret.remove()
                    console.log("Secret has been removed")
                }
            }, 60000)
            return res.status(201).send({ 
                _id: _id
             })
        } catch(e) {
            console.log(e)
            return res.status(500).send({ error: "Internal server error" })
        }
    },
    uploadEntryImage: async(req, res) => {
        try {
            const secret = await Secret.findOne({ _id: req.params.secret })
            if(secret == null) {
                return res.status(404).send({ error: "Entry not found" })
            }

            if(secret.mediaType !== "image") {
                return res.status(400).send({ error: "You cannot upload an image for this post" })
            }

            if(req.file === undefined) {
                return res.status(400).send({ error: "Image must not be empty" })
            }

            if(secret.entryMediaVersion > 0) {
                return res.status(403).send({ error: "Image has already been uploaded" })
            }

            secret.entryImage = req.file.buffer
            secret.entryMediaVersion = secret.entryMediaVersion + 1
            secret.shadowBan = false

            await secret.save()

            return res.status(201).send("Entry image upload successful")
        } catch (error) {
            console.log(error)
            return res.status(500).send({ error: "Internal server error" })
        }
    },
    editSecret: async(req, res) => {
        // TODO: Collect timestamp here from req.body
        // Then use that to update the date string
    }
}