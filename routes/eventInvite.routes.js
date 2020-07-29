const express = require("express");
const router = express.Router();
// Require user model
const User = require("../models/user.model");
//require event model
const Event = require("../models/Events.model");
// require moment.js
const momentTimezone = require("moment-timezone");
const moment = require("moment");
const axios = require("axios");
const nodemailer = require("nodemailer");
const Token = require("../models/Token.model");
const randomToken = require("random-token");


// email authorization
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD,
    },
});

router.get("/invite", (req, res) => {
    console.log(req.user);
    let userEmail = req.user.email.split("@");
    let userName = userEmail[0];
    let userImg = req.user.image
    let inviteList = [];
    let alarmList = []
    Event.find().then((dataToSend) => {
        //console.log('Data',dataToSend);
        dataToSend.forEach((e) => {
            //console.log(e._userId);
            if (e._userId == req.user.id) {
                inviteList.push(e);
            };
            if (e.attendList.includes(req.user.id)) {
                alarmList.push(e);
            }
        });
        console.log("outPut: inviteList", inviteList)
        console.log("outPut: alarmList", alarmList)
        res.render("auth/alert-invite", {
            inviteList: inviteList,
            alarmList: alarmList,
            message: req.query.valid,
            userName: userName,
            userImg: userImg,

        });
    });
})


router.post("/invite", (req, res) => {
    let userName = (req.user.email).split("@");
    console.log("req.body", req.body.email);
    if (req.body.email) {
        User.find({
                email: req.body.email
            })
            .then((users) => {
                users.forEach((user) => {
                    const token = new Token({
                        _eventId: req.body.event,
                        _userId: req.user.id,
                        invitedUserId: user._id,
                        token: randomToken(16),
                    });
                    return Promise.all([token.save(), Event.findOne({
                        _id: req.body.event
                    })]).then((response) => {
                        let token = response[0];
                        let event = response[1];
                        let newTextarea = event.text.split("&")
                        let eventStart = moment.utc(event.start_date).local().format("LLLL");
                        let eventEnd = moment.utc(event.end_date).local().format("LLLL");
                        const mailOptions = {
                            from: "ourmeetingapp@gmail.com",
                            to: user.email,
                            subject: "Invitation",
                            html: `<p>Hi there,<br>You've been invited by <b>${userName[0]}</b> to an event<b> ${newTextarea[0]} on ${eventStart} to ${eventEnd}</b><br>
                To accept this invitation, simply click below.</p><br>
                <a href= "${process.env.EMAIL_HOST}invitationConfirmation/${token.token}"><b>I accept</b><a><br>
                <h4>Enjoy<br>
                The Plan-It Team</h4>
                `
                        };
                        transporter.sendMail(mailOptions, function (err) {
                            if (err) {
                                return res.send({
                                    msg: err.message,
                                });
                            }
                        });
                    });
                });
                res.render("auth/invitationConfirmation", {
                    inviteEmail: req.body.email,
                });
            });
    } else {
        let message = "You can't invite no one to your event"
        res.render("auth/invitationConfirmation", {
            message: message,
        });
    }
});


router.get("/invitationConfirmation/:token", (req, res) => {
    Token.findOne({
            token: req.params.token
        }).populate("_userId").populate("invitedUserId").populate("_eventId")
        .then((token) => {
            let invitedUserName = (token.invitedUserId.email).split("@");
            console.log("outPut: invitedUserName", invitedUserName)
            let newTextarea = (token._eventId.text).split("&");
            const mailOptions = {
                from: "ourmeetingapp@gmail.com",
                to: token._userId.email,
                subject: "Invitation Confirmation",
                html: `<p>Hi there, ${invitedUserName[0]} has accepted your invitation for the ${newTextarea[0]} event .</p><br>
        <h4>Enjoy<br>
        The Plan-It Team</h4>
        `
            };
            transporter.sendMail(mailOptions, function (err) {
                if (err) {
                    return res.send({
                        msg: err.message,
                    });
                }
            });
            return Event.findOneAndUpdate({
                _id: token._eventId
            }, {
                $addToSet: {
                    attendList: token.invitedUserId
                }
            }, {
                new: true
            })
        }).then(() => {
            res.redirect("/");
        });
});


module.exports = router;