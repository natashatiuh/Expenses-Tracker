import joi from "joi";

export const changeNameSchema = joi.object({
    newName: joi.string().required()
})

