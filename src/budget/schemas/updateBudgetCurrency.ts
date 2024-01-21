import joi from 'joi';

export const updateBudgetCurrencySchema = joi.object({
    currency: joi.string().required(),
    categoryId: joi.string().required()
})