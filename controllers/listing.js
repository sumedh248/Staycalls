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
      .populate({ path: "Review", populate: { path: "author" } })
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
   let url = req.file.path;
   let filename = req.file.filename;

   const newlisting = new Listing(req.body.listing);
   newlisting.image = { url, filename };
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

   let orignalImage = listing1.image.url;
   orignalImage = orignalImage.replace('/upload', '/upload/w_250,h_250')
   console.log(orignalImage);

   res.render("listing/edit.ejs", { listing1, orignalImage });
};


// edit post
module.exports.editPost = async (req, res) => {
   if (!req.body.listing) {
      throw new ExpressError(404, "Please enter some valid data");
   }
   const { id } = req.params;
   const updateData = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

   if (typeof req.file !== 'undefined') {
      let url = req.file.path;
      let filename = req.file.filename;
      updateData.image = { url, filename };
      await updateData.save();
   }

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