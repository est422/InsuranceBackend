// schemas.js
const Joi = require('joi');

// Schema for user creation
const createUserSchema = Joi.object({
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
    email: Joi.string().email().optional().allow('', null),
    password: Joi.string().min(6).required(),
    phone: Joi.string().pattern(/^\d+$/).min(7).max(15).required(),
    enteredPrice: Joi.number().min(0).optional(),
    // role: Joi.string().valid('admin', 'client').required()
});

// Schema for login
const loginSchema = Joi.object({
    phone: Joi.string().pattern(/^\d+$/).required(),
    password: Joi.string().required()
});

// Schema for update (optional fields, but must validate)
const updateUserSchema = Joi.object({
    firstName: Joi.string().min(2).optional(),
    lastName: Joi.string().min(2).optional(),
    email: Joi.string().email().optional().allow('', null),
    password: Joi.string().min(6).optional(),
    phone: Joi.string().pattern(/^\d+$/).min(7).max(15).optional(),
    enteredPrice: Joi.number().min(0).optional(),
    // role: Joi.string().valid('admin', 'client').optional()
}).min(1); // require at least one field to update

module.exports = {
    createUserSchema,
    loginSchema,
    updateUserSchema
};
