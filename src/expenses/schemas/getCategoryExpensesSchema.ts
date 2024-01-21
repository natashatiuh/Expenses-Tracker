import joi from 'joi';

export const getCategoryExpensesSchema = joi.object({
    categoryId: joi.string().required()
})