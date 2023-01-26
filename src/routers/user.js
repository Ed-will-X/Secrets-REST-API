const express = require("express")


const router = express.Router()

router.get("/", (req, res)=> {
    res.status(200).send("Success")
})

router.post("/signup", (req, res)=>{

})

router.post("signin", (req, res)=>{
    
})

module.exports = router