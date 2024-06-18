const express = require('express');
const { createTeachersBatch, createTeacher, markTodayAsHoliday, todaysEvent, getAllEvent, uploadEventImages, resizeEventImage, createStudent, createStudentsBatch, createHomework } = require('../Controllers/adminController');
const { isLoggedIn } = require('../Middleware/isLoggedIn');
const { giveAccessTo } = require('../Middleware/giveAccessTo');

const adminRouter = express.Router()


adminRouter.get("/getAllEvents", getAllEvent)
adminRouter.use(isLoggedIn, giveAccessTo("ADMIN"))
adminRouter.post("/createTeachersbatch", createTeachersBatch)
adminRouter.post("/createStudentbatch", createStudentsBatch)
adminRouter.post("/createTeachers", createTeacher)
adminRouter.post("/createStudent", createStudent)
adminRouter.post("/createHomework", createHomework)
adminRouter.post("/markDateAsHoliday", markTodayAsHoliday)
adminRouter.post("/todaysEvent", uploadEventImages, resizeEventImage, todaysEvent)

// adminRouter.post("/createStudent",)

module.exports = adminRouter;







