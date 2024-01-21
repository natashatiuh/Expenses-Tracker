import joi from 'joi';

export const addCategorySchema = joi.object({
    name: joi.string().required()
})