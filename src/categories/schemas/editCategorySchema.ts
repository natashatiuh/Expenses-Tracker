import joi from 'joi';

export const editCategorySchema = joi.object({
    newName: joi.string().required(),
    categoryId: joi.string().required()
})