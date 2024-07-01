const mongoose = require('mongoose');

const batchSchema = mongoose.Schema({
    batchName: {
        type: String,
        unique: true,
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
    batchAddress: {
        type: String,
        required: [true, "please provide address of batch"]
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

    },
    todaysPresentyMarked: {
        type: [mongoose.mongo.ObjectId],
        ref: "user"
    },
    isOf: {
        type: String,

    }


})

const Batch = mongoose.model("batch", batchSchema)

module.exports = Batch;