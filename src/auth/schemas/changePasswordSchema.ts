import joi from "joi";

export const changePasswordSchema = joi.object({
    newPassword: joi.string().required(),
    oldPassword: joi.string().required()
})