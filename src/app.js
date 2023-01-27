const express = require("express")
const userRouter = require("./routers/user")
const usersRouter = require("./routers/users")
require("./db/mongoose")

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(usersRouter)


module.exports = app