const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");

   
// index route
module.exports.index = async (req, res) => {
   const allListings = await Listing.find({});
   res.render("listing/index.ejs", { allListings });
};

// new post 
module.exports.newPost = (req, res) => {
   res.render("listing/new.ejs");
};

// showpost
module.exports.showpost = async (req, res) => {
   const { id } = req.params;
   const listingdata = await Listing.findById(id)
   .populate({path : "Review", populate : {path : "author"}})
   .populate("owner");
        if (!listingdata) {
      req.flash("error", "post you are looking for does not eist");
      res.redirect("/listing");
      return;
   }
   res.render("listing/show.ejs", { listingdata });
};

// create post
module.exports.createPost = async (req, res, next) => {
   const newlisting = new Listing(req.body.listing);
   newlisting.owner = req.user._id;
   await newlisting.save();
   req.flash("success", "new post added successfully");
   res.redirect("/listing");
};

// edit post route
module.exports.editPostRoute = async (req, res) => {
   const { id } = req.params;
   const listing1 = await Listing.findById(id);
   if (!listing1) {
      req.flash("error", "post you are looking for does not eist");
      res.redirect("/listing");
      return;
   }
   res.render("listing/edit.ejs", { listing1 });
};


// edit post
module.exports.editPost = async (req, res) => {
   if (!req.body.listing) {
      throw new ExpressError(404, "Please enter some valid data");
   }
   const { id } = req.params;
   // Convert listing.image (string) to image.url for the schema
   const updateData = { ...req.body.listing };
      if (updateData.image) {
      updateData.image = {
         filename: "listingimage",
         url: updateData.image
      };
   }
   await Listing.findByIdAndUpdate(id, updateData);
   req.flash("success", "post edited");
   res.redirect(`/listing/${id}`);
};


// delete post 
module.exports.deletePost = async (req, res) => {
   const { id } = req.params;
   await Listing.findByIdAndDelete(id);
   req.flash("success", "post deleted");
   res.redirect(`/listing`);
};