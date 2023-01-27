const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

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
    generateToken
}