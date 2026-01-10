const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.alternatives().try(
            Joi.string(),
            Joi.object({
                pincode: Joi.number().required(),
                address: Joi.string().required(),
                city: Joi.string().required(),
                state: Joi.string().required(),
                country: Joi.string().required()
            })
        ).required(),
        image: Joi.object({
            url: Joi.string().allow("", null),
            filename: Joi.string().allow("", null),
        }),
    }).required(),
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
});
