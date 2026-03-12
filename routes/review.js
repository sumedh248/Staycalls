const express = require("express");
const router = express.Router({mergeParams : true});
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const wrapasync = require("../utils/wrapasync.js");
const { reviewsschema} = require("../schema.js");

const validatereview = (req, res, next) => {
   let {error} = reviewsschema.validate(req.body);
   if(error){
      let errmsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errmsg);
   }else{
      next();
   }
}

// reviews 
router.post("/", validatereview,  wrapasync(async(req,res) => {
   let listing = await Listing.findById(req.params.id);
   let newreviews = new Review(req.body.Review);

   listing.Review.push(newreviews);

   await listing.save();
   await newreviews.save();
   req.flash("success", "review posted");
   res.redirect(`/listing/${listing._id}`);
}));

// delete review route 
router.delete("/:revid", wrapasync(async(req,res)=>{
   let {id, revid} = req.params;
   await Listing.findByIdAndUpdate(id, {$pull : {Review : revid}});
   await Review.findByIdAndDelete(revid);
   req.flash("success", "review deleted");
   res.redirect(`/listing/${id}`);
}));

module.exports = router;