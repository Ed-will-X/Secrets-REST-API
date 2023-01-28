const Secret = require("../models/Secret")

module.exports = {

    uploadSecret: async(req, res) => {
        try {
            const secret = new Secret({
                title: req.body.title,
                body: req.body.body,
                private: req.body.private,
                // TODO: Create date amendment function that embedds the current timestamp into the date
                date: `${req.body.date}:${req.user._id}`,
                owner_id: req.user._id
            })

            await secret.save()

            return res.status(201).send("Upload successful")
        } catch(e) {
            console.log(e)
            return res.status(500).send({ error: "Internal server error" })
        }
    },
    editSecret: async(req, res) => {
        // TODO: Collect timestamp here from req.body
        // Then use that to update the date string
    }
}