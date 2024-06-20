const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({

    createdAt: {
        type: Date,
        default: Date.now()
    },
    description: {
        type: String,
        required: [true, "event must have some description "]
    },
    links: {
        type: String,
    },
    media: {
        type: [String]
    },

})


const Event = mongoose.model("event", eventSchema);

module.exports = Event;















