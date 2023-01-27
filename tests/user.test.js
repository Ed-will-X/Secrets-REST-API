const request = require("supertest")
const app = require("../src/app")
const db = require("./fixtures/db")
const User = require('../src/models/User')

beforeEach(db.initialiseDatabase)

test("Testing", async()=> {
    await request(app).get("/test").send({
        name: "Test"
    }).expect(200)
})

test("Should sign a user up", async()=> {
    const response = await request(app).post("/signup").send({
        "username": "Elsa",
        "email": "elsa@gmail.com",
        "password": "12345678"
    }).expect(201)

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()


})