import joi from 'joi';

export const makeCategoryNotFavoriteSchema = joi.object({
    categoryId: joi.string().required()
})