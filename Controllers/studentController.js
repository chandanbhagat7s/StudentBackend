const Course = require("../Models/Course");
const Homework = require("../Models/Homework");
const Payment = require("../Models/Payments");
const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");


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
    if (!txdId || !courseId) {
        return next(new appError("please provide all the fields to buy the course", 400))
    }

    const courseDetails = await Course.findById(courseId)
    if (!courseDetails) {
        return next(new appError("please select valid course to submit ", 400))
    }


    const payment = await Payment.create({
        txdId,
        paymentBy: req.user._id,
        courseId
    })

    if (!payment) {
        return next(new appError("payment details not submitted please try again"))
    }

    res.status(200).send({
        status: "success",
        msg: "buyed this course , you will get access to course in few hours"
    })
})






















