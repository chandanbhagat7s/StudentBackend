const appError = require("../utils/appError")

exports.giveAccessTo = (...roles) => {
    return (req, res, next) => {

        if (!roles.includes(req.user.role)) {
            return next(new appError('access denide', 403))
        }
        next()

    }
}