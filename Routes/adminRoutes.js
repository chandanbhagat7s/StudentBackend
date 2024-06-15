const express = require('express');
const { createTeachersBatch, createTeacher, markTodayAsHoliday, todaysEvent, getAllEvent, uploadEventImages, resizeEventImage } = require('../Controllers/adminController');
const { isLoggedIn } = require('../Middleware/isLoggedIn');
const { giveAccessTo } = require('../Middleware/giveAccessTo');

const adminRouter = express.Router()


adminRouter.get("/getAllEvents", getAllEvent)
adminRouter.use(isLoggedIn, giveAccessTo("ADMIN"))
adminRouter.post("/createTeachersbatch", createTeachersBatch)
adminRouter.post("/createTeachers", createTeacher)
adminRouter.post("/markDateAsHoliday", markTodayAsHoliday)
adminRouter.post("/todaysEvent", uploadEventImages, resizeEventImage, todaysEvent)

// adminRouter.post("/createStudent",)

module.exports = adminRouter;







