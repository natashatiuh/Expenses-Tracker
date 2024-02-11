import express from "express";
import { expensesService } from "./expensesService";
import { validation } from "../common/middlewares/validation";
import { addExpenseSchema } from "./schemas/addExpenseSchema";
import { MyRequest } from "../auth/requestDefinition";
import { auth } from "../common/middlewares/auth";
import { editedExpenseSchema } from "./schemas/editExpenseSchema";
import { deletedExpenseSchema } from "./schemas/deleteExpenseSchema";
import { getCategoryExpensesSchema } from "./schemas/getCategoryExpensesSchema";
import { AddExpenseInput } from "./inputs/addExpenseInput";
import { EditExpenseInput } from "./inputs/editExpenseInput";
import { updateExpenseCurrencySchema } from "./schemas/updateExpenseCurrency";

export const router = express.Router()

router.post('/', auth(), validation(addExpenseSchema), async (req, res) => {
    try{
        const { expenseName, categoryId, moneyAmount } = req.body as any
        const expenseData = new AddExpenseInput((req as MyRequest).userId, expenseName, categoryId, moneyAmount)
        await expensesService.addExpense(expenseData)
        res.json({success: true})
    } catch (error) {
        console.log(error)
        res.json({success: false})
    }
})

router.patch('/', auth(), validation(editedExpenseSchema), async (req, res) => {
    try {
        const { expenseId, expenseName, categoryId, moneyAmount, currency } = req.body as any
        const expenseData = new EditExpenseInput(expenseId, (req as MyRequest).userId, expenseName, categoryId, moneyAmount, currency)
        const editedExpense = await expensesService.editExpense(expenseData)
        if (!editedExpense) {
            res.json({success: false})
        } else {
            res.json({editedExpense})
        }
    } catch (error) {
        console.log(error)
        res.json({success: false})
    }
} )

router.delete('/', auth(), validation(deletedExpenseSchema), async (req, res) => {
    try {
        const { expenseId } = req. body as any
        const isExpenseDeleted = await expensesService.deleteExpense(expenseId, (req as MyRequest).userId)
        if (!isExpenseDeleted) {
            res.json({success: false})
        } else {
            res.send({success: true})
        }
    } catch (error) {
        console.log(error)
        res.json({success: false})
    }
})

router.get('/by-category', auth(), validation(getCategoryExpensesSchema), async (req, res) => {
    try {
        const { categoryId } = req.body as any
        const categoryExpenses = await expensesService.getCategoryExpenses(categoryId, (req as MyRequest).userId) 
        if (!categoryExpenses) {
            res.send("Something goes wrong!")
        } else {
            res.send(categoryExpenses)
        }
    } catch (error) {
        console.log(error)
        res.send(error)
    }
})

router.get('/all', auth(), async (req, res) => {
    try {
        const expenses = await expensesService.getExpenses((req as MyRequest).userId)
        res.json({expenses})
    } catch (error) {
        console.log(error)
        res.json({success: false})
    }
})

router.get('/expenses-sum', auth(), async (req, res) => {
    try {
        const expensesSum = await expensesService.getExpensesSum((req as MyRequest).userId)
        if (!expensesSum) {
            res.json({success: false})
        } else {
            res.send({expensesSum})
        }
    } catch (error) {
        console.log(error)
        res.json({success: false})
    }
})

router.get('/category-sum', auth(), async (req, res) => {
    try {
        const { categoryId } = req.body as any
        const categoryExpensesSum = await expensesService.getCategoryExpensesSum((req as MyRequest).userId, categoryId)
        if (!categoryExpensesSum) {
            res.send("You do not have expenses in this category!")
        } else {
            res.send(categoryExpensesSum)
        }
    } catch (error) {
        console.log(error)
        res.send(error)
    }
})

router.patch('/update-currency', auth(), validation(updateExpenseCurrencySchema), async (req, res) => {
    try {
        const { currency, expenseId } = req.body as any
        const updatedCurrency = await expensesService.updateExpenseCurrency(currency, expenseId, (req as MyRequest).userId)
        if (!updatedCurrency) {
            res.send("The currency was NOT changed!")
        } else {
            res.send("The currency was changed!")
        }
    } catch (error) {
        console.log(error)
        res.send(error)
    }
})