const Presenty = require("../Models/presentySchema");
const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");


exports.markPresenty = catchAsync(async (req, res, next) => {
    const { image, status } = req.body;



    /*
    status {
    status : ""
    halfDay : true
    }
    */
    if (!status?.status) {
        return next(new appError("please provide all the details to mark presenty", 400))
    }

    let d = new Date()
    let today = {
        date: d.getDate(),
        datetime: `${d.toLocaleString()}`,
        day: d.getDay(),
        month: d.getMonth(),
        hour: d.getHours()
    }

    if (today.day == 0) {
        return next(new appError("today is sunday you cannot mark presenty  ", 400))
    }



    // if (today.hour >= 12) {
    //     return next(new appError("duration for marking presenty  is over you cannot mark it now  ", 400))
    // }


    let todaysObj = {};

    if (status?.halfDay) {
        todaysObj = {
            date: today.date,
            photo: link,
            status: status.status,
            halfDay: status.halfDay

        }
    } else {
        todaysObj = {
            date: today.date,
            // photo: link,
            status: status.status,

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

    if (!markedPresenty) {
        return next(new appError("failed to mark attendence please try again ", 400))
    }


    res.status(200).send({
        status: "success",
        msg: "attendence marked successfully"
    })




})
















