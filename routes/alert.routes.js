const express = require("express");
const router = express.Router();
// Require user model
const User = require("../models/user.model");
//require event model
const Event = require("../models/Events.model");

const Alarm = require("../models/alarm.model");
// require moment.js
const momentTimezone = require("moment-timezone");
const moment = require("moment");




router.post("/reminder", (req, res) => {
    if (req.body.events) {
        Promise.all([Event.findOne({
            _id: req.body.events
        }), Alarm.findOne({
            _userId: req.user.id,
            _eventId: req.body.events
        }

        )]).then((response) => {
            console.log("response", response);
            let event = response[0]
            let alarmFound = response[1]
            let remindTime;
            if (!response[1]) {
                console.log("event", event.start_date);
                switch (req.body.alertOption) {
                    case "1-day":
                        console.log("day");
                        remindTime = moment(event.start_date).subtract(1, "day");
                        break;
                    case "6-hours":
                        console.log("hour");
                        remindTime = moment(event.start_date).subtract(6, "hour");
                        break;
                    case "2-days":
                        console.log("days");
                        remindTime = moment(event.start_date).subtract(2, "day")
                        break;
                }
                const alarm = new Alarm({
                    _eventId: req.body.events,
                    _userId: req.user.id,
                    sentReminder: false,
                    remindTime: remindTime,
                    duration: req.body.alertOption,
                });
                return alarm.save()
            } else {
                console.log("event", event.start_date);
                switch (req.body.alertOption) {
                    case "1-day":
                        console.log("day");
                        remindTime = moment(event.start_date).subtract(1, "day");
                        break;
                    case "6-hours":
                        console.log("hour");
                        remindTime = moment(event.start_date).subtract(6, "hour");
                        break;
                    case "2-days":
                        console.log("days");
                        remindTime = moment(event.start_date).subtract(2, "day")
                        break;
                }
                alarmFound._eventId = req.body.events
                alarmFound._userId = req.user.id
                alarmFound.sentReminder = false
                alarmFound.remindTime = remindTime
                alarmFound.duration = req.body.alertOption
                return alarmFound.save()
            }
        }).then((alarm) => {
            return alarm.populate("_eventId").populate("_userId").execPopulate()
        }).then((alarm) => {
            console.log("alarm", alarm);
            let eventDate = moment.utc(alarm._eventId.start_date).local().format("LLLL");
            let message = `An alarm has been added to your ${alarm._eventId.text} event on ${eventDate} befor ${alarm.duration}`
            res.redirect("/invite?valid=" + message);

        })
    } else {
        let message = `Oooops,You don't have any events to set an alarm for`
        res.redirect("/invite?valid=" + message);
    }

});


module.exports = router;