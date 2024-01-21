import joi from 'joi';

export const updateExpenseCurrencySchema = joi.object({
    currency: joi.string().required(),
    expenseId: joi.string().required()
})

