const express = require("express");
const { login, signUp, logout } = require("../Controllers/userControllers");
const userRouter = express.Router()



userRouter.get('/logout', logout)
userRouter.post('/login', login)
userRouter.post('/signup', signUp)








module.exports = userRouter;
















