const User = require("../models/user.js");
const { redirecturl } = require("../middleware.js");

// sign up Route
module.exports.userSignUpRoute = (req, res) => {
   res.render("user/signup.ejs");
};

// sign up 
module.exports.userSignUp = async (req, res) => {
   try {
      let { username, email, password } = req.body;
      const newuser = new User({ email, username });
      const reg = await User.register(newuser, password);
      req.login(reg, (err) => {
         if (err) {
            return next(err);
         }
         req.flash("success", "Welcome to Staycalls");
         res.redirect("/listing");
      });
   }
   catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
   }
};


// log in route
module.exports.userLogInRoute = (req, res) => {
   res.render("user/login.ejs");
};

// log in 
module.exports.logIn = async (req, res) => {
   req.flash("success", "Logged in Successfully!");
   const redirecturll = res.locals.redirecturl || "/listing";
   res.redirect(redirecturll);
};

// log out
module.exports.userLogOut = (req, res, next) => {
   req.logOut((err) => {
      if (err) {
         return next(err);
      }
      req.flash("success", "You've logged out!");
      res.redirect("/listing");
   });

};