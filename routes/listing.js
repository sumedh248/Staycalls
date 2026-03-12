const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingschema, reviewsschema } = require("../schema.js");
const Listing = require("../models/listing.js");

const validatelisting = (req, res, next) => {
   let { error } = listingschema.validate(req.body);

   if (error) {
      let errmsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errmsg);
   } else {
      next();
   }
}

// index route 
router.get("/", wrapasync(async (req, res) => {
   const allListings = await Listing.find({});
   res.render("listing/index.ejs", { allListings });
}));

// new route 
router.get("/new", (req, res) => {
   res.render("listing/new.ejs");
});

// show route 
router.get("/:id", wrapasync(async (req, res) => {
   const { id } = req.params;
   const listingdata = await Listing.findById(id).populate("Review");
      if(!listingdata){
         req.flash("error", "post you are looking for does not eist");
         res.redirect("/listing");
         return;
      }
      res.render("listing/show.ejs", { listingdata });
}));

// create listing 
router.post("/", validatelisting, wrapasync(async (req, res, next) => {
   const newlisting = new Listing(req.body.listing);
   await newlisting.save();
   req.flash("success", "new post added successfully");
   res.redirect("/listing");
}));

// edit route  
router.get("/:id/edit", wrapasync(async (req, res) => {
   const { id } = req.params;
   const listing1 = await Listing.findById(id);
      if(!listing1){
         req.flash("error", "post you are looking for does not eist");
         res.redirect("/listing");
         return;
      }
      res.render("listing/edit.ejs", { listing1 });
}));

// post edit 
router.put("/:id", wrapasync(async (req, res) => {
   if (!req.body.listing) {
      throw new ExpressError(404, "Please enter some valid data");
   }
   const { id } = req.params;
   // Convert listing.image (string) to image.url for the schema
   const updateData = { ...req.body.listing };
   console.log(updateData.image);
   if (updateData.image) {
      updateData.image = {
         filename: "listingimage",
         url: updateData.image
      };
   }
   await Listing.findByIdAndUpdate(id, updateData);
   req.flash("success", "post edited");
   res.redirect(`/listing/${id}`);
}));

// post delete 
router.get("/:id/delete", wrapasync(async (req, res) => {
   const { id } = req.params;
   await Listing.findByIdAndDelete(id);
   req.flash("success", "post deleted");
   res.redirect(`/listing`);
}));

module.exports = router;