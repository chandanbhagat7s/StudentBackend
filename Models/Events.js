const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    eventName: {
        type: String,
        // required: [true, "creating an event , must have a name"],

    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    description: {
        type: String,
        // required: [true, "event must have some description "]
    },
    links: {
        type: [String],
    },
    media: {
        type: [String]
    },
    visibility: {
        type: String,
        enum: ["EVERYONE", "OUR_MEMBERS"],
        // required: [true, "visibility must be defined"]
    }
})


const Event = mongoose.model("event", eventSchema);

module.exports = Event;















