import { budgetRepository } from "../budget/budgetRepository"
import { categoriesRepository } from "../categories/categoriesRepository"
import { expensesRepository } from "./expensesRepository"
import { AddExpenseInput } from "./inputs/addExpenseInput"
import { EditExpenseInput } from "./inputs/editExpenseInput"

class ExpensesService {
    async addExpense(input: AddExpenseInput) {
        const expenseId = await expensesRepository.addExpense(input)
        return expenseId
    }

    async editExpense(input: EditExpenseInput) {
        const editedExpense = await expensesRepository.editExpense(input)
        return editedExpense
    }

    async deleteExpense(expenseId: string, userId: string) {
        const deletedExpense = await expensesRepository.deleteExpense(expenseId, userId)
        return deletedExpense
    }

    async getCategoryExpenses(categoryId: string, userId: string) {
        const categoryExpenses = await expensesRepository.getCategoryExpenses(categoryId, userId)
        return categoryExpenses
    }

    async getExpenses(userId: string) {
        const allExpences = await expensesRepository.getExpenses(userId)
        return allExpences
    }

    async getExpensesSum(userId: string) {
        const expensesSum = await expensesRepository.getExpensesSum(userId)
        return expensesSum
    }

    async getCategoryExpensesSum(userId: string, categoryId: string) {
        const categoryExpensesSum = await expensesRepository.getCategoryExpensesSum(userId, categoryId)
        return categoryExpensesSum
    }

    async updateExpenseCurrency(currency: string, expenseId: string, userId: string) {
        const updatedCurrency = await expensesRepository.updateExpenseCurrency(currency, expenseId, userId)
        return updatedCurrency
    }
}


export const expensesService = new ExpensesService()