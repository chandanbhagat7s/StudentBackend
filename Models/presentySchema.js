

const mongoose = require('mongoose');


const presentySchema = mongoose.Schema({
    of: {
        type: mongoose.mongo.ObjectId,
        required: [true, "this presenty must belong to some user "],
        ref: "user"
    },
    ofBatch: {
        type: mongoose.mongo.ObjectId,
        required: [true, "this presenty must belong to some user "],
        ref: "batch"
    },
    January: {
        type: [Object],

    }
    , February: {
        type: [Object],
    }
    , March: {
        type: [Object],
    }
    , April: {
        type: [Object],
    }
    , May: {
        type: [Object],
    }
    , June: {
        type: [Object],
    }
    , July: {
        type: [Object],
    }
    , August: {
        type: [Object],
    }
    , September: {
        type: [Object],
    }
    , October: {
        type: [Object],
    }
    , November: {
        type: [Object],
    }
    , December: {
        type: [Object],
    },
    lastMarkedPresenty: {
        type: String
    }
})

const Presenty = mongoose.model('presenty', presentySchema);

module.exports = Presenty;





































