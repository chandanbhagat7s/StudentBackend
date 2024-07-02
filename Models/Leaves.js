const mongoose = require('mongoose');

const leaveSchema = mongoose.Schema({
    reason: {
        type: String,
        required: [true, "please provide reason for leave 1"],
        minLenght: [30, "please describe it in more words"],
        maxLength: [400, "please describe it in less words"]
    },
    approve: {
        type: String,
        default: "NOACTON",
        enum: ["NOACTON", "APPROVED", "NOTAPPROVED"]
    },
    submittedOn: {
        type: Date,
        default: Date.now()
    },
    onDate: {
        type: Date,
        required: [true, "must provide date "]
    },
    createdBy: {
        type: mongoose.mongo.ObjectId,
        ref: "user"
    }
})

const Leave = mongoose.model("leave", leaveSchema);

module.exports = Leave;











