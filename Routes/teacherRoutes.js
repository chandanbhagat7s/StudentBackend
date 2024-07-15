const express = require('express');
const { isLoggedIn } = require('../Middleware/isLoggedIn');
const { giveAccessTo } = require('../Middleware/giveAccessTo');
const { markPresenty, uploadImages, resizeImage, submitTodaysTask, getMyPresentyDataByMonth, getAllMyNotification, requestForLeave, resizeLeaveImage, uploadLeaveImages } = require('../Controllers/teachersController');

const teacherRoute = express.Router();

teacherRoute.use(isLoggedIn, giveAccessTo("TEACHER"))
teacherRoute.post("/submitTodaysTask", submitTodaysTask) // done
teacherRoute.post("/markPresent", uploadImages, resizeImage, markPresenty)  // done
teacherRoute.get("/getMyPresentyData/:month", getMyPresentyDataByMonth)  //done

teacherRoute.post("/requestForLeave", uploadLeaveImages, resizeLeaveImage, requestForLeave)
teacherRoute.get("/getAllNotification", getAllMyNotification)


module.exports = teacherRoute;
















