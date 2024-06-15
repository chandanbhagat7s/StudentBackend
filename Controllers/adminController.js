const Batch = require("../Models/batchSchema");
const Presenty = require("../Models/presentySchema");
const User = require("../Models/userSchema");
const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const multer = require("multer");
const sharp = require("sharp");


const cloudinary = require('cloudinary');
const Event = require("../Models/Events");



// now we will decrease the quality and perform many operation 
const multerStorage = multer.memoryStorage();



// create filterObject
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {

        cb(null, true)
    } else {
        cb(new appError('please upload only image files', 400), false)

    }
}

exports.resizeEventImage = catchAsync(async (req, res, next) => {
    console.log(req.body);
    console.log("file is ", req.files);
    if (req?.files?.length > 0 && !req.files.Images) {
        return next(new appError("please upload a file", 400))
    }




    // images
    req.body.Images = []
    if (req.files.Images.length > 0) {
        let obj = req.files.Images.map((el, i) => {
            const fileName = `${req?.body?.evenName || "name"}-${Date.now()}-${i}.jpeg`
            req.body.Images.push(fileName);
            return sharp(el.buffer).toFormat('jpeg').toFile(`./public/images/${fileName}`)
        })
        await Promise.all(obj)

    }


    next()
})




// destination(for saving files) of multer package 
const uploads = multer(
    {
        storage: multerStorage,
        fileFilter: multerFilter
    }
)

// middleware for uploding images


exports.uploadEventImages = uploads.fields([
    { name: 'Images', maxCount: 3 }
])




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
    const { batchName } = req.body;


    if (!batchName) {
        return next(new appError("please fill all the fields", 400))
    }
    const batch = await Batch.create({
        batchName,
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

exports.markTodayAsHoliday = catchAsync(async (req, res, next) => {
    const { date, reason } = req.body;
    if (!date, !reason) {
        return next(new appError("please provide all the fields", 400));
    }
    const d = new Date()
    if (d.getDate() > date) {
        return next(new appError("you cannot mark holiday for past", 400));

    }



    const listOfHolidays = await Batch.findById(req.user.teachersBranch).select("holidays");


    // if (listOfHolidays.includes()) {

    // }
    let alreadyScheduled = false;
    listOfHolidays?.holidays?.length > 0 && listOfHolidays?.holidays?.map((el) => {
        if (el.date == date && el.month == d.getMonth()) {
            alreadyScheduled = true;
        }
    })

    if (alreadyScheduled) {
        return next(new appError("you have already marked this date as holiday ", 400));
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


exports.todaysEvent = catchAsync(async (req, res, next) => {
    const {
        eventName,
        description,
        links,
        visibility,
    } = req.body;

    // if (!eventName || !description || !visibility) {
    //     return next(new appError("please enter all the fileds to proceed", 400))
    // }
    let media = [];

    console.log(req.body);
    if (req?.body?.Images.length > 0) {
        console.log("CAME");


        let obj = req.body.Images.map((el, i) => {
            console.log(el);
            try {
                let m = cloudinary.v2.uploader.upload(`./public/images/${el}`, {

                    folder: 'community', // Save files in a folder named 

                });
                return m
            } catch (error) {
                console.log("ERR", error);
            }
        })

        obj = await Promise.all(obj)
        // console.log(obj);
        obj.length > 0 && obj.map(el => {
            media.push(el.secure_url)
        })



    }



    const event = await Event.create({
        eventName,
        description,
        links,
        media,
        visibility,
    })

    res.status(201).send({
        status: "success",
        msg: "event created "
    })


})


exports.getAllEvent = catchAsync(async (req, res, next) => {
    const events = await Event.find({})

    res.status(200).send({
        status: "success",
        events: events
    })
})








