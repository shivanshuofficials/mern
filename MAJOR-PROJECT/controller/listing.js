const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//index route
module.exports.index = async (req, res) => {
    let { search, sort, page } = req.query;
    let query = {};

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { "location.city": { $regex: search, $options: "i" } },
            { "location.state": { $regex: search, $options: "i" } },
            { "location.country": { $regex: search, $options: "i" } },
            { country: { $regex: search, $options: "i" } }
        ];
    }

    let sortOption = {};
    if (sort === 'price_asc') {
        sortOption = { price: 1 };
    } else if (sort === 'price_desc') {
        sortOption = { price: -1 };
    } else if (sort === 'newest') {
        sortOption = { _id: -1 };
    }

    // Pagination
    const limit = 8;
    const currentPage = parseInt(page) || 1;
    const skip = (currentPage - 1) * limit;

    let allListings;
    let totalListings;

    if (sort === 'rating_desc') {
        // For rating sort, we need aggregation or populate and sort in memory (less efficient but easier for now given schema)
        // Given the schema, reviews are in a separate collection. Aggregation is better.
        // However, to keep it simple and consistent with the current codebase structure, let's try a simpler approach first or stick to basic sorts.
        // If user really wants "best place according to review", we need to aggregate.
        // Let's implement basic sorting first and see if we can easily add rating sort.
        // Rating sort requires looking up reviews.

        // Let's stick to price and newest for now in the database query, and maybe handle rating differently or skip complex aggregation if not strictly required by "simple" request.
        // Wait, the user asked for "place low to high best place according to review".
        // "best place according to review" implies sorting by rating.

        // Let's use a pipeline for rating sort.
        allListings = await Listing.aggregate([
            { $match: query },
            { $lookup: { from: "reviews", localField: "reviews", foreignField: "_id", as: "populated_reviews" } },
            { $addFields: { averageRating: { $avg: "$populated_reviews.rating" } } },
            { $sort: { averageRating: -1 } },
            { $skip: skip },
            { $limit: limit }
        ]);

        // We need to re-hydrate these plain objects to Mongoose documents if we use methods on them in the view, 
        // but the view seems to only access properties.
        // However, the view uses `listing.image.url` etc. Aggregation returns plain objects.
        // Also we need total count for pagination.

        // Let's do a simpler approach for now: Fetch all matching query, sort in JS (if dataset is small) or just implement price sort first.
        // Given "MERN MAJOR PROJECT", dataset might be small.
        // But let's try to be robust.

        // Actually, let's stick to standard find for non-rating sorts to keep it standard.
        // For rating sort, we can use the aggregation pipeline.

        // Let's refine the plan:
        // 1. Get total count for pagination.
        // 2. If sort is rating, use aggregation.
        // 3. Else use find().
    }

    // Re-evaluating: To keep it consistent, let's just use find() with sort() for price/newest.
    // For rating, it's complex without storing avgRating on Listing.
    // I'll implement Price Low-High, Price High-Low, and Newest for now. 
    // If I really need Rating, I'll add it, but let's start with Price as explicitly requested "price and place low to high".

    totalListings = await Listing.countDocuments(query);
    const totalPages = Math.ceil(totalListings / limit);

    if (sort === 'rating_desc') {
        // Aggregation for rating
        allListings = await Listing.aggregate([
            { $match: query },
            { $lookup: { from: "reviews", localField: "reviews", foreignField: "_id", as: "reviews_doc" } },
            { $addFields: { avgRating: { $avg: "$reviews_doc.rating" } } },
            { $sort: { avgRating: -1 } },
            { $skip: skip },
            { $limit: limit }
        ]);
        // Note: Aggregation returns plain objects. We might need to ensure image.url exists etc.
    } else {
        allListings = await Listing.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(limit);
    }

    res.render("listings/index.ejs", { allListings, search, sort, currentPage, totalPages });
}

//new route
module.exports.renderNewForm = (req, res) => {
    console.log(req.user);
    res.render("listings/new.ejs");
}

//create route
module.exports.createListing = async (req, res, next) => {
    let url = req.file ? req.file.path : "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60";
    let filename = req.file ? req.file.filename : "listingimage";

    let location = req.body.listing.location;
    let query = `${location.address}, ${location.city}, ${location.state}, ${location.country}`;
    let response = await geocodingClient.forwardGeocode({
        query: query,
        limit: 1
    })
        .send();

    const newListing = new Listing(req.body.listing);
    newListing.author = req.user ? req.user._id : "654321654321654321654321"; // Dummy ID for testing
    newListing.image = { url, filename };

    if (response.body.features && response.body.features.length > 0) {
        newListing.geometry = response.body.features[0].geometry;
    } else {
        // Fallback or handle error
        newListing.geometry = { type: 'Point', coordinates: [0, 0] };
    }
    await newListing.save();
    req.flash("success", "Listing created successfully");
    res.redirect("/listings");
}

//show route
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("author");
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}


//edit route
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("author");
    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        res.redirect("/listings");
        return;
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
}

//update route
module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }

    // Preserve old image if no new image URL is provided
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        req.body.listing.image = { url, filename };
    }

    let location = req.body.listing.location;
    let query = `${location.address}, ${location.city}, ${location.state}, ${location.country}`;
    let response = await geocodingClient.forwardGeocode({
        query: query,
        limit: 1
    })
        .send();

    if (response.body.features && response.body.features.length > 0) {
        req.body.listing.geometry = response.body.features[0].geometry;
    }

    await Listing.findByIdAndUpdate(id, req.body.listing, {
        runValidators: true,
        new: true
    });
    req.flash("success", "Listing updated successfully");

    res.redirect(`/listings/${id}`);
}

//delete route
module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted successfully");
    console.log("deleted !");
    res.redirect("/listings");
}
