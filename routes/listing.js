const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js");
const { isloggedin, isOwner, validatelisting } = require("../middleware.js");
const listingController = require("../controllers/listing.js");


router.route("/")
.get(wrapasync(listingController.index))
.post(isloggedin, validatelisting, wrapasync(listingController.createPost));

// new route 
router.get("/new", isloggedin, listingController.newPost);

router.route("/:id")
.get(wrapasync(listingController.showpost))
.put(isloggedin, isOwner, wrapasync(listingController.editPost));


// edit route  
router.get("/:id/edit", isloggedin, isOwner, wrapasync(listingController.editPostRoute));


// post delete 
router.get("/:id/delete", isloggedin, isOwner, wrapasync(listingController.deletePost));

module.exports = router;