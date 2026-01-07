const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listing = require("./routes/listing.js");
const review = require("./routes/review.js");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(express.json());


//mongoose
const mongoose = require("mongoose");
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



app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.use("/listings", listing);
app.use("/listings/:id/reviews", review);


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
