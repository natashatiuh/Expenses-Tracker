import { pool } from "../common/connection"

class SubscriptionsRepository {
    async addSubscription(userId: string) {
        const connection = await pool.getConnection()
        try {
            const currentDate = new Date()
            const oneYearLater = new Date(currentDate)
            oneYearLater.setFullYear(currentDate.getFullYear() + 1)

            const query = `
            UPDATE users 
            SET subscriptionExpiresAt = ?
            WHERE id = ?
            `
            const params = [oneYearLater, userId]

            const [addSubscriptionRows] : any = await connection.query(query, params)
            if (addSubscriptionRows.affectedRows < 0) return false
            return true

        } finally {
            connection.release()
        }
        
    }

    async deleteSubscription(userId: string) {
        const connection = await pool.getConnection()
        try {
            const query = `
            UPDATE users
            SET subscriptionExpiresAt = null
            WHERE id = ?
            `
            const params = [userId]

            const [deleteSubscribtionRows]: any = await connection.query(query, params)
            if (deleteSubscribtionRows.affectedRows < 0) return false
            return true 
            
        } finally {
            connection.release()
        }
        
    }
}

export const subscriptionsRepository = new SubscriptionsRepository()