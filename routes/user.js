const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js");
const passport = require("passport");
const { redirecturl } = require("../middleware.js");
const userController = require("../controllers/users.js");

router.route("/signup")
   .get(userController.userSignUpRoute)
   .post(wrapasync(userController.userSignUp));

router.route("/login")
   .get(userController.userLogInRoute)
   .post(redirecturl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), userController.logIn);

router.get("/logout", userController.userLogOut);

module.exports = router;