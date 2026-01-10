const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const ListingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        url: String,
        filename: String
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    location: {
        pincode: {
            type: Number,
        },
        address: String,
        city: String,
        state: String,
        country: String
    },
    country: String,
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

ListingSchema.post("findOneAndDelete", async function (listing) {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;

