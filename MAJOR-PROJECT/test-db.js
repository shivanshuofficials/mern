require("dotenv").config();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

const MONGO_URL = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";

async function checkData() {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB");

    const count = await Listing.countDocuments({});
    console.log(`Total listings in database: ${count}`);

    const listings = await Listing.find({}).limit(3);
    console.log("\nFirst 3 listings:");
    listings.forEach(listing => {
        console.log(`- ${listing.title} (${listing.location?.city || 'No city'}, ${listing.country})`);
    });

    mongoose.connection.close();
}

checkData().catch(err => console.log(err));
