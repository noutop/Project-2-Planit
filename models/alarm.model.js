const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const alarmSchema = new Schema({
    _userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    _eventId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Event'
    },
    sentReminder: {
        type: Boolean,
        default: false
    },
    remindTime: {
        type: Date
    },
    duration: {
        type: String
    }
});


const Alarm = mongoose.model("Alarm", alarmSchema);
module.exports = Alarm;