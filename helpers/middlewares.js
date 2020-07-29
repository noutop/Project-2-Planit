const {
  check
} = require("express-validator");
const User = require("../models/user.model");
let signUpValidation = [
  check("email")
  .isEmail().withMessage("Email is not valid")
  .custom((email) => {
    return User.findOne({
      email: email,
    }).then((user) => {
      if (user) {
        throw new Error("E-mail already in use");
      }
    });
  }),
  check("password")
  .isLength({
    min: 5,
  })
  .withMessage("Password must be at least 5 chars long"),
];

let checkVerifiedUser = (req, res, next) => {
  console.log(req.user.isVerified);
  if (req.user.isVerified) {
    next();
  } else {
    let message = "Please verify your email to login to your account";
    res.render("auth/signupForm", {
      message: message,
    });
  }
};

module.exports = {
  signUpValidation: signUpValidation,
  checkVerifiedUser: checkVerifiedUser,
};