const express = require("express")
const userRouter = require("./routers/user")
const usersRouter = require("./routers/users")
const secretsRouter = require("./routers//secret")
require("./db/mongoose")

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(usersRouter)
app.use(secretsRouter)


module.exports = app