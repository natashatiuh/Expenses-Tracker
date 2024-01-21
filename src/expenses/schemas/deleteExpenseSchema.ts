import joi from 'joi';

export const deletedExpenseSchema = joi.object({
    expenseId: joi.string().required()
})