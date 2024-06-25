
const mongoose = require('mongoose');


const notifySchema = mongoose.Schema({
    to: {
        type: mongoose.mongo.ObjectId,
        ref: "user"
    },
    toBatch: {
        type: mongoose.mongo.ObjectId,
        ref: "batch"
    },
    message: {
        type: String,
        required: [true, "Please enter some message to notify"]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})


const Notify = mongoose.model("notify", notifySchema)

module.exports = Notify;










