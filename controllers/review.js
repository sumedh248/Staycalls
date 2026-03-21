const Listing = require("../models/listing.js");
const Review = require("../models/review.js");


// create review post
module.exports.createReview = async (req, res) => {
   let listing = await Listing.findById(req.params.id);
   let newreviews = new Review(req.body.Review);
   newreviews.author = req.user._id;
   listing.Review.push(newreviews);
   await listing.save();
   await newreviews.save();
   req.flash("success", "review posted");
   res.redirect(`/listing/${listing._id}`);
};


// delete review post
module.exports.deleteReview = async (req, res) => {
   let { id, revid } = req.params;
   await Listing.findByIdAndUpdate(id, { $pull: { Review: revid } });
   await Review.findByIdAndDelete(revid);
   req.flash("success", "review deleted");
   res.redirect(`/listing/${id}`);
};