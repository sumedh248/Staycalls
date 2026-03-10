const Joi = require("joi");
module.exports.listingschema = Joi.object({
   listing : Joi.object({
      title : Joi.string().required(),
      description : Joi.string().required(),
      image : Joi.string().required(),
      location : Joi.string().required(),
      country : Joi.string().required(),
      price : Joi.number().required().min(0),   
   }).required()
});

module.exports.reviewsschema = Joi.object({
   Review : Joi.object({
      rating : Joi.number().max(5).min(1),
      comments : Joi.string().required()
   }).required()
})