require("dotenv").config();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

const MONGO_URL = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";

async function checkCoordinates() {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB\n");

    const listings = await Listing.find({}).limit(5);
    console.log("Sample coordinates for 5 listings:\n");
    listings.forEach(listing => {
        console.log(`${listing.title}`);
        console.log(`  Location: ${listing.location?.city || 'No city'}, ${listing.country}`);
        console.log(`  Coordinates: [${listing.geometry.coordinates[0]}, ${listing.geometry.coordinates[1]}]`);
        console.log('');
    });

    mongoose.connection.close();
}

checkCoordinates().catch(err => console.log(err));
