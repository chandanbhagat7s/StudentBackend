const express = require('express');
const { isLoggedIn } = require('../Middleware/isLoggedIn');
const { giveAccessTo } = require('../Middleware/giveAccessTo');
const { markPresenty, uploadImages, resizeImage, submitTodaysTask } = require('../Controllers/teachersController');

const teacherRoute = express.Router();

teacherRoute.use(isLoggedIn, giveAccessTo("TEACHER"))
teacherRoute.post("/markPresent", uploadImages, resizeImage, markPresenty)
teacherRoute.get("/submitTodaysTask", submitTodaysTask)


module.exports = teacherRoute;
















