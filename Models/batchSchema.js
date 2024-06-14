const mongoose = require('mongoose');

const batchSchema = mongoose.Schema({
    batchName: {
        type: String,
        required: [true, "must provide batch name"]
    },
    createdBy: {
        type: mongoose.mongo.ObjectId,
        ref: "user",
        required: [true, "must have a owner of batch"]
    },
    createdOn: {
        type: Date,
        default: Date.now()
    },
    startsOn: {
        type: Date,
        required: [true, "must provide batch name"]
    },
    student: {
        type: [mongoose.mongo.ObjectId],
        ref: "user"

    },
    teacher: {
        type: [mongoose.mongo.ObjectId],
        ref: "user"

    },
    holidays: {
        type: [Object],

    }


})

const Batch = mongoose.model("batch", batchSchema)

module.exports = Batch;