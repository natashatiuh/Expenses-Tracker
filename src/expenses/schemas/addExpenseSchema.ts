import joi from "joi";

export const addExpenseSchema = joi.object({
    expenseName: joi.string().required(),
    categoryId: joi.string().required(),
    moneyAmount: joi.number().required()
})