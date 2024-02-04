import express from 'express';
import { budgetService } from './budgetService';
import { auth } from '../common/middlewares/auth';
import { validation } from '../common/middlewares/validation';
import { addBudgetSchema } from './schemas/addBudgetSchema';
import { MyRequest } from '../auth/requestDefinition';
import { deleteBudgetSchema } from './schemas/deleteBudgetSchema';
import { updateBudgetCurrencySchema } from './schemas/updateBudgetCurrency';

export const router = express.Router()

router.patch('/add-budget', auth(), validation(addBudgetSchema), async (req, res) => {
    try {
        const { budget, categoryId } = req.body as any
        const wasBudgetAdded = await budgetService.addBudget(budget, categoryId, (req as MyRequest).userId)
        if (!wasBudgetAdded) {
            res.json({success: false})
        } else {
            res.json({success: true})
        }
    } catch (error) {
        console.log(error)
        res.json({success: false})
    }
})

router.patch('/delete-budget', auth(), validation(deleteBudgetSchema), async (req, res) => {
    try {
        const { categoryId } = req.body as any
        const wasBudgetDeleted = await budgetService.deleteBudget(categoryId, (req as MyRequest).userId)
        if (wasBudgetDeleted) {
            res.send("Budget was deleted!")
        } else {
            res.send("Budget was NOT deleted!")
        }
    } catch (error) {
        console.log(error)
        res.send(error)
    }
})

router.get('/', auth(), async (req, res) => {
    try {
        const allCategoriesBudget = await budgetService.getAllCategoriesBudget((req as MyRequest).userId)
        if (!allCategoriesBudget) {
            res.send("You have NOT got any budget in your categories!")
        } else {
            res.send(allCategoriesBudget)
        }   
    } catch (error) {
        console.log(error)
        res.send(error)
    }
})

router.get('/sum', auth(), async (req, res) => {
    try {
        const monthBudgetSum = await budgetService.sumMonthBudget((req as MyRequest).userId)
        res.json(monthBudgetSum)
    } catch (error) {
        console.log(error)
        res.json({success: false})
    }
})

router.patch('/update-currency', auth(), validation(updateBudgetCurrencySchema), async (req, res) => {
    try {
        const { currency, categoryId } = req.body as any
        const updatedCurrency = await budgetService.updateBudgetCurrency(currency, categoryId, (req as MyRequest).userId)
        if (!updatedCurrency) {
            res.json({success: false})
        } else {
            res.json({success: true})
        }
    } catch (error) {
        console.log(error)
        res.json({success: false})
    }
})