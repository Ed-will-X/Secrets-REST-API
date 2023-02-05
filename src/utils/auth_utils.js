const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

const verifyToken = (Schema) => {
    return async(req, res, next)=>{
        try {
            // get and trim the token
            const token = req.header('Authorization').replace('Bearer ', '')
            // decode the token using the JWT secret
            const decoded = jwt.verify(token, process.env.JWT_KEY)
    
            // find a user based on that decoded token
            const user = await Schema.findOne({ _id: decoded._id, 'tokens.token': token })
            // null user check
            if(!user){
                throw new Error()
            }
            // set the props into req for easy access

            // TODO: Set the user side props in the request object
            req.token = token;
            req.user = user;
            // next
            next()
        } catch (error) {
            res.status(401).send({
                error: "please authenticate"
            })
        }
    }
}

// checks block status, private status, if both users are the same and null user
const validate_action_between_users = (Schema) => {
    return async(req, res, next) => {

        try {
            const user = await Schema.findOne({ username: req.params.username })

            if(user == null) {
                return res.status(404).send({ error: "User not found" })
            }
            
            if(user.private && user.followers.includes(req.user._id) === false) {
                return res.status(401).send({ error: "Lack of authorisation to perform this operation on this user" })
            }
            
            if(req.user._id.toString() === user._id.toString()) {
                return res.status(403).send({ error: "You can't perform this operation on yourself" })
            }

            if(user.blocked.includes(req.user._id.toString())) {
                return res.status(401).send({ error: "Lack of authorisation to perform this operation on this user" })
            }

            next()
        } catch (error) {
            console.log(error)
            return res.status(500).send({ error: "Internal server error" })
        }
    }
}

const validate_action_between_users_post = (UserSchema, PostSchema) => {
    return async(req, res, next) => {

        try {
            const post = await PostSchema.findOne({ _id: req.params.id })

            if(post == null) {
                return res.status(404).send({ error: "Post not found" })
            }

            const user = await UserSchema.findOne({ owner_id: post.owner_id })

            if(user == null) {
                return res.status(404).send({ error: "User not found" })
            }
            
            if(user.private && user.followers.includes(req.user._id.toString()) === false && user._id.toString() !== req.user._id.toString()) {
                return res.status(401).send({ error: "Lack of authorisation to perform this operation on this user" })
            }

            if(user.blocked.includes(req.user._id.toString())) {
                return res.status(401).send({ error: "Lack of authorisation to perform this operation on this user" })
            }

            next()
        } catch (error) {
            console.log(error)
            return res.status(500).send({ error: "Internal server error" })
        }
    }
}

const validate_current_user_post_action = (PostSchema) => {
    return async(req, res, next) => {
        try {
            const secret = await PostSchema.findOne({ _id: req.params.secret })

            if(secret == null) {
                return res.status(404).send({ error: "Entry not found" })
            }

            if(secret.owner_id.toString() != req.user._id.toString()) {
                return res.status(403).send({ error: "You can't perform this action with an entry that isn't yours" })
            }

            next()
        } catch (error) {
            console.log(error)
            return res.status(500).send({ error: "Internal server error" })
        }
    }
}

// checks block status, if both users are the same and null user
const validate_action_between_users_blocked = (Schema) => {
    return async(req, res, next) => {
        try {
            const user = await Schema.findOne({ username: req.params.username })

            if(user == null) {
                return res.status(404).send({ error: "User not found" })
            }
            
            if(req.user._id.toString() === user._id.toString()) {
                return res.status(403).send({ error: "You can't perform this operation on yourself" })
            }

            if(user.blocked.includes(req.user._id.toString())) {
                return res.status(401).send({ error: "Lack of authorisation to perform this operation on this user" })
            }

            next()
        } catch (error) {
            console.log(error)
            return res.status(500).send({ error: "Internal server error" })
        }
    }
}



function generateToken(Schema) {
    Schema.methods.generateToken = async function() {
        // current user object is stored in "this"
        const user = this

        const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_KEY)
        user.tokens = user.tokens.concat({ token: token })

        user.save()

        return token
    }
}

function hashPassword(Schema) {
    Schema.pre("save", async function(next) {
        const user = this

        if(user.isModified("password")) {
            user.password = await bcrypt.hash(user.password, 8)
        }

        next()
    })
}

module.exports = {
    verifyToken,
    hashPassword,
    generateToken,
    validate_action_between_users,
    validate_action_between_users_blocked,
    validate_action_between_users_post,
    validate_current_user_post_action
}