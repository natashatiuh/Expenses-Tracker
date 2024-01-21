import { pool } from "../common/connection";
import { v4 } from "uuid";
import jwt from 'jsonwebtoken'
import { SignUpUserInput } from "./inputs/signUpUserInput";
import { UpdatePasswordInput } from "./inputs/updatePasswordInput";
const cc = require('currency-codes');

class AuthorizationRepository {
    async signUpUser(input: SignUpUserInput) {
        const connection = await pool.getConnection()

        const date = new Date()

        const currency = await this.identifyCurrencyByCountry(input.country)

        const query = `
        INSERT INTO users (id, userName, password, country, currency, date, subscriptionExpiresAt) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `

        const userId = v4()
        const params = [userId, input.userName, input.password, input.country, currency, date, null]

        const newUser = await connection.query(query, params)

        connection.release()
        return newUser
    }

    async getToken(userId: string) {
        const token = jwt.sign({userId: userId}, 'secret_key')
        return token
    }

    async getUserId(userName: string, password: string) {
        const connection = await pool.getConnection()

        const query = ` 
        SELECT id FROM users 
        WHERE userName = ? AND password = ?
        `
        const params = [userName, password]
        const [rows]:any = await connection.query(query,params)

        const userId: string = rows[0].id
        connection.release()

        return userId
    }

    async getUser(userId: string) {
        const connection = await pool.getConnection()

        const query = `
        SELECT id, userName, password, country, currency, subscriptionExpiresAt
        FROM users
        WHERE id = ?
        `
        const params = [userId]

        const [user]: any = await connection.query(query, params)
        connection.release()

        return user[0]
    }

    async updateName(newName: string, userId: string) {
        const connection = await pool.getConnection()
        try {
            const query = `
            UPDATE users 
            SET userName = ?
            WHERE id = ?
            `
            const params = [newName, userId]

            const [updatedName]: any = await connection.query(query, params)
            if(updatedName.affectedRows < 0) return false
            
            return true

        } finally {
            connection.release()
        }

    }

    async updateCountry(newCountry: string, userId: string) {
        const connection = await pool.getConnection()
        try {
            const query = `
            UPDATE users
            SET country = ?
            WHERE id = ?
            `
            const params = [newCountry, userId]

            const [updatedCountry]: any = await connection.query(query, params)
            if(updatedCountry.affectedRows < 0) return false

            return true

        } finally {
            connection.release()
        }
        
    }

    async updatePassword(input: UpdatePasswordInput) {
        const connection = await pool.getConnection()
        try {
            const query = `
            UPDATE users
            SET password = ?
            WHERE password = ? AND id = ?
            `
            const params = [input.newPassword, input.oldPassword, input.userId]

            const [updatedPassword]: any = await connection.query(query, params)
            if(updatedPassword.affectedRows < 0) return false

            return true

        } finally {
            connection.release()
        }
        
    }

    async deleteUser(userId: string) {
        const connection = await pool.getConnection()
        try {
           const query = `
            DELETE FROM users 
            WHERE id = ?
            `
            const params = [userId]

            const [deletedUser]: any = await connection.query(query, params)
            if(deletedUser.affectedRows < 0) return false

            return true 

        } finally {
            connection.release()
        }
        
    }

    async identifyCurrencyByCountry(country: string) {
        const userCountry = cc.country(country)
        const currency = userCountry[0].currency
        console.log(currency)
        return currency
    }

    async updateCurrency(country: string, userId: string) {
        const connection = await pool.getConnection()

        const currency = await this.identifyCurrencyByCountry(country)

        const query = `
        UPDATE users
        SET currency = ?
        WHERE id = ?
        `
        const params = [currency, userId]

        await connection.query(query, params)

        connection.release()
    }
}

export const authorizationRepository = new AuthorizationRepository()