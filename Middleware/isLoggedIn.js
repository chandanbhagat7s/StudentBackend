const User = require("../Models/userSchema");
const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const jwt = require('jsonwebtoken');

const { promisify } = require('util');

exports.isLoggedIn = catchAsync(async (req, res, next) => {
    // console.log("req is ", req);
    // bringin out the token from the reqst header

    // console.log("header is", req.headers);
    let token;
    if (req?.headers?.authorization && req?.headers?.authorization?.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req?.cookies?.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        return next(new appError('please login to get access', 401))
    }

    const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY)
    const freshUser = await User.findById(decode.id)
    if (!freshUser) {
        return next(new appError('the user do  not exist ', 401))
    }
    if (await freshUser.changedPasswords(decode.iat)) {
        return next(new appError('password is changed need to login again', 401))
    }

    // future use 
    // console.log(freshUser);
    req.user = freshUser;

    next()

})