const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, " name must be provided for course"]
    },
    price: {
        type: Number,
        required: [true, "course price must be provided"]
    },

    description: {
        type: String,
        required: [true, "course description must be provided"]
    },

    category: {
        type: String,
        enum: ["BEGINNER", "INTERMEDIATE", "ADVANCE"],
        required: [true, "must provide category of course"]
    },
    students: {
        type: [mongoose.mongo.ObjectId],
        ref: "user"
    },
    homework: {
        type: mongoose.mongo.ObjectId,
        ref: "homework"
    }




})

const Course = mongoose.model("course", courseSchema);

module.exports = Course;

