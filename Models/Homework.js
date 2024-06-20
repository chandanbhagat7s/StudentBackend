const mongoose = require('mongoose');

const homeworkSchema = mongoose.Schema({

    description: {
        type: String,
        // required: [true, "must provide description for homework"]
    },
    media: {
        type: [String]
    },
    createdOn: {
        type: Date,
        default: Date.now()
    },
    category: {
        type: String,
        enum: ["BEGINNER", "INTERMEDIATE", "ADVANCE"],
        // required: [true, "must provide for which group it is created for"]
    },
    createdBy: {
        type: mongoose.mongo.ObjectId,
        required: [true, "must provide who is the creator"]

    }

})

const Homework = mongoose.model("homework", homeworkSchema);
module.exports = Homework;





























