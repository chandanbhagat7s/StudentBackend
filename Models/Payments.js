const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
    txdId: {
        type: String,
        required: [true, "payment must have transaction id "],
    },
    paymentBy: {
        type: mongoose.mongo.ObjectId,
        ref: "user",
        required: [true, "payment must belong to specific user"]
    },
    courseId: {
        type: mongoose.mongo.ObjectId,
        ref: "course",
        required: [true, "payment must belong to specific course"]

    },
    assigned: {
        type: Boolean,
        default: false
    },
    courseAssignedId: {
        type: mongoose.mongo.ObjectId,
        ref: "course"
    }

})

const Payment = mongoose.model("payment", paymentSchema);

module.exports = Payment;




















