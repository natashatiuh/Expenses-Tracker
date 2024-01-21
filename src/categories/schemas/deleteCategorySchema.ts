import joi from 'joi';

export const deleteCategorySchema = joi.object({
    categoryId: joi.string().required()
})