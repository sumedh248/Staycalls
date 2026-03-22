const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js");
const { isloggedin, isOwner, validatelisting } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const {storage} = require("../cloudinary.js");
const upload = multer({ storage });

router.route("/")
.get(wrapasync(listingController.index))
.post(isloggedin,upload.single('listing[image]'), validatelisting, wrapasync(listingController.createPost));

// new route 
router.get("/new", isloggedin, listingController.newPost);

router.route("/:id")
.get(wrapasync(listingController.showpost))  //show post
.put(isloggedin, isOwner, upload.single('listing[image]'), wrapasync(listingController.editPost));   //edit post


// edit route  
router.get("/:id/edit", isloggedin, isOwner, wrapasync(listingController.editPostRoute));


// post delete 
router.get("/:id/delete", isloggedin, isOwner, wrapasync(listingController.deletePost));

module.exports = router;