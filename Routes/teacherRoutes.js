const express = require('express');
const { isLoggedIn } = require('../Middleware/isLoggedIn');
const { giveAccessTo } = require('../Middleware/giveAccessTo');
const { markPresenty, uploadImages, resizeImage, submitTodaysTask } = require('../Controllers/teachersController');

const teacherRoute = express.Router();

teacherRoute.use(isLoggedIn, giveAccessTo("TEACHER"))
teacherRoute.post("/submitTodaysTask", submitTodaysTask)
teacherRoute.post("/markPresent", uploadImages, resizeImage, markPresenty)


module.exports = teacherRoute;
















