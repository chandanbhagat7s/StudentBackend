const express = require("express");
const { login, signUp } = require("../Controllers/userControllers");
const userRouter = express.Router()



userRouter.post('/login', login)
userRouter.post('/signup', signUp)








module.exports = userRouter;
















