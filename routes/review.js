const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapasync = require("../utils/wrapasync.js");
const { validatereview, isloggedin, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/review.js");

// reviews 
router.post("/", isloggedin, validatereview, wrapasync(reviewController.createReview));

// delete review route 
router.delete("/:revid", isloggedin, isReviewAuthor, wrapasync(reviewController.deleteReview));

module.exports = router;