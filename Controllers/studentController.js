const multer = require("multer");
const Course = require("../Models/Course");
const Homework = require("../Models/Homework");
const Payment = require("../Models/Payments");
const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");


const sharp = require("sharp");
const cloudinary = require('cloudinary');
const fs = require("fs")


const multerStorage = multer.memoryStorage();



// create filterObject
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {

        cb(null, true)
    } else {
        cb(new appError('please upload only image files', 400), false)

    }
}

const uploads = multer(
    {
        storage: multerStorage,
        fileFilter: multerFilter
    }
)

exports.uploadPaymentImage = uploads.single('paymentRecipt')

exports.resizePaymentsImage = catchAsync(async (req, res, next) => {









    if (!req.file) {
        return next(new appError("please upload a file", 400))
    }


    const { txdId, courseId } = req.body;
    if (!txdId || !courseId) {
        return next(new appError("please provide all the fields to buy the course", 400))
    }

    const courseDetails = await Course.findById(courseId)
    if (!courseDetails) {
        return next(new appError("please select valid course to submit ", 400))
    }


    req.body.image = `${req.user._id}-${courseId}.jpg`
    await sharp(req.file.buffer).toFormat('jpeg').toFile(`public/ScreenShortPayment/${req.body.image}`)





    next()

})



exports.getMyHomework = catchAsync(async (req, res, next) => {
    const courseId = req.user.courseData;

    if (!courseId) {
        return next(new appError("please subscribe to any course to get homework", 400))
    }

    const course = await Course.findById(courseId)
    if (!course || !course?.students?.includes(req.user._id)) {
        return next(new appError("course not found to list homework", 400))
    }
    const homeworks = await Homework.find({
        category: course.category
    })



    res.status(200).send({
        status: "success",
        homeworks: homeworks?.reverse()
    })
})


exports.buyCourse = catchAsync(async (req, res, next) => {

    const { txdId, courseId } = req.body;




    const result = await cloudinary.v2.uploader.upload(`public/ScreenShortPayment/${req.body.image}`, {
        folder: 'payments', // Save files in a folder named 

    });

    const payment = await Payment.create({
        txdId,
        paymentBy: req.user._id,
        courseId,
        paymentImage: result.secure_url
    })

    if (!payment) {
        fs.unlink(`public/ScreenShortPayment/${req.body.image}`, (err) => {

            console.log('path/file.txt was deleted');
        })
        return next(new appError("payment details not submitted please try again"))
    }


    fs.unlink(`public/ScreenShortPayment/${req.body.image}`, (err) => {

        console.log('path/file.txt was deleted');
    })

    res.status(200).send({
        status: "success",
        msg: "buyed this course , you will get access to course in few hours"
    })
})


exports.getAllCourses = catchAsync(async (req, res, next) => {
    const courses = await Course.find({})


    res.status(200).send(
        {
            status: "success",
            courses
        }
    )
})






















