import joi from 'joi';

export const signInSchema = joi.object({
    userName: joi.string().required(),
    password: joi.string().required()
})