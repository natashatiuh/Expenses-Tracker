import { categoriesRepository } from "../categories/categoriesRepository";
import { pool } from "../common/connection";
const cc = require("currency-codes")

class BudgetRepository {
    async addBudget(budget: number, categoryId: string, userId: string, currency: string) {
        const connection = await pool.getConnection()
        try {
            const hasUserSubscription = await categoriesRepository.checkIfUserHasSubscription(userId)

            console.log(currency)
            console.log(userId)

            const query = `
            UPDATE categories
            SET monthBudget = ?, currency = ?
            WHERE id = ? AND userWhoCreated = ?
            `
            const params = [budget, currency, categoryId, userId]

            if (!hasUserSubscription) return  
        
            const [addedBudgetRows]: any = await connection.query(query, params)
            console.log(addedBudgetRows)
            if (addedBudgetRows.affectedRows == 0) return false
        
            return true

        } finally {
            connection.release()
        }
        
    }

    async deleteBudget(categoryId: string, userId: string) {
        const connection = await pool.getConnection()
        try {
            const hasUserSubscription = await categoriesRepository.checkIfUserHasSubscription(userId)

            const query = `
            UPDATE categories
            SET monthBudget = null, currency = null
            WHERE id = ? AND userWhoCreated = ?
            `
            const params = [categoryId, userId]

            if (!hasUserSubscription) return

            const [deletedBudgetRows] : any = await connection.query(query, params)
            if (deletedBudgetRows < 0) return false
            return true

        } finally {
            connection.release()
        }
        
    }

    async getAllCategoriesBudget(userId: string) {
        const connection= await pool.getConnection()
        try {
            const hasUserSubscription = await categoriesRepository.checkIfUserHasSubscription(userId)

            const query = `
            SELECT id, name, monthBudget, currency 
            FROM categories
            WHERE userWhoCreated = ?
            `
            const params = [userId]

            if (!hasUserSubscription) return

            const [categoriesBudget]: any = await connection.query(query, params)
            if (categoriesBudget.length <= 0) return false
            return categoriesBudget

        } finally {
            connection.release()
        }
        
    }

    async getBudgetSum(userId: string) {
        const connection = await pool.getConnection()

        const query = `
        SELECT SUM(monthBudget) AS monthBudgetSum
        FROM categories
        WHERE userWhoCreated = ?
        `
        const params = [userId]

        const [budgetSum]: any = await connection.query(query, params)
        connection.release()

        return budgetSum[0]
    }

    async getUserCurrency(userId: string) {
        const connection = await pool.getConnection()
       
        const query = `
        SELECT country FROM users
        WHERE id = ?
        `
        const params = [userId]
        const [countryRows]: any = await connection.query(query, params)
        const country = countryRows[0].country
        console.log(country)
        const userCountry = cc.country(country)
        const currency = userCountry[0].code
        connection.release()

        return currency
    }

    async updateBudgetCurrency(currency: string, categoryId: string, userId: string) {
        const connection = await pool.getConnection()
        try {
            const hasUserSubscription = await categoriesRepository.checkIfUserHasSubscription(userId)

            const query = `
            UPDATE categories
            SET currency = ?
            WHERE id = ? AND userWhoCreated = ?
            `
            const params = [currency, categoryId, userId]

            if (!hasUserSubscription) return

            const [changedCategoryRows]: any = await connection.query(query, params)

            if (changedCategoryRows.affectedRows <= 0) return false
        
            return true
            
        } finally {
            connection.release()
        }
        
    }
}

export const budgetRepository = new BudgetRepository()