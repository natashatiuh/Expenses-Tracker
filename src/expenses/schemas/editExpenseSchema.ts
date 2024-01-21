import joi from 'joi';

export const editedExpenseSchema = joi.object({
    expenseId: joi.string().required(),
    expenseName: joi.string(),
    categoryId: joi.string(),
    moneyAmount: joi.number(),
    currency: joi.string()
})