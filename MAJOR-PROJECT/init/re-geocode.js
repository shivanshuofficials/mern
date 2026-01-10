const mongoose = require("mongoose");
const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
require("dotenv").config();

const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const MONGO_URL = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");

    const listings = await Listing.find({
        $or: [
            { geometry: { $exists: false } },
            { "geometry.coordinates": { $exists: false } },
            { "geometry.coordinates": { $size: 0 } },
            { "geometry.coordinates": [0, 0] }  // Also update default coordinates
        ]
    });
    console.log(`Found ${listings.length} listings needing geometry update.`);

    for (let listing of listings) {
        try {
            let query = "";
            if (typeof listing.location === "string") {
                query = listing.location;
            } else if (listing.location && typeof listing.location === "object") {
                query = `${listing.location.address || ""}, ${listing.location.city || ""}, ${listing.location.state || ""}, ${listing.location.country || ""}`;
            }

            if (!query || query.trim() === ", , ,") {
                console.log(`Skipping ${listing.title}: No valid location query.`);
                continue;
            }

            console.log(`Geocoding: ${query}`);
            let response = await geocodingClient.forwardGeocode({
                query: query,
                limit: 1
            }).send();

            if (response.body.features.length > 0) {
                listing.geometry = response.body.features[0].geometry;
                await listing.save();
                console.log(`Updated: ${listing.title}`);
            } else {
                console.log(`No coordinates found for: ${listing.location}`);
            }
        } catch (e) {
            console.error(`Error updating ${listing.title}:`, e);
        }
    }

    console.log("Migration complete!");
    mongoose.connection.close();
}

main().catch(err => console.log(err));
