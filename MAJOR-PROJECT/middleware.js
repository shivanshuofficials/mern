const Listing = require("./models/listing");
const Review = require("./models/review");

//middleware to check if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be signed in first!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectionUrl = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.author.equals(req.user._id)) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
const ExpressError = require("./utils/ExpressError.js");
const { reviewSchema } = require("./schema.js");

module.exports.validateReview = (req, res, next) => {
    let { rating, comment } = req.body.review || {};
    if (!rating || !comment) {
        throw new ExpressError(400, "Please send all required fields for review");
    }
    next();
};

module.exports.normalizeMultipartBody = (req, res, next) => {
    if (req.body['listing[title]']) {
        req.body.listing = {
            title: req.body['listing[title]'],
            description: req.body['listing[description]'],
            price: req.body['listing[price]'],
            country: req.body['listing[country]'], // Legacy or top-level
            location: req.body['listing[location]'] // Legacy string
        };

        // Handle nested location fields
        if (req.body['listing[location][pincode]']) {
            req.body.listing.location = {
                pincode: req.body['listing[location][pincode]'],
                address: req.body['listing[location][address]'],
                city: req.body['listing[location][city]'],
                state: req.body['listing[location][state]'],
                country: req.body['listing[location][country]']
            };
        }
    }
    if (req.file) {
        if (!req.body.listing) req.body.listing = {};
        req.body.listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }
    next();
};
