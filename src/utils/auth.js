const verifyToken = (Model) => {
    return async(req, res, next)=>{
        try {
            // get and trim the token
            const token = req.header('Authorization').replace('Bearer ', '')
            // decode the token using the JWT secret
            const decoded = jwt.verify(token, "YOUR_MOM")
    
            // find a user based on that decoded token
            const user = await Model.findOne({ _id: decoded._id, 'tokens.token': token })
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

module.exports = {
    verifyToken
}