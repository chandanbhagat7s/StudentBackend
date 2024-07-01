const mongoose = require('mongoose');

const leaveSchema = mongoose.Schema({
    reason: {
        type: String,
        required: [true, "please provide reason for leave 1"],
        minLenght: [30, "please describe it in more words"],
        maxLength: [400, "please describe it in less words"]
    },
    approve: {
        type: Boolean,
        default: false
    },
    submittedOn: {
        type: Date,
        default: Date.now()
    },
    onDate: {
        type: String,
        required: [true, "must provide date "]
    }
})

const Leave = mongoose.model("leave", leaveSchema);

module.exports = Leave;











