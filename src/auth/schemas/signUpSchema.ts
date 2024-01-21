import joi from 'joi';

export const signUpSchema = joi.object({
    userName: joi.string().required(),
    password: joi.string().required(),
    country: joi.string().required(),
})