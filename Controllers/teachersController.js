const multer = require("multer");
const Batch = require("../Models/batchSchema");
const Presenty = require("../Models/presentySchema");
const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const cloudinary = require('cloudinary');
const sharp = require("sharp");

const fs = require('fs');


const multerStorage = multer.memoryStorage();



// create filterObject
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {

        cb(null, true)
    } else {
        cb(new appError('please upload only image files', 400), false)

    }
}

exports.resizeImage = catchAsync(async (req, res, next) => {
    console.log("type is ", req.body);
    console.log("file is ", req.file);
    if (!req.file) {
        return next(new appError("please upload a file", 400))
    }

    const d = new Date()
    // cover image
    req.body.image = `${req.user._id}-${d.getDate()}.jpg`
    await sharp(req.file.buffer).toFormat('jpeg').toFile(`public/user/${req.body.image}`)





    next()


})


// destination(for saving files) of multer package 
const uploads = multer(
    {
        storage: multerStorage,
        fileFilter: multerFilter
    }
)

exports.uploadImages = uploads.single('image')




exports.markPresenty = catchAsync(async (req, res, next) => {

    // getting the details of holiday



    let status = req.body.halfDay == 'true' ? true : false



    let d = new Date()
    let today = {
        date: d.getDate(),
        datetime: `${d.toLocaleString()}`,
        day: d.getDay(),
        month: d.getMonth(),
        hour: d.getHours()
    }

    let { holidays } = await Batch.findById(req.user.ofBranch).select("holidays")
    let isTodayHoliday = false;
    holidays.length > 0 && holidays.map((h) => {
        if (h.date == today.date && h.month == today.month) {
            isTodayHoliday = true
        }
    })
    if (isTodayHoliday) {

        return next(new appError("today holiday is schedule you cannot mark presenty  ", 400))
    }
    if (today.day == 0) {
        return next(new appError("today is sunday you cannot mark presenty  ", 400))
    }



    if (today.hour >= 14) {
        return next(new appError("duration for marking presenty  is over you cannot mark it now  ", 400))
    }
    const result = await cloudinary.v2.uploader.upload(`public/user/${req.body.image}`, {
        folder: 'chordz', // Save files in a folder named 
        // width: 250,
        // height: 250,
        // gravity: 'faces', // This option tells cloudinary to center the image around detected faces (if any) after cropping or resizing the original image
        // crop: 'fill',
    });
    console.log(result);

    let todaysObj = {};



    if (status) {
        todaysObj = {
            date: today.date,
            photo: result.secure_url,
            status: "present",
            halfDay: true

        }
    } else {
        todaysObj = {
            date: today.date,
            photo: result.secure_url,
            status: "present",

        }
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




    let presentyData = await Presenty.findById(req.user.presentyData).select(`${monthNames[today.month]}`)
    console.log("data is ", presentyData, today.month);
    let onlyMonth = presentyData[monthNames[today.month]]


    onlyMonth.push(todaysObj)

    presentyData[today.month] = onlyMonth



    let markedPresenty = await Presenty.findByIdAndUpdate(req?.user?.presentyData, presentyData, {
        new: true
    })

    // delete the file form server
    fs.unlink(`public/user/${req.body.image}`, (err) => {

        console.log('path/file.txt was deleted');
    })

    if (!markedPresenty) {
        return next(new appError("failed to mark attendence please try again ", 400))
    }


    res.status(200).send({
        status: "success",
        msg: "attendence marked successfully"
    })




})

exports.submitTodaysTask = catchAsync(async (req, res, next) => {

    const { description } = req.body;
    // if (!description) {
    //     return next(new appError("please enter some text that u have done today", 400))
    // }

    const d = new Date()
    let month = d.getMonth()
    console.log(d.getDate());
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
    const todaysData = await Presenty.aggregate([
        {
            $match: {
                of: req.user._id,

            },
        },
        {
            $group: {
                _id: `$${[monthNames[month]]}`
            }
        },



    ])
        .unwind({
            path: "$_id"
        }).match({
            "_id.date": d.getDate()
        })

    // console.log(todaysData);
    if (todaysData.length == 0) {
        return next(new appError(new appError("please mark the attandence first to submit task ", 400)))
    }

    let beforeTaskdata = todaysData[0]._id
    // console.log(beforeTaskdata);
    beforeTaskdata.description = description










    let presentyData = await Presenty.findById(req.user.presentyData).select(`${monthNames[d.getMonth()]}`)
    // console.log("data is ", presentyData, d.getMonth());
    let onlyMonth = presentyData[monthNames[d.getMonth()]]
    console.log("data of monthe", onlyMonth);


    // get todays data 

    let newDataWithDesc = onlyMonth.map(el => {
        if (el.date == d.getDate()) {
            console.log("found", el, description);
            el = { ...el, description }
        }

        return el
    })

    console.log("new data ", newDataWithDesc);


    presentyData[monthNames[d.getMonth()]] = newDataWithDesc
    console.log("new [present data] ", presentyData);



    let markedPresenty = await Presenty.findByIdAndUpdate(req?.user?.presentyData, presentyData, {
        new: true
    })

    if (!markedPresenty) {
        return next(new appError("task not submitted please try again", 500))
    }

















    res.status(200).send({
        status: "success",
        message: "task submitted successfully "
    })


})
















