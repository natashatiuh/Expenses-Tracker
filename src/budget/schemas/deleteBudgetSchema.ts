import joi from "joi";

export const deleteBudgetSchema = joi.object({
    categoryId: joi.string().required()
})