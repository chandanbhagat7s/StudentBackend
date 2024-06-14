const express = require('express');
const { createTeachersBatch, createTeacher } = require('../Controllers/adminController');
const { isLoggedIn } = require('../Middleware/isLoggedIn');
const { giveAccessTo } = require('../Middleware/giveAccessTo');

const adminRouter = express.Router()


adminRouter.use(isLoggedIn, giveAccessTo("ADMIN"))
adminRouter.post("/createTeachersbatch", createTeachersBatch)
adminRouter.post("/createTeachers", createTeacher)

// adminRouter.post("/createStudent",)

module.exports = adminRouter;







