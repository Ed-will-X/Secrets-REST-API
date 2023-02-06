const mongoose = require("mongoose")

const Secret = require("../models/Secret")
const User = require("../models/User")
const userUtils = require("../utils/user_utils")
const userConstants = require("../constants/user_constants")
const postConstants = require("../constants/post_constants")
const user_utils = require("../utils/user_utils")
const users_controller = require("./users_controller")

module.exports = {
    uploadSecret: async(req, res) => {
        try {
            const _id = mongoose.Types.ObjectId()

            if(req.body.tags.length > 10) {
                return res.status(400).send({ error: "You can't upload more than 10 tags" })
            }

            let sanitised_tags = []
            if(req.body.tags.length > 0) {
                for(let i = 0; i < req.body.tags.length; i++) {
                    if(req.body.tags[i] === "") {
                        continue
                    }
                    sanitised_tags.push(req.body.tags[i].toLowerCase())
                }
            }

            const tags_to_store = [ ...new Set(sanitised_tags) ]

            const secret = new Secret({
                entryTitle: req.body.entryTitle,
                entryBody: req.body.entryBody,
                date: req.body.date,
                uploadTimestamp: Date.now(),
                owner_id: req.user._id,
                tags: tags_to_store,
                NSFW: req.body.NSFW,
                mediaType: req.body.mediaType,
                _id: _id,
                isPublic: req.body.isPublic
            })

            if(secret.mediaType === "none") {
                secret.shadowBan = false
            }

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
            return res.status(500).send({ error: e })
        }
    },
    uploadEntryImage: async(req, res) => {
        try {
            const secret = await Secret.findOne({ _id: req.params.secret })

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
        try {
            const entry = await Secret.findOne({ _id: req.params.secret })

            const updates = Object.keys(req.body)
            const allowed = postConstants.allowed_post_updates

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
                entry[update] = req.body[update]
            })

            entry.edited = true
            entry.lastUpdated = Date.now()

            await entry.save()
            return res.send("Updated")
        } catch (e) {
            console.log(e)
            return res.status(500).send({ error: "Internal server error" })
        }
    },
    likeSecret: async(req, res) => {
        try {
            const secret = await Secret.findOne({ _id: req.params.id })
            
            if(secret.likes.includes(req.user._id.toString())){
                return res.send("already liked")
            }

            userUtils.addIDsToArray_double(req.user._id, secret._id, req.user.likedSecrets, secret.likes)

            await secret.save()
            await req.user.save()

            return res.send("Liked")

        } catch (error) {
            console.log(error)
            return res.status(500).send({ error: "Internal server error" })
        }
    },
    unlikeSecret: async(req, res) => {
        try {
            const secret = await Secret.findOne({ _id: req.params.id })
            
            if(secret.likes.includes(req.user._id.toString()) == false) {
                return res.send("Already not liked")
            }

            userUtils.removeIDsFromArray_double(req.user._id, secret._id, req.user.likedSecrets, secret.likes)

            await secret.save()
            await req.user.save()

            return res.send("unliked")
        } catch (error) {
            console.log(error)
            return res.status(500).send({ error: "Internal server error" })
        }
    },
    deleteEntry: async(req, res) => {
        try {
            const secret = await Secret.findOne({ _id: req.params.id })

            await secret.remove()

            return res.send("Entry removed")
        } catch (error) {
            console.log(error)
            return res.status(500).send({ error: "Internal server error" })
        }
    },
    savePost: async(req, res) => {
        try {
            const entry = await Secret.findOne({ _id: req.params.id })

            if(req.user.savedPosts.includes(entry._id.toString())) {
                return res.send("Entry already saved")
            }

            userUtils.addIDsToArray_double(req.user._id, entry._id, req.user.savedPosts, entry.savedBy)

            await entry.save()
            await req.user.save()

            return res.send("Entry saved")
        } catch (error) {
            console.log(error)
            return res.status(500).send({ error: "Internal server error" })
        }
    },
    unsavePost: async(req, res) => {
        try {
            const entry = await Secret.findOne({ _id: req.params.id })

            if(req.user.savedPosts.includes(entry._id.toString()) === false) {
                return res.send("Entry already not saved")
            }

            userUtils.removeIDsFromArray_double(req.user._id, entry._id, req.user.savedPosts, entry.savedBy)

            await entry.save()
            await req.user.save()

            return res.send("Entry unsaved")
        } catch (error) {
            console.log(error)
            return res.status(500).send({ error: "Internal server error" })
        }
    },
    addComment: async(req, res) => {
        try {
            const entry = await Secret.findOne({ _id: req.params.id })

            if(req.body.comment === undefined) {
                return res.status(400).send({ error: "Comment must not be null" })
            }

            const _id = new mongoose.Types.ObjectId()
            entry.comments.push({ user: req.user._id.toString(), comment: req.body.comment, _id: _id })
            // TODO: Not tested
            if(req.user.posts_commented_on.includes(entry._id.toString()) === false){
                req.user.posts_commented_on.push(entry._id.toString())
            }

            await entry.save()
            await req.user.save()

            return res.status(201).send(_id)
        } catch(e) {
            console.log(e)
            return res.status(500).send({ error: "Internal server error" })
        }
    },
    removeComment: async(req, res) => {
        try {
            const entry = await Secret.findOne({ _id: req.params.id })
            const comment = userUtils.findObj(req.params.comment, entry.comments)

            if(comment === false) {
                return res.status(404).send("Comment does not exist")
            }

            if(comment.user.toString() != entry.owner_id.toString()) {
                return res.status(403).send({ error: "You can't delete a comment that isn't yours" })
            }

            entry.comments = entry.comments.filter((comment)=> {
                return comment._id.toString() !== req.params.comment
            })
            // userUtils.removeIDFromArray(req.params.comment, entry.comments)
            // TODO: Not tested
            // userUtils.removeIDFromArray(req.user.posts_commented_on, entry._id)

            await entry.save()
            await req.user.save()

            return res.send("removed")
        } catch (error) {
            console.log(error)
            return res.status(500).send({ error: "Internal server error" })
        }
    },
    likeComment: async(req, res) => {
        try {
            const entry = await Secret.findOne({ _id: req.params.id })
            const comment = userUtils.findObj(req.params.comment, entry.comments)

            if(comment === false) {
                return res.status(404).send("Comment does not exist")
            }

            if(comment.likes.includes(req.user._id.toString())) {
                return res.send("Comment already liked")
            }

            const commentIdx = userUtils.findIndexOfObj(req.params.comment, entry.comments)

            userUtils.addIDsToArray_double(req.user._id, req.params.comment, req.user.likedComments, entry.comments[commentIdx].likes)

            await entry.save()
            await req.user.save()

            return res.send("Comment Liked")
        } catch(e) {
            console.log(e)
            return res.status(500).send({ error: "Internal server error" })
        }
    },
    unlikeComment: async(req, res) => {
        try {
            const entry = await Secret.findOne({ _id: req.params.id })
            const comment = userUtils.findObj(req.params.comment, entry.comments)

            if(comment === false) {
                return res.status(404).send({ error: "Comment does not exist" })
            }

            if(comment.likes.includes(req.user._id.toString()) === false) {
                return res.send("Comment already not liked")
            }

            const commentIdx = userUtils.findIndexOfObj(req.params.comment, entry.comments)

            const currentUserIdx = entry.comments[commentIdx].likes.indexOf(req.user._id.toString())

            if(currentUserIdx !== -1) {
                entry.comments[commentIdx].likes.splice(currentUserIdx, 1)
            }
            userUtils.removeIDFromArray(req.params.comment, req.user.likedComments)

            await entry.save()
            await req.user.save()

            return res.send("Unliked")
        } catch(e) {
            console.log(e)
            return res.status(500).send({ error: "Internal server error" })
        }
    },
    editComment: async(req, res) => {
        try {
            const entry = await Secret.findOne({ _id: req.params.id })
            const comment = userUtils.findObj(req.params.comment, entry.comments)

            if(comment === false) {
                return res.status(404).send({ error: "Comment does not exist" })
            }

            if(comment.user !== req.user._id.toString()) {
                return res.status(403).send({ error: "You can't delete a comment that isn't yours" })
            }

            if(req.body.comment === undefined) {
                return res.status(400).send({ error: "Comment must not be empty" })
            }

            const commentIdx = userUtils.findIndexOfObj(req.params.comment, entry.comments)

            if(commentIdx !== -1) {
                entry.comments[commentIdx].edited = true

                entry.comments[commentIdx].comment = req.body.comment
            }

            await entry.save()

            return res.send("Edited")
        } catch (error) {
            console.log(error)
            return res.status(500).send({ error: "Internal server error" })
        }
    },
    viewSecret: async(req, res) => {

    },
    getEntry: async(req, res) => {
        try {
            const entry = await Secret.findOne({ _id: req.params.id })

            return res.send({
                entry: userUtils.hide_props_in_js_object(entry.toObject(), postConstants.props_to_hide)
            })
        } catch (error) {
            console.log(error)
            return res.status(500).send({ error: "Internal server error" })
        }
    },
    getEntry_min: async(req, res) => {
        try {
            const entry = await Secret.findOne({ _id: req.params.id })

            return res.send({
                entry: userUtils.hide_props_in_js_object(entry.toObject(), postConstants.props_to_hide_query)
            })
        } catch (error) {
            console.log(error)
            return res.status(500).send({ error: "Internal server error" })
        }
    },
    getEntry_image: async(req, res) => {
        try {
            const entry = await Secret.findOne({ _id: req.params.id })

            if(entry.entryImage === undefined) {
                return res.status(404).send({
                    error: "Image not found"
                })
            }
            res.set("Content-Type", "image/png")

            return res.send(entry.entryImage)
        } catch (error) {
            console.log(error)
            return res.status(500).send({ error: "Internal server error" })
        }
    },
    queryEntries: async(req, res) => {
        try {
            const term = req.params.term

            if(term.length < 4) {
                return res.send({
                    entries: []
                })
            }

            if(req.query.method === undefined) {
                return res.status(400).send({ error: "Method must not be undefined" })
            }

            let entries
            if(req.query.method === "title") {
                entries = await Secret.find({ entryTitle: { "$regex": term } }).limit(parseInt(req.query.limit)).skip(parseInt(req.query.skip))
            } else if(req.query.method === "body") {
                entries = await Secret.find({ entryBody: { "$regex": term } }).limit(parseInt(req.query.limit)).skip(parseInt(req.query.skip))
            }

            let entries_to_send = []
            for(let i = 0; i < entries.length; i++) {
                const user = await User.findOne({ _id: entries[i].owner_id })

                if(user.blocked.includes(req.user._id.toString())) {
                    continue
                } else if(entries[i].isPublic === false && entries[i].owner_id === req.user._id.toString()) {
                    continue
                } else if(user.private && user.followers.includes(req.user._id.toString()) === false && user._id.toString() !== req.user._id.toString()) {
                    continue
                }

                entries_to_send.push(entries[i])
            }

            return res.send({
                entries: user_utils.hidePropsInArray(entries_to_send, postConstants.props_to_hide_query)
            })

        } catch (error) {
            console.log(error)
            return res.status(500).send({ error: "Internal server error" })
        }
    },
    replyComment: async(req, res) => {
        try {
            const entry = await Secret.findOne({ _id: req.params.id })
            const comment = userUtils.findObj(req.params.comment, entry.comments)

            if(comment === false) {
                return res.status(404).send("Comment does not exist")
            }

            if(req.body.reply === undefined) {
                return res.status(400).send({ error: "Comment must not be null" })
            }

            const _id = new mongoose.Types.ObjectId()
            const reply = {
                user: req.user._id.toString(),
                _id: _id,
                comment: req.body.reply
            }

            const commentIdx = userUtils.findIndexOfObj(req.params.comment, entry.comments)
            entry.comments[commentIdx].replies.push(reply)

            await entry.save()

            return res.send(_id)
        } catch (error) {
            console.log(error)
            return res.status(500).send({ error: "Internal server error" })
        }
    },
    likeCommentReply: async(req, res)=> {
        try {
            const entry = await Secret.findOne({ _id: req.params.id })
            const comment = userUtils.findObj(req.params.comment, entry.comments)

            if(comment === false) {
                return res.status(404).send("Comment does not exist")
            }

            const commentIdx = userUtils.findIndexOfObj(req.params.comment, entry.comments)
            const replyIdx = userUtils.findIndexOfObj(req.params.reply, entry.comments[commentIdx].replies)

            if(entry.comments[commentIdx].replies[replyIdx].likes.includes(req.user._id.toString())) {
                return res.send("Comment reply already liked")
            }
            // console.log(entry.comments[commentIdx].replies[replyIdx].comment)
            entry.comments[commentIdx].replies[replyIdx].likes.push(req.user._id.toString())

            await entry.save()

            return res.send("comment reply liked")
        } catch (error) {
            console.log(error)
            return res.status(500).send({ error: "Internal server error" })
        }
    },
    unlikeCommentReply: async(req, res) => {
        try {
            const entry = await Secret.findOne({ _id: req.params.id })
            const comment = userUtils.findObj(req.params.comment, entry.comments)

            if(comment === false) {
                return res.status(404).send("Comment does not exist")
            }

            const commentIdx = userUtils.findIndexOfObj(req.params.comment, entry.comments)
            const replyIdx = userUtils.findIndexOfObj(req.params.reply, entry.comments[commentIdx].replies)

            if(entry.comments[commentIdx].replies[replyIdx].likes.includes(req.user._id.toString()) === false) {
                return res.send("Comment reply already not liked")
            }
            userUtils.removeIDFromArray(req.user._id.toString(), entry.comments[commentIdx].replies[replyIdx].likes)

            await entry.save()

            return res.send("comment reply unliked")
        } catch (error) {
            console.log(error)
            return res.status(500).send({ error: "Internal server error" })
        }
    },
    deleteCommentReply: async(req, res) => {
        try{
            const entry = await Secret.findOne({ _id: req.params.id })
            const comment = userUtils.findObj(req.params.comment, entry.comments)

            if(comment === false) {
                return res.status(404).send("Comment does not exist")
            }
            const commentIdx = userUtils.findIndexOfObj(req.params.comment, entry.comments)
            const reply = userUtils.findObj(req.params.reply, entry.comments[commentIdx].replies)

            if(reply === false) {
                return res.status(404).send("Reply does not exist")
            }

            entry.comments[commentIdx].replies = entry.comments[commentIdx].replies.filter((reply)=> {
                return reply._id.toString() !== req.params.reply
            })

            await entry.save()

            return res.send("Deleted")
        } catch(error) {
            console.log(error)
            return res.status(500).send({ error: "Internal server error" })
        }
    },
    editCommentReply: async(req, res) => {
        try {
            const entry = await Secret.findOne({ _id: req.params.id })
            const comment = userUtils.findObj(req.params.comment, entry.comments)

            if(comment === false) {
                return res.status(404).send("Comment does not exist")
            }

            if(req.body.reply === undefined) {
                return res.status(400).send({ error: "Comment must not be null" })
            }

            const commentIdx = userUtils.findIndexOfObj(req.params.comment, entry.comments)
            const replyIdx = userUtils.findIndexOfObj(req.params.reply, entry.comments[commentIdx].replies)

            entry.comments[commentIdx].replies[replyIdx].edited = true
            entry.comments[commentIdx].replies[replyIdx].comment = req.body.reply

            await entry.save()

            return res.send("edited")
        } catch (error) {
            console.log(error)
            return res.status(500).send({ error: "Internal server error" })
        }
    }

}