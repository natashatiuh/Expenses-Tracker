import joi from 'joi';

export const addBudgetSchema = joi.object({
    budget: joi.number().required(),
    categoryId: joi.string().required()
})