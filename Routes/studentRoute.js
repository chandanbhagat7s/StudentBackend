
const express = require('express');
const { getMyHomework, buyCourse, uploadPaymentImage, resizePaymentsImage, getAllCourses } = require('../Controllers/studentController');
const multer = require('multer');
const { isLoggedIn } = require('../Middleware/isLoggedIn');
const { giveAccessTo } = require('../Middleware/giveAccessTo');
const studentRouter = express.Router()


const multerStorage = multer.memoryStorage();



studentRouter.use(isLoggedIn, giveAccessTo("STUDENT"))
studentRouter.get("/getAllCourses", getAllCourses) // done
studentRouter.post("/buyCourse", uploadPaymentImage, resizePaymentsImage, buyCourse) //done

studentRouter.get("/getMyHomework", getMyHomework);




module.exports = studentRouter

