const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/User')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    username: 'Ligma',
    email: 'ligma@gmail.com',
    password: '12fkv234',
    _id: userOneId,
    tokens: [
        { token: jwt.sign({ _id: userOneId }, process.env.JWT_KEY) }
    ]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    username: 'Sugma',
    email: 'sugma@gmail.com',
    password: '12fkv234',
    _id: userTwoId,
    tokens: [
        { token: jwt.sign({ _id: userOneId }, process.env.JWT_KEY) }
    ]
}

const userThreeId = new mongoose.Types.ObjectId()
const userThree = {
    username: 'Dickbag',
    email: 'dickbag@gmail.com',
    password: '12fkv234',
    _id: userTwoId,
    tokens: [
        { token: jwt.sign({ _id: userOneId }, process.env.JWT_KEY) }
    ]
}


const initialiseDatabase = async() =>{
    await User.deleteMany()

    await new User(userOne).save()
    await new User(userTwo).save()
    await new User(userThree).save()
}

module.exports = {
    userOne,
    userOneId,
    userTwo,
    userTwoId,
    userThree,
    userThreeId,
    initialiseDatabase
}