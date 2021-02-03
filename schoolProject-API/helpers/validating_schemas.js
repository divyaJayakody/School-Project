/*  This file defines the validation models for Joi schema.validation() method */

const Joi = require('@hapi/joi');

/* Address Validation Schema. */
const addressSchema = Joi.object().keys({
    street:Joi.string().required(),
    suburb:Joi.string().required(),
    postcode:Joi.number().required(),
    state:Joi.string().required(),
});
/* School Validation Schema. */
const schoolSchema = Joi.object().keys({
    schoolName: Joi.string().required(),
    noOfStudents: Joi.number().required(),
    address: addressSchema
});

module.exports = { schoolSchema, addressSchema};
