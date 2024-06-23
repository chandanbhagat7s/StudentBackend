const Batch = require("../Models/batchSchema");
const Presenty = require("../Models/presentySchema");
const User = require("../Models/userSchema");
const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const multer = require("multer");
const sharp = require("sharp");
const fs = require('fs');

const cloudinary = require('cloudinary');
const Event = require("../Models/Events");
const Course = require("../Models/Course");
const Homework = require("../Models/Homework");
const { log } = require("console");



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

exports.resizeHomeworkFiles = catchAsync(async (req, res, next) => {
    console.log(req.body);
    console.log("file is ", req.files);
    if (req?.files?.length > 0 && !req.files.Files) {
        return next(new appError("please upload a file", 400))
    }




    // images
    req.body.Files = []
    if (req.files.Files.length > 0) {
        let obj = req.files.Files.map((el, i) => {
            const extension = el.mimetype.split("/")[1];


            const fileName = `${"homework"}-${Date.now()}-${i}.${extension}`
            req.body.Files.push(fileName);
            return sharp(el.buffer).toFile(`./public/homework/${fileName}`)
        })
        await Promise.all(obj)

    }


    next()
})




exports.resizeEventImage = catchAsync(async (req, res, next) => {
    console.log(req.body);
    console.log("file is ", req.files, Boolean(req?.files.Images?.length));

    if (!Boolean(req?.files.Images?.length)) {
        next()
        return
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
const uploadsEvents = multer(
    {
        storage: multerStorage,
        fileFilter: multerFilter
    }
)
const uploadshomework = multer(
    {
        storage: multerStorage,
    }
)

// middleware for uploding images


exports.uploadEventImages = uploadsEvents.fields([
    { name: 'Images', maxCount: 3 }
])

exports.uploadHomeworkFiles = uploadshomework.fields([
    { name: 'Files', maxCount: 5 }
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
    const { batchName, batchAddress } = req.body;


    if (!batchName || !batchAddress) {
        return next(new appError("please fill all the fields", 400))
    }
    const batch = await Batch.create({
        batchName,
        batchAddress,
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
    const { name, email, password, mobile, address, startingDate, teacherSalary, teachercategory, batchName } = req.body;
    if (!email || !password || !mobile || !address || !name || !startingDate || !teacherSalary || !teachercategory || !batchName) {
        return next(new appError("please fill all the fields", 400))
    }

    const batch = await Batch.findOne({
        batchName
    })


    console.log("for batch", batch);

    if (batch == null) {
        return next(new appError("please provide valid batch name to create a teacher", 400))
    }

    if (mobile.length < 10 && mobile.length > 10) {
        return next(new appError("please enter valid 10 digit number", 400))
    }



    const teacher = await User.create({
        name,
        email,
        password,
        mobile,
        role: "TEACHER",
        address,
        ofBranch: batch._id,
        startingDate,
        teacherSalary,
        teachercategory,
        pass: password
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
    let d = new Date()

    // create presenty data for teachers
    const presenty = await Presenty.create({
        of: teacher._id,
        ofBatch: batch._id,
        lastMarkedPresenty: ``
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

exports.getAllBatches = catchAsync(async (req, res, next) => {

    const batches = await Batch.find({});



    res.status(200).send({
        status: "success",
        batches
    })



})

exports.getAllBatchesName = catchAsync(async (req, res, next) => {

    const batches = await Batch.find({}).select("_id batchName");



    res.status(200).send({
        status: "success",
        batches
    })



})

exports.getBatchById = catchAsync(async (req, res, next) => {

    const id = req.params.batchId;
    if (!id) {
        return next(new appError("please provide id of batch ", 400))
    }

    const batche = await Batch.findById(id).populate("teacher", "name pass email mobile address presentyData teacherSalary teachercategory startingDate _id")



    res.status(200).send({
        status: "success",
        batche
    })



})


exports.getAllTeachers = catchAsync(async (req, res, next) => {

    const id = req.params.branchId;
    if (!id) {
        return next(new appError("please provide id", 400))
    }
    const allTeachersData = await User.find({
        ofBranch: id
    })


    res.status(200).send({
        status: "success",
        allTeachersData
    })


})

exports.updateteacher = catchAsync(async (req, res, next) => {
    const {
        address,
        startingDate,
        teachercategory,
        teacherSalary,
        email
    } = req.body;





    const teacher = await User.findOneAndUpdate({
        email
    }, {
        address,
        startingDate,
        teachercategory,
        teacherSalary,
    }, {
        new: true,
        runValidators: true
    })

    if (!teacher) {
        return next(new appError("teacher not updated please try again", 400))
    }

    res.status(200).send({
        status: "success",
        msg: "teacher updated successfully"
    })




})




exports.deleteTeacher = catchAsync(async (req, res, next) => {
    const {

        email
    } = req.body;

    if (!email) {
        return next(new appError("please provide teachers details to delete", 400))
    }





    const teacher = await User.findOne({
        email
    })



    // first deleting presenty sheet
    // await Presenty.findByIdAndDelete(teacher.presentyData) 

    await Batch.findByIdAndUpdate(teacher.ofBranch, {
        $pull: { teacher: teacher._id }
    })

    // // now deleting the teacher
    await User.findByIdAndDelete(teacher._id)


    res.status(200).send({
        status: "success",
        msg: "teacher updated successfully"
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
        description,
        links,
    } = req.body;
    console.log("came inside");

    if (!description) {
        return next(new appError("please enter all the fileds to proceed", 400))
    }
    let media = [];

    console.log(req.body);
    if (req.body?.Images?.length > 0) {
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

        obj.length > 0 && req.body.Images.map((el, i) => {
            fs.unlink(`./public/images/${el}`, (err) => {
                if (err) {
                    console.log("err in del");
                }
                // console.log("Del");
            })
        })



    }



    const event = await Event.create({

        description,
        links,
        media,

    })

    if (!event) {
        return next(new appError("event not created please try again", 400))
    }

    res.status(201).send({
        status: "success",
        msg: "event created "
    })


})


exports.getAllEvent = catchAsync(async (req, res, next) => {
    const events = await Event.find({})

    res.status(200).send({
        status: "success",
        events: events.reverse()
    })
})


exports.createStudent = catchAsync(async (req, res, next) => {
    const { name, email, password, mobile, address } = req.body;
    if (!email || !password || !mobile || !address || !name) {
        return next(new appError("please fill all the fields", 400))
    }

    const student = await User.create({
        name,
        email,
        password,
        mobile,
        role: "STUDENT",
        address,
        ofBranch: req.user.studentBranch,


    })

    if (!student) {
        return next(new appError("something went wrong please try again", 400))
    }


    // finding the branch
    // const course= await Course.findByIdAndUpdate(courseId,{
    //     $push : {students : student._id }
    // },{
    //     new : true
    // })

    // if (!course) {
    //     await User.findByIdAndDelete(student._id)
    //     return next(new appError("something went wrong please try again", 400))
    // }



    const updatebranch = await Batch.findOneAndUpdate({ createdBy: req.user._id }, {
        $push: { student: student._id }
    }, {
        new: true
    })



    if (!updatebranch) {

        await User.findByIdAndDelete(student._id)
        return next(new appError("something went wrong please try again", 400))
    }


    // create presenty data for teachers
    const presenty = await Presenty.create({
        of: student._id,
        ofBatch: req.user.studentBranch
    })

    if (!presenty) {

        return next(new appError("something went wrong please try again", 400))
    }

    await User.findByIdAndUpdate(student._id, {
        presentyData: presenty._id
    })


    res.status(201).send({
        status: "success",
        msg: `student's account created successfully  with email as ${email} , password ${password} `
    })



})



exports.createCourse = catchAsync(async (req, res, next) => {
    const { name, price, description, category } = req.body;
    if (!name || !price || !description || !category) {
        return next(new appError("please provide all the fields ", 400))
    }

    if (category !== "BEGINNER" || category !== "INTERMEDIATE" || category !== "ADVANCE") {
        return next(new appError("please enter valid course category", 400))

    }
    const course = await Course.create({
        name, price, description, category
    })

    if (!course) {
        return next(new appError("failed to create course please try again", 400))
    }

    res.status(201).send({
        status: "success",
        message: "course created successfully"
    })


})




exports.createHomework = catchAsync(async (req, res, next) => {

    const { category, title, description } = req.body;
    // if (!category || !title || !description) {
    //     return next(new appError("please enter all the fields", 400))
    // }

    let media = []
    if (req?.body?.Files.length > 0) {
        console.log("CAME");


        let obj = req.body.Files.map((el, i) => {
            console.log(el);
            try {
                let m = cloudinary.v2.uploader.upload(`./public/homework/${el}`, {

                    folder: 'homework', // Save files in a folder named 

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

        obj.length > 0 && req.body.Files.map((el, i) => {
            fs.unlink(`./public/homework/${el}`, (err) => {
                if (err) {
                    console.log("err in del");
                }
                // console.log("Del");
            })
        })



    }


    // if (category !== "BEGINNER" || category !== "INTERMEDIATE" || category !== "ADVANCE") {
    //     return next(new appError("please enter valid course category", 400))

    // }

    const hw = await Homework.create({
        media,
        // description,
        // category,
        createdBy: req.user._id

    })

    if (!hw) {
        return next(new appError("homework not created please try again", 400))

    }

    res.status(200).send({
        status: "success",
        msg: `homework posted for category : ${category}`
    })


})





exports.createStudentsBatch = catchAsync(async (req, res, next) => {
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
        studentBranch: batch._id
    })

    res.status(201).send({
        status: "success",
        msg: "batch created successfully"
    })





})


exports.markStudentsPresenty = catchAsync(async (req, res, next) => {
    const { data } = req.body;

    if (!data || data?.students?.length <= 0) {
        return next(new appError("please select the students", 400))
    }
    let d = new Date()
    let today = {
        date: d.getDate(),
        datetime: `${d.toLocaleString()}`,
        day: d.getDay(),
        month: d.getMonth(),
        hour: d.getHours()
    }
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",];

    let todaysObj = {
        date: today.date,
        status: "present",

    }
    const thisMonthName = monthNames[today.month]
    console.log(thisMonthName);
    const filter = { of: { $in: req.body.data.students } };

    const update = { $push: { [thisMonthName]: todaysObj } }

    const updatedStatus = await Presenty.updateMany(filter,
        update
    )
    if (updatedStatus.modifiedCount == req?.body?.data?.students?.length) {
        res.status(200).send({
            status: "success",
            msg: "presenty marked for all the selected student"
        })
    }













})
