const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { listingSchema } = require("../schema.js");


//validate listing
const validateListing = (req, res, next) => {
    let { title, description, price, location, country } = req.body.listing || {};
    if (!title || !description || !price || !location || !country) {
        throw new ExpressError(400, "Please send all required fields for listing");
    }
    next();
};

//index route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
}));

//new route 
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

// show route 
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
}));

// CREATE route
router.post("/", validateListing, wrapAsync(async (req, res, next) => {
    let result = listingSchema.validate(req.body);
    if (result.error) {
        throw new ExpressError(400, result.error);
    }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

//edit route 
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

//update route 
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }

    // Preserve old image if no new image URL is provided
    if (!req.body.listing.image?.url) {
        req.body.listing.image = listing.image;
    } else {
        req.body.listing.image = {
            url: req.body.listing.image.url,
            filename: listing.image?.filename || "listingimage"
        };
    }

    await Listing.findByIdAndUpdate(id, req.body.listing, {
        runValidators: true,
        new: true
    });

    res.redirect(`/listings/${id}`);
}));


//delete route 
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    console.log("deleted !");
    res.redirect("/listings");
}));


module.exports = router;
