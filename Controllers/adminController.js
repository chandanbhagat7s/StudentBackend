const Batch = require("../Models/batchSchema");
const Presenty = require("../Models/presentySchema");
const User = require("../Models/userSchema");
const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");



exports.createStudent = catchAsync(async (req, res, next) => {
    const { userName, email, mobile, parentsNumber } = req.body;

    if (!userName || !email || !mobile || !parentsNumber) {
        return next(new appError("Please fill all the fields", 400))
    }

    const user = await User.create({
        userName, email, mobile, parentsNumber
    })








})


exports.createTeachersBatch = catchAsync(async (req, res, next) => {
    const { batchName, startsOn } = req.body;


    if (!batchName || !startsOn) {
        return next(new appError("please fill all the fields", 400))
    }
    const batch = await Batch.create({
        batchName,
        startsOn,
        createdBy: req.user._id
    })

    if (!batch) {
        return next(new appError("batch not created please try again", 400))
    }

    await User.findByIdAndUpdate(req?.user?._id, {
        teachersBranch: batch._id
    })

    res.status(201).send({
        status: "success",
        msg: "batch created successfully"
    })
})

exports.createTeacher = catchAsync(async (req, res, next) => {
    const { name, email, password, mobile, address } = req.body;
    if (!email || !password || !mobile || !address || !name) {
        return next(new appError("please fill all the fields", 400))
    }

    const teacher = await User.create({
        name,
        email,
        password,
        mobile,
        role: "TEACHER",
        address,
        ofBranch: req.user.teachersBranch
    })

    if (!teacher) {
        return next(new appError("something went wrong please try again", 400))
    }

    const updatebranch = await Batch.findOneAndUpdate({ createdBy: req.user._id }, {
        $push: { teacher: teacher._id }
    }, {
        new: true
    })



    if (!updatebranch) {

        await User.findByIdAndDelete(teacher._id)
        return next(new appError("something went wrong please try again", 400))
    }


    // create presenty data for teachers
    const presenty = await Presenty.create({
        of: teacher._id,
        ofBatch: req.user.teachersBranch
    })

    if (!presenty) {

        return next(new appError("something went wrong please try again", 400))
    }

    await User.findByIdAndUpdate(teacher._id, {
        presentyData: presenty._id
    })


    res.status(200).send({
        status: "success",
        msg: `Teacher's account created successfully  with email as ${email} , password ${password} `
    })



})

exports.markTodayAsHoliday = catchAsync(async (req, ers, next) => {
    const { date, reason } = req.body;
    if (!date, reason) {
        return next(new appError("please provide all the fields", 400));
    }
    const d = new Date()
    if (d.getDate() > date) {
        return next(new appError("you cannot mark holiday for past", 400));

    }
    let holidayObject = {
        month: d.getMonth(),
        date,
        reason
    }
    const updatedholiday = await Batch.findByIdAndUpdate(req.user.teachersBranch, {
        $push: { holidays: holidayObject }
    }, {
        new: true
    })

    if (!updatedholiday) {

        return next(new appError("Holiday not marked please try again", 400));
    }

    res.status(200).send({
        status: "success",
        msg: "holiday marked on date "
    })

})











