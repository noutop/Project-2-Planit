const express = require("express");
const router = express.Router();
// Require user model
const User = require("../models/user.model");
// Require token model
const Token = require("../models/Token.model");
const randomToken = require("random-token");
// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
// Add passport
const passport = require("passport");
// add express-validation
const {
  validationResult
} = require("express-validator");
// add middleware
const signUpValidation = require("../helpers/middlewares").signUpValidation;
// nodemailer
const nodemailer = require("nodemailer");
const axios = require('axios')


// email authorization
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_PASSWORD,
  },
});

//render home page
router.get("/", (req, res) => {
  res.render("auth/signupForm");
});

// signup, signUpValidation in the helpers folder
router.post("/signup", signUpValidation, (req, res) => {
  // get the validation errors 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("auth/signupForm", {
      errors: errors.array(),
    });
  }
  // save new user 
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(req.body.password, salt);
  let user = new User({
    email: req.body.email,
    password: hashPass,
    image: `https://api.adorable.io/avatars/59/${req.body.email}`,
  });
  return user.save().then((user) => {
    // create new token for the user to verify its email 
    const token = new Token({
      _userId: user._id,
      _eventId: user._id,
      invitedUserId: user._id,
      token: randomToken(16),
    });
    return token.save()
  }).then((token) => {
    // send a verification email
    const mailOptions = {
      from: "ourmeetingapp@gmail.com",
      to: req.body.email,
      subject: "Account Verification Token",
      // check why it's not working
      html: `<p>Hi there,<br></br>
    To verify your email, simply click below.</p><br>
    <a href= "${process.env.EMAIL_HOST}confirmations/${token.token}">verify your email</a><br>
    <h4>Enjoy<br>
    The Plan-It Team</h4>`
    };
    // render the res after signup
    transporter.sendMail(mailOptions, function (err) {
      if (err) {
        return res.send({
          msg: err.message,
        });
      }
      let userEmail = req.body.email
      res.render("auth/emailConfirmation", {
        userEmail: userEmail
      });
    });
  });
})


//render personalAccount after email verification
router.get("/confirmations/:token", (req, res) => {
  console.log(req.params);
  Token.findOne({
    token: req.params.token,
  })
    .then((token) => {
      return User.findOne({
        _id: token._userId
      })
    }).then((user) => {
      user.isVerified = true;
      return user.save();
    })
    .then((user) => {
      req.login(user, () =>
        res.redirect("/personalAccount")
      );
    });
});


//Login
router.get("/login", (req, res) => {
  res.render("auth/signupForm", {
    errorArr: req.flash("error")
  });
});
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/personalAccount",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true,
  })
);

//Logout
router.get("/logout", (req, res) => {
  console.log("user", req.user);
  req.logOut();
  let message = "Thank you for using our app"
  res.render("auth/signupForm", {
    message: message
  });
});




module.exports = router;