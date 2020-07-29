const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  attendList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  text: {
    type: String
  },
  start_date: {
    type: Date
  },
  end_date: {
    type: Date
  },
  id: {
    type: String
  },
  remind: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Alarm"
  }]
});


const Event = mongoose.model("Event", eventSchema);
module.exports = Event;