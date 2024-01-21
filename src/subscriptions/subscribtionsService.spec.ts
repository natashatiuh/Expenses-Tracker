import { authorizationService } from "../auth/authServices"
import { SignUpUserInput } from "../auth/inputs/signUpUserInput"
import { pool } from "../common/connection"
import { subscriptionService } from "./subscriptionsService"

jest.setTimeout(60 * 1000)

describe("Subscriptions Service", () => {
    beforeEach(async () => {
        const connection = await pool.getConnection()
        await connection.query('TRUNCATE users')
    })

    test("expiration date shouldn't equal null after adding subscription", async () => {
        const userData = new SignUpUserInput("Marta", "34849rjj", "Ukraine")
        
        const token = await authorizationService.signUp(userData)
        const userId = await authorizationService.verifyToken(token)

        const user = await authorizationService.getUser(userId)

        await subscriptionService.addSubscription(userId)

        const userWithSubscription = await authorizationService.getUser(userId)

        expect(user.subscriptionExpiresAt).toEqual(null)
        expect(userWithSubscription.subscriptionExpiresAt).not.toEqual(null)
    })

    test("expiration date should equal null afrer deleting subscription", async () => {
        const userData = new SignUpUserInput("Bob", "e8u448jf", "Norway") 
        
        const token = await authorizationService.signUp(userData)
        const userId = await authorizationService.verifyToken(token)

        const user = await authorizationService.getUser(userId)

        await subscriptionService.addSubscription(userId)
        const userWithSubscription = await authorizationService.getUser(userId)

        await subscriptionService.stopSubscription(userId)
        const userWithDeletedSubscription = await authorizationService.getUser(userId)

        expect(user.subscriptionExpiresAt).toEqual(null)
        expect(userWithSubscription.subscriptionExpiresAt).not.toEqual(null)
        expect(userWithDeletedSubscription.subscriptionExpiresAt).toEqual(null)
    }) 
        
})