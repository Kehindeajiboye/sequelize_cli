const Joi = require("joi");

const signupSchema = Joi.object({
  first_name: Joi.string().min(3).max(30).required().messages({
    "string.base": "first_name should be a type of text",
    "string.empty": "first_name cannot be an empty field",
    "string.min": "first_name should be a minimum length of 3",
    "string.max": "first_name should be a maximum length of 30",
    "any.required": "first_name is required field",
  }),
  last_name: Joi.string().min(3).max(30).required().messages({
    "string.base": "last_name should be a type of text",
    "string.empty": "last_name cannot be an empty field",
    "string.min": "last_name should be a minimum length of 3",
    "string.max": "last_name should be a maximum length of 30",
    "any.required": "last_name is required field",
  }),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required()
    .messages({
      "string.empty": "email cannot be an empty field",
      "string.email": "email must be a valid email",
      "any.required": "email is required field",
    }),
  password: Joi.string().alphanum().min(8).required().messages({
    "string.alphanum": "password must contain only numbers and letters",
    "string.empty": "password cannot be an empty field",
    "string.min": "password should be a minimum length of 8",
    "any.required": "password is required field",
  }),
  phone: Joi.string().max(15).required().messages({
    "string.empty": "phone cannot be an empty field",
    "string.max": "phone should be a maximum length of 15",
    "any.required": "phone is required field",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required()
    .messages({
      "string.empty": "email cannot be an empty field",
      "string.email": "email must be a valid email",
      "any.required": "email is required field",
    }),
  password: Joi.string().alphanum().min(8).required().messages({
    "string.alphanum": "password must contain only numbers and letters",
    "string.empty": "password cannot be an empty field",
    "string.min": "password should be a minimum length of 8",
    "any.required": "password is required field",
  }),
});

const updateSchema = Joi.object({
  first_name: Joi.string().min(3).max(30).messages({
    "string.base": "first_name should be a type of text",
    "string.empty": "first_name cannot be an empty field",
    "string.min": "first_name should be a minimum length of 3",
    "string.max": "first_name should be a maximum length of 30",
  }),
  last_name: Joi.string().min(3).max(30).messages({
    "string.base": "last_name should be a type of text",
    "string.empty": "last_name cannot be an empty field",
    "string.min": "last_name should be a minimum length of 3",
    "string.max": "last_name should be a maximum length of 30",
  }),
  phone: Joi.string().max(15).messages({
    "string.empty": "phone cannot be an empty field",
    "string.max": "phone should be a maximum length of 15",
  }),
});

const startForgetPasswordSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required()
    .messages({
      "string.empty": "email cannot be an empty field",
      "string.email": "email must be a valid email",
      "any.required": "email is required field",
    }),
});

const completeForgetPasswordSchema = Joi.object({
  new_password: Joi.string().alphanum().min(8).required().messages({
    "string.alphanum": "password must contain only numbers and letters",
    "string.empty": "password cannot be an empty field",
    "string.min": "password should be a minimum length of 8",
    "any.required": "password is required field",
  }),
});

module.exports = {
  signupSchema,
  loginSchema,
  updateSchema,
  startForgetPasswordSchema,
  completeForgetPasswordSchema,
};
