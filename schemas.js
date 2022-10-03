const Joi = require('joi'); // Server side validation (postman api)

module.exports.postSchema = Joi.object({
    post: Joi.object({
        username: Joi.string().required(),
        image: Joi.string().min(0),
        description: Joi.string().required(),
        total_likes: Joi.number().required().min(0)
    }).required()
});