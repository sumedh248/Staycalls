const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapasync = require("../utils/wrapasync.js");
const passport = require("passport");

router.get("/signup", (req, res) => {
   res.render("user/signup.ejs");
});

router.post("/signup", wrapasync(async (req, res) => {
   try {
      let { username, email, password } = req.body;
      const newuser = new User({ email, username });
      const reg = await User.register(newuser, password);
      req.flash("success", "Welcome to Staycalls");
      res.redirect("/listing");
   }
   catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
   }
}));

router.get("/login", (req, res) => {
   res.render("user/login.ejs");
});

router.post("/login", passport.authenticate("local", { failureRedirect : "/login", failureFlash : true }), async (req, res) => {
   req.flash("success", "Logged in Successfully!");
   res.redirect("/listing");
});

router.get("/logout", (req, res, next) => {
   req.logOut((err) => {
      if (err) {
         return next(err);
      }
      req.flash("success", "You've logged out!");
      res.redirect("/listing");
   });

});

module.exports = router;