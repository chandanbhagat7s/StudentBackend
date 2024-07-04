
const mongoose = require("mongoose")
const bcrypt = require('bcryptjs');
// creating schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name should be provided"],
        minlength: [5, 'Username must be at least 5 characters'],
        maxlength: [28, 'Username cannot exceed 15 characters']
    },
    email: {
        unique: true,
        type: String,
        required: [true, "email should be provided"],

    },
    mobile: {
        type: String,
        unique: true,
        required: true,
        minlength: [10, 'number to be of 10 digit'],
        maxlength: [11, 'mobile number cannot exceed more than 11 character']
    },
    address: {
        type: String,
        minlength: [10, 'address to be atleat of 10 character long'],
        maxlength: [70, 'address cannot exceed more than 70 character'],
        required: [true, "user must belong to some address"]
    },
    role: {
        type: String,
        enum: ["TEACHER", "STUDENT", "USER"],
        default: "USER",
        // required: [true, "user must have some role"]
    },
    password: {
        type: String,
        required: [true, "user must provide password "],
        select: false
    },

    parentsNumber: {
        type: String,
    },
    teachersBranch: {
        type: [mongoose.mongo.ObjectId],
        ref: 'batch'
    },
    studentBranch: {
        type: [mongoose.mongo.ObjectId],
        ref: 'batch'
    },
    startingDate: {
        type: Date,

    },
    teachercategory: {
        type: String
    },
    teacherSalary: {
        type: Number
    },
    ofBranch: {
        type: mongoose.mongo.ObjectId,
        ref: 'batch'
    },
    presentyData: {
        type: mongoose.mongo.ObjectId,
        ref: "presenty"
    },
    courseData: {
        type: mongoose.mongo.ObjectId,
        ref: "course"
    },
    pass: {
        type: String,

    },







})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next()
    }

    this.password = await bcrypt.hash(this.password, 12);

    next()

})



userSchema.methods.correctPass = async function (inputpassword, password) {
    let t = await bcrypt.compare(inputpassword, password)
    console.log(t);
    return t
}

userSchema.methods.IsPasswordChanged = function (time) {
    if (this.passwordChanged) {
        let timeChanged = this.passwordChanged.getTime() / 1000;

        return time < timeChanged
    }

    return false;
}


userSchema.methods.changedPasswords = async function (jwttokentime) {
    if (this.changedPasswodTime) {
        const change = parseInt(this.changedPasswodTime.getTime() / 1000, 10)
        // console.log(jwttokentime, this.changedPasswodTime.getTime() / 1000);
        // console.log(jwttokentime, change);
        // console.log(jwttokentime < change);
        return jwttokentime < change
    }


    // if user has not change the password at least once 
    return false;
}

// now creating model out of schema 



const User = mongoose.model('user', userSchema);
module.exports = User;














