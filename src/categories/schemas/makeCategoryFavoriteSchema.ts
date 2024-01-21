import joi from 'joi';

export const makeCategoryFavoriteSchema = joi.object({
    categoryId: joi.string().required()
})