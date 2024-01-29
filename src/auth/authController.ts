import express from 'express';
import { authorizationService } from "./authServices";
import { validation } from "../common/middlewares/validation";
import { auth } from "../common/middlewares/auth";
import { signUpSchema } from "./schemas/signUpSchema";
import { signInSchema } from "./schemas/signInSchema";
import { changeNameSchema } from './schemas/changeNameSchema';
import { MyRequest } from './requestDefinition';
import { changeCountrySchema } from './schemas/changeCountrySchema';
import { changePasswordSchema } from './schemas/changePasswordSchema';
import { SignUpUserInput } from './inputs/signUpUserInput';
import { UpdatePasswordInput } from './inputs/updatePasswordInput';

export const router = express.Router()

router.post('/sign-up', validation(signUpSchema), async (req, res) => {
    try{
        const { userName, password, country } = req.body as any
        const userData = new SignUpUserInput(userName, password, country)
        const token = await authorizationService.signUp(userData)
        res.json({token})
    } catch(error) {
        console.log(error)
        res.json({success: false})
    }
})

router.post('/sign-in', validation(signInSchema), async (req, res) => {
    try{
        const { userName, password } = req.body as any
        const token = await authorizationService.signIn(userName, password)
        res.json({token})
    } catch(error) {
        console.log(error)
        res.json({success: false})
    }
})

router.patch('/name', auth(), validation(changeNameSchema), async (req: any, res) => {
    try{
        console.log(req.userId)
        const { newName }= req.body as any
        console.log(newName)
        const isNameChanged = await authorizationService.changeName(newName, (req as MyRequest).userId)
        if (!isNameChanged){
            res.json({success: false})
        } else {
           res.json({success: true}) 
        }
    } catch(error) {
        console.log(error)
        res.json({success: false})
    }
})

router.patch('/country', auth(), validation(changeCountrySchema), async (req, res) => {
    try {
        const { newCountry } = req.body as any
        const isCountryChanged = await authorizationService.changeCountry(newCountry, (req as MyRequest).userId)
        if (!isCountryChanged) {
            res.json({success: true})
        } else {
            res.json({success: false})
        }
    } catch(error) {
        console.log(error)
        res.json({success: false})
    }
})

router.patch('/password', auth(), validation(changePasswordSchema), async (req, res) => {
    try {
        const { newPassword, oldPassword } = req.body as any
        const passwordData = new UpdatePasswordInput(newPassword, oldPassword, (req as MyRequest).userId)
        const isPasswordChanged = await authorizationService.changePassword(passwordData)
        if(!isPasswordChanged) {
            res.json({success: false}) 
        } else {
            res.json({success: true})
        }
    } catch (error) {
        console.log(error)
        res.json({success: false})
    }
})

router.delete('/', auth(), async (req, res) => {
    try {
        const isAccountDeleted = await authorizationService.deleteAccount((req as MyRequest).userId)
        if(!isAccountDeleted) {
            res.send('Something goes wrong!')
        } else {
            res.send('The user was deleted!')
        }
    } catch (error) {
        console.log(error)
        res.send(error)
    }
})

router.get('/user', auth(), async (req, res) => {
    try {
        const user = await authorizationService.getUser((req as MyRequest).userId)
        res.json({user})
    } catch (error){
        console.log(error)
        res.json({success: false})
    }
})

router.get('/currency', auth(), async (req, res) => {
    try {
        const currency = await authorizationService.getCurrency((req as MyRequest).userId)
        res.json({currency})
    } catch (error) {
        console.log(error)
        res.json({success: false})
    }
})