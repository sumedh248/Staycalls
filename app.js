const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const wrapasync = require("./utils/wrapasync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingschema, reviewsschema} = require("./schema.js");
const { wrap } = require("module");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname, "/public")));


const MONGOURL = "mongodb://127.0.0.1:27017/roadguests";
main().then(() => {
   console.log("connected to db");
}).catch((err) => {
   console.log(err);
});
async function main() {
   await mongoose.connect(MONGOURL);
}

const validatelisting = (req, res, next) => {
   let {error} = listingschema.validate(req.body);
   if(error){
      let errmsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errmsg);
   }else{
      next();
   }
}

const validatereview = (req, res, next) => {
   let {error} = reviewsschema.validate(req.body);
   if(error){
      let errmsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errmsg);
   }else{
      next();
   }
}

app.get("/", (req, res) => {
   res.send("app started");
});

app.get("/listing", wrapasync(async (req, res) => {
   const allListings = await Listing.find({});
   res.render("listing/index.ejs", { allListings });
}));

app.get("/listing/new", (req, res) => {
   res.render("listing/new.ejs");
});

app.get("/listing/:id", wrapasync(async (req, res) => {
   const { id } = req.params;
   const listingdata = await Listing.findById(id).populate("Review");
   res.render("listing/show.ejs", { listingdata });
}));

app.post("/listing", validatelisting, wrapasync(async (req, res, next) => {
   const ins = new Listing(req.body.listing);
   await ins.save();
   res.redirect("/listing");
}));

app.get("/listing/:id/edit", wrapasync(async (req, res) => {
   const { id } = req.params;
   const listing1 = await Listing.findById(id);
   res.render("listing/edit.ejs", { listing1 });
}));

app.put("/listing/:id", validatelisting, wrapasync(async (req, res) => {
   if (!req.body.listing) {
      throw new ExpressError(404, "Please enter some valid data");
   }
   const { id } = req.params;
   await Listing.findByIdAndUpdate(id, { ...req.body.listing });
   res.redirect(`/listing/${id}`);
}));

app.get("/listing/:id/delete", wrapasync(async (req, res) => {
   const { id } = req.params;
   await Listing.findByIdAndDelete(id);
   res.redirect(`/listing`);
}));
app.post("/listing/:id/reviews", validatereview,  wrapasync(async(req,res) => {
   let listing = await Listing.findById(req.params.id);
   let newreviews = new Review(req.body.Review);

   listing.Review.push(newreviews);

   await listing.save();
   await newreviews.save();
   res.redirect(`/listing/${listing._id}`);
}));

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