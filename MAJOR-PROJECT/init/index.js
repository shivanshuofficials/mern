require("dotenv").config();
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listings = require("../models/listing.js");
const User = require("../models/user.js");
const MONGO_URL = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB");

    await initDB();
  } catch (err) {
    console.error("Error:", err);
  } finally {
    mongoose.connection.close();
  }
}

const initDB = async () => {
  console.log("Deleting existing listings...");
  await Listings.deleteMany({});

  console.log("Transforming data...");
  const transformedData = initData.data.map((obj) => ({
    title: obj.title,
    description: obj.description,
    image: obj.image,
    price: obj.price,
    location: {
      city: obj.location,  // Simple string like "Malibu"
      country: obj.country  // Simple string like "United States"
    },
    country: obj.country,
    author: "677f2c2c2c2c2c2c2c2c2c2c",
    geometry: {
      type: "Point",
      coordinates: [0, 0] // Default coordinates, will be geocoded later
    }
  }));

  console.log(`Inserting ${transformedData.length} listings...`);
  const result = await Listings.insertMany(transformedData);
  console.log(`✅ Successfully inserted ${result.length} listings!`);
};

main();
