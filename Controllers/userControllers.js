const User = require("../Models/userSchema");
const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const jwt = require('jsonwebtoken');


const createTokenSendRes = (id, res, statusCode, data) => {

    let token = jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRIR_IN
    });
    let cookieOptions = {
        expires: new Date(
            Date.now() + 90 * 24 * 60 * 60 * 1000
        ),


        secure: true,
        httpOnly: true,
        sameSite: "None",
        path: "/",
    };
    if (process.env.NODE_ENV == 'production') {

        cookieOptions.secure = true
    }
    res.cookie('jwt', token, cookieOptions);

    // we will set cookies 
    res.status(statusCode).json({
        status: "success",

        msg: "logged in successfully ",
        data,
        token

    })
}


exports.login = catchAsync(async (req, res, next) => {

    const { email, password } = req.body;


    if (!email || !password) {
        return next(new appError("please enter credential for get into in ", 400));
    }
    let user;

    if (email.includes("@")) {

        user = await User.findOne({ email }).select('+password')
    } else {
        user = await User.findOne({ mobile: email }).select('+password')

    }



    if (!user || !await user.correctPass(password, user.password)) {

        return next(new appError("please enter valid email id and password", 400));
    }
    user.password = undefined
    createTokenSendRes(user.id, res, 200, user)

})

exports.signUp = catchAsync(async (req, res, next) => {
    console.log(req.body);
    const { name, email, password, mobile, address } = req.body;
    if (password.length < 8) {
        return next(new appError("please enter password with atleast 8 character", 400))
    }
    const newUser = await User.create({ name, email, password, mobile, address });
    if (!newUser) {
        return next(new appError("something went wrrong  ", 500));

    }
    console.log(newUser);
    newUser.password = undefined;
    createTokenSendRes(newUser._id, res, 201, newUser)
});





exports.logout = function (req, res) {
    console.log("came");
    res.cookie('jwt', 'logout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    })

    res.status(200).json({ status: 'success' })
}



