import { v4 } from "uuid";
import { AddCategoryInput } from "./inputs/addCategoryInput";
import { pool } from "../common/connection";
import { EditCategoryInput } from "./inputs/editCategoryInput";
const cc = require('currency-codes')

class CategoriesRepository {
    async addCategory(input: AddCategoryInput) {
        const connection = await pool.getConnection()
        try {
            const date = new Date()
            const currency = null;

            const hasUserSubscription = await this.checkIfUserHasSubscription(input.creatorId)
        
            const categoryId = v4()
            const isFavorite = false

            const query = `
            INSERT INTO categories (id, name, userWhoCreated, isFavorite, date, monthBudget, currency)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            `
            const params = [categoryId, input.categoryName, input.creatorId, isFavorite, date, input.monthBudget, currency]

            const userCategoriesAmount = await this.getUserCategories(input.creatorId)

            if (hasUserSubscription || (userCategoriesAmount.length <= 4 && !hasUserSubscription)) {
                await connection.query(query, params)
            } else {
                return false
        }

            return true

        } finally {
            connection.release()
        }
        
    }

    async editCategory(input: EditCategoryInput) {
        const connection = await pool.getConnection()
        try {
            const query = `
            UPDATE categories 
            SET name = ?
            WHERE id = ?
            `

            const params = [input.newName, input.categoryId]
            const [editedCategory]: any = await connection.query(query, params)
            connection.release()
            if (editedCategory.affectedRows < 0) return false

            return true
        } finally {
            connection.release()
        }
        
    }

    async checkIfCategoryIsFavorite(categoryId: string) {
        const connection = await pool.getConnection()

        const query = `
        SELECT isFavorite
        FROM categories
        WHERE id = ?
        `
        const params = [categoryId]
        const [isFavorite]: any = await connection.query(query, params)
        connection.release()

        return isFavorite 
    }

    async deleteCategory(categoryId: string, userId: string) {
        const connection = await pool.getConnection()
        try {
            const query = `
            DELETE FROM categories 
            WHERE id = ?
            `
            const params = [categoryId]
            const [deletedCategory]: any = await connection.query(query, params)
            if (deletedCategory.affectedRows < 0) return false

            return true

        } finally {
            connection.release()
        }
        
    }

    async makeItFavorite(categoryId: string, userId: string) {
        const connection = await pool.getConnection()
        try {
            const query = `
            UPDATE categories
            SET isFavorite = ?
            WHERE id = ? AND isFavorite = ?
            `
            const params = [true, categoryId, false]
            const [favoriteCategory]: any = await connection.query(query, params)
            if (favoriteCategory.affectedRows < 0) return false

            return true

        } finally {
            connection.release()
        }
        
    }

    async deleteFromFavorites(categoryId: string, userId: string) {
        const connection = await pool.getConnection()
        try {
            const query = `
            UPDATE categories 
            SET isFavorite = ?
            WHERE id = ? AND isFavorite = ?
            `
            const params = [false, categoryId, true]
            const [notFavoriteCategory]: any = await connection.query(query, params)
            if (notFavoriteCategory.affectedRows < 0) return false

            return true

        } finally {
            connection.release()
        }

        
    }

    async getUserCategories(userId: string) {
        const connection = await pool.getConnection()
        try {
            const query = `
                SELECT id, name, userWhoCreated, isFavorite, date, monthBudget, currency
                FROM categories 
                WHERE userWhoCreated = ?
                ORDER BY date DESC
                `
            const params = [userId]

            const [userCategories]: any = await connection.query(query, params)
            if (userCategories.length < 0) return false
            return userCategories
            
        } finally {
             connection.release()
        }
    }

    async checkIfUserHasSubscription(userId: string) {
        const connection = await pool.getConnection()
        try {
            const query = `
                SELECT subscriptionExpiresAt
                FROM users
                WHERE id = ?
            `
            const params = [userId]
    
            const [subscriptionExpiresAt]: any = await connection.query(query, params)
            if (subscriptionExpiresAt[0].subscriptionExpiresAt === null) return false
    
            return true

        } finally {
            connection.release()
        }
    }
}

export const categoriesRepository = new CategoriesRepository()