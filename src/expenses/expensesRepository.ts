import { v4 } from "uuid";
import { pool } from "../common/connection";
import { AddExpenseInput } from "./inputs/addExpenseInput";
import { EditExpenseInput } from "./inputs/editExpenseInput";
import { categoriesService } from "../categories/categoriesServices";
import { AddCategoryInput } from "../categories/inputs/addCategoryInput";
import { budgetRepository } from "../budget/budgetRepository";
import { categoriesRepository } from "../categories/categoriesRepository";


class ExpensesRepository {
    async addExpense(input: AddExpenseInput) {
        const connection = await pool.getConnection()

        const date = new Date();

        const currency = await budgetRepository.getUserCurrency(input.userId)

        const query = `
        INSERT INTO expenses (id, userId, expenseName, categoryId, moneyAmount, currency, date)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `
        const expenseId = v4()
        const params = [expenseId, input.userId, input.expenseName, input.categoryId, input.moneyAmount, currency, date]
        await connection.query(query, params)
        connection.release()

        return expenseId
    }

    async editExpense(input: EditExpenseInput) {
        const connection = await pool.getConnection()
        try {
            // Build update fields part of the query
            const updates = []
            const params = []

            if (input.expenseName !== undefined) {
                updates.push('expenseName = ?')
                params.push(input.expenseName)
            }
        

            if (input.categoryId !== undefined) {
                updates.push('categoryId = ?')
                params.push(input.categoryId)
            }

            if (input.moneyAmount !== undefined) {
                updates.push('moneyAmount = ?')
                params.push(input.moneyAmount)
            }

            if (input.currency !== undefined) {
                updates.push('currency = ?')
                params.push(input.currency)
            }

            params.push(input.expenseId, input.userId)
            console.log(input.userId)

            const updateStr = updates.join(",")

            // Execute query
            const query = `UPDATE expenses SET ${updateStr} WHERE id = ? AND userId = ?`

            const [rows]: any = await connection.query(query, params)

            const editedExpense = await this.getExpense(input.expenseId)

            if(rows.affectedRows < 0) return false

            return editedExpense

        } finally {
            connection.release()
        }
        
    }

    async deleteExpense(expenseId: string, userId: string) {
        const connection = await pool.getConnection()
        try {
            const query = `
            DELETE FROM expenses
            WHERE id = ? AND userId = ?
            `
            const params = [expenseId, userId]
            const [deletedExpense]: any = await connection.query(query, params)
            if(deletedExpense.affectedRows > 0) return true
            connection.release()

            return false

        } finally {
            connection.release()
        }
        
    }

    async getCategoryExpenses(categoryId: string, userId: string) {
        const connection = await pool.getConnection()
        try {
            const query = `
            SELECT id, userId, expenseName, categoryId, moneyAmount, currency, date 
            FROM expenses 
            WHERE categoryId = ? AND userId = ?
            ORDER BY date DESC
            `
            const params = [categoryId, userId] 
            const [categoryExpenses]: any = await connection.query(query, params)
            if (categoryExpenses.length > 0) return categoryExpenses

            return false

        } finally {
            connection.release()
        }
        
    }

    async getExpenses(userId: string) {
        const connection = await pool.getConnection()

        const query = `
        SELECT id, userId, expenseName, categoryId, moneyAmount, currency, date 
        FROM expenses
        WHERE userId = ?
        ORDER BY date DESC
        `
        const params = [userId]
        const [allExpences]: any = await connection.query(query, params)
        connection.release()

        return allExpences
    }

    async getExpensesSum(userId: string) {
        const connection = await pool.getConnection()   
        try {
            const query = `
            SELECT SUM(moneyAmount) AS expensesSum
            FROM expenses
            WHERE userId = ?
            `
            const params = [userId]

            const [expensesSum]: any = await connection.query(query, params)
            if (expensesSum.length <= 0) return false

            return expensesSum[0]

        } finally {
            connection.release()
        }
    }

    async getCategoryExpensesSum(userId: string, categoryId: string) {
        const connection = await pool.getConnection()
        try {
            const query = `
            SELECT SUM(moneyAmount) AS categoryExpensesSum
            FROM expenses
            WHERE userId = ? AND categoryId = ? 
            `
            const params = [userId, categoryId]

            const [categoryExpensesSum]: any = await connection.query(query, params)
            if (categoryExpensesSum.length <= 0) return false

            return categoryExpensesSum[0]

        } finally {
            connection.release()
        }
        
    }

    async getExpense(expenseId: string) {
        const connection = await pool.getConnection()
        try {
           const query = `
            SELECT id, userId, expenseName, categoryId, moneyAmount, currency, date
            FROM  expenses
            WHERE id = ?
            `
            const params = expenseId

            const [editedExpense]: any = await connection.query(query, params)

            if(editedExpense.affectedRows < 0) return false

            return editedExpense 

        } finally {
            connection.release()
        }
    }

    async checkIfCategoryExists(categoryId: string) {
        const connection = await pool.getConnection()
        try {
            const query = `
            SELECT id, name FROM categories
            WHERE id = ?
            `
            const params = [categoryId]

            const [categoryRows]: any = await connection.query(query, params)

            if (categoryRows.affectedRows < 0) return false

            return true

        } finally {
            connection.release()
        }
    }

    async updateExpenseCurrency(currency: string, expenseId: string, userId: string) {
        const connection = await pool.getConnection()
        try {
            const hasUserSubscription = await categoriesRepository.checkIfUserHasSubscription(userId)

            const query = `
            UPDATE expenses 
            SET currency = ?
            WHERE id = ? AND userId = ?
            `
            const params = [currency, expenseId, userId]

            if (!hasUserSubscription) return

            const [updatedCurrency]: any = await connection.query(query, params)
            if (updatedCurrency.affectedRows <= 0) return false

            return true

        } finally {
            connection.release()
        }
    }
}

export const expensesRepository = new ExpensesRepository()