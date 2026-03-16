const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


// getting route links 
const listingrouter = require("./routes/listing.js");
const reviewsrouter = require("./routes/review.js");
const userrouter = require("./routes/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionoptions = {
   secret : "secretkey",
   resave : false,
   saveUninitialized : true,
   cookie : {
      expires : Date.now() + 7 * 24 * 60 * 60 *1000,
      maxAge : 7 * 24 * 60 * 60 *1000,
      httpOnly : true
   }
}


const MONGOURL = "mongodb://127.0.0.1:27017/roadguests";
main().then(() => {
   console.log("connected to db");
}).catch((err) => {
   console.log(err);
});
async function main() {
   await mongoose.connect(MONGOURL);
}

app.get("/", (req, res) => {
   res.send("app started");
});


app.use(session(sessionoptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next)=> {
   res.locals.success = req.flash("success");
   res.locals.error = req.flash("error");
   res.locals.curruser = req.user;
   next();
});

app.use("/listing", listingrouter);
app.use("/listing/:id/reviews", reviewsrouter);
app.use("/", userrouter);


app.use((req, res, next) => {
   next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
   const { statuscode = 500, message = "something went wrng" } = err;
   res.render("errors.ejs", {message});
});

app.listen(8080, () => {
   console.log("server listening on port 8080");
});

