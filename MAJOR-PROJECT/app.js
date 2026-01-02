const express = require("express");
const app = express();
const path = require("path");
const ejs = require("ejs");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const { listingSchema } = require("./schema.js"); 

//mongoose
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main().then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));
async function main() {
  await mongoose.connect(MONGO_URL);
}

//ejs 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine(".ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const validateListing = (req, res, next) => {
  let { title, description, price, location, country } = req.body.listing || {};
  if (!title || !description || !price || !location || !country) {
    throw new ExpressError(400, "Please send all required fields for listing");
  }
    next();
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});


//index route
app.get("/listings", wrapAsync(async (req, res) => {
  const allListings = await Listing.find();
  res.render("listings/index.ejs", { allListings });
}));

//new route 
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});


// CREATE route
app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {
 let result = listingSchema.validate(req.body);
 if(result.error){
  throw new ExpressError(400, result.error);
 }
  const newListing = new Listing(result.value); 
  await newListing.save();
  res.redirect("/listings");
}));

//edit route 
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));

//update route 
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
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
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  console.log("deleted !");
  res.redirect("/listings");
}));

// show route 
app.get("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
}));

// 404 handler (NO path)
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// error handler (ALWAYS LAST)
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.render("error.ejs", { statusCode, message });
});

app.listen(8080, () => {
  console.log("Server started on port 8080");
}); 
