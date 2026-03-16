const Listing = require("./models/listing.js");
const { listingschema, reviewsschema } = require("./schema.js");

// login checkups

module.exports.isloggedin = (req, res, next) => {
   if (!req.isAuthenticated()) {
      req.session.redirecturl = req.originalUrl;
      req.flash("error", "You've must be logged in!");
      return res.redirect("/login");
   }
   next();
}


// last urls

module.exports.redirecturl = (req, res, next) => {
   if (req.session.redirecturl) {
      res.locals.redirecturl = req.session.redirecturl;
   }
   next();
}

// owner validation

module.exports.isOwner = async (req, res, next) => {
   let { id } = req.params;
   const listing = await Listing.findById(id);
   if (!listing.owner.equals(res.locals.curruser._id)) {
      req.flash("error", "You are not owner of this post");
      return res.redirect(`/listing/${id}`);
   }
   next();
}

// post validation
module.exports.validatelisting = (req, res, next) => {
   let { error } = listingschema.validate(req.body);

   if (error) {
      let errmsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errmsg);
   } else {
      next();
   }
}


// review validation

module.exports.validatereview = (req, res, next) => {
   let {error} = reviewsschema.validate(req.body); 
   if(error){
      let errmsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errmsg);
   }else{
      next();
   }
}