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
const nodemailer = require("nodemailer");
const cron = require("node-cron");
const mongoose = require("mongoose");

//email authorization
// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.GMAIL_USERNAME,
//         pass: process.env.GMAIL_PASSWORD,
//     },
// });

// cron.schedule("* * * * *", function () {
//     Alarm.find()
//         .populate("_userId").populate("_eventId")
//         .then((response) => {
//             response.forEach((e) => {
//                 let event = e._eventId;
//                 let user = e._userId;
//                 let reminderDate = moment.utc(e.remindTime).seconds(0).milliseconds(0);
//                 let dateToCompare = moment
//                     .utc(new Date)
//                     .seconds(0)
//                     .milliseconds(0);
//                 if (
//                     (reminderDate.isSame(dateToCompare, "second") ||
//                         reminderDate.isBefore(dateToCompare, "second")) &&
//                     !e.sentReminder
//                 ) {
//                     let userEmail = user.email
//                     e.sentReminder = true;
//                     let eventDate = moment.utc(event.start_date).local().format("LLLL");
//                     let mailOptions = {
//                         from: "ourmeetingapp@gmail.com",
//                         to: userEmail,
//                         subject: `reminder email`,
//                         text: `Hi there, this email was automatically sent to you as 
//                         a reminder for the event name ${event.text} on ${eventDate}`
//                     };
//                     transporter.sendMail(mailOptions, function (error, info) {
//                         if (error) {
//                             console.log("error", error);
//                         } else {
//                             console.log("Email successfully sent!");
//                         }
//                     });
//                     e.save();
//                 }
//             });
//         });
// });


module.exports = router;