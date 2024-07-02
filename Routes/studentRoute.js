
const express = require('express');
const { getMyHomework, buyCourse, uploadPaymentImage, resizePaymentsImage } = require('../Controllers/studentController');
const multer = require('multer');
const studentRouter = express.Router()


const multerStorage = multer.memoryStorage();




studentRouter.get("/getMyHomework", getMyHomework);
studentRouter.post("/buyCourse", uploadPaymentImage, resizePaymentsImage, buyCourse)





module.exports = studentRouter

