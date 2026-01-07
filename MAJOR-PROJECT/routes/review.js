const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


//validate review
const validateReview = (req, res, next) => {
    let { rating, comment } = req.body.review || {};
    if (!rating || !comment) {
        throw new ExpressError(400, "Please send all required fields for review");
    }
    next();
};

//review route 
router.post("/", validateReview, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    const review = new Review(req.body.review);
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    // res.send("review added");
    res.redirect(`/listings/${id}`);
    console.log("review added");

}));

//delete review route 
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
    console.log("review deleted", reviewId);

}));

module.exports = router;
