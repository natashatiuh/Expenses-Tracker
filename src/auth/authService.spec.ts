import { pool } from "../common/connection"
import { authorizationService } from "./authServices"
import { SignUpUserInput } from "./inputs/signUpUserInput"
import { UpdatePasswordInput } from "./inputs/updatePasswordInput"
import { signUpSchema } from "./schemas/signUpSchema"

jest.setTimeout(60 * 1000)

describe('Authorization Service', () => {
    beforeEach(async () => {
        const connection = await pool.getConnection()
        await connection.query('TRUNCATE users')
    })

    test('should be created new user', async () => {
        const userData = new SignUpUserInput('Kateryna', '12345678', 'Slovakia')

        const token = await authorizationService.signUp(userData)
        const userId = await authorizationService.verifyToken(token)

        const user = await authorizationService.getUser(userId)
        
        expect(user.userName).toEqual('Kateryna')
        expect(user.password).toEqual('12345678')
        expect(user.country).toEqual('Slovakia')
    }) 

    test('signInUserId should be the same as signUpUserId', async () => {
        const userData = new SignUpUserInput('Marta', '22334455', 'Spain')
        const signUpToken = await authorizationService.signUp(userData)
        const signUpUserId = await authorizationService.verifyToken(signUpToken)

        const signInToken = await authorizationService.signIn('Marta', '22334455')
        const signInUserId = await authorizationService.verifyToken(signInToken)

        expect(signUpUserId).toEqual(signInUserId)
    })

    test("currency should be suitable for user's country", async () => {
        const firstUserData = new SignUpUserInput('Milana', '11111111', 'Ukraine')
        const secondUserData = new SignUpUserInput('Tania', '22222222', 'Germany')

        const firstUserToken = await authorizationService.signUp(firstUserData)
        const secondUserToken = await authorizationService.signUp(secondUserData)

        const firstUserId = await authorizationService.verifyToken(firstUserToken)
        const secondUserId = await authorizationService.verifyToken(secondUserToken)

        const firstUser = await authorizationService.getUser(firstUserId)
        const secondUser = await authorizationService.getUser(secondUserId)

        expect(firstUser.country).toEqual('Ukraine')
        expect(firstUser.currency).toEqual('Hryvnia')
        expect(secondUser.country).toEqual('Germany')
        expect(secondUser.currency).toEqual('Euro')
    })

    test("subscriptionExpiresAt should be equal NULL after signUp", async () => {
        const userData = new SignUpUserInput('Carly', '12341234', 'Italy')
        
        const token = await authorizationService.signUp(userData)
        const userId = await authorizationService.verifyToken(token)

        const user = await authorizationService.getUser(userId)

        expect(user.subscriptionExpiresAt).toEqual(null)
    }) 

    test("user's name should be changed", async () => {
        const userData = new SignUpUserInput('Mark', '21324354', 'Australia')

        const token = await authorizationService.signUp(userData)
        const userId = await authorizationService.verifyToken(token)

        await authorizationService.changeName('Markus', userId)
        const updatedUser = await authorizationService.getUser(userId)

        expect(updatedUser.userName).toEqual('Markus')
    })

    test ("user's password should be changed", async () => {
        const userData = new SignUpUserInput('Julia', 'qwerty12', 'Norway')

        const token = await authorizationService.signUp(userData)
        const userId = await authorizationService.verifyToken(token)

        const updatePasswordData = new UpdatePasswordInput('asdfgh123', 'qwerty12', userId)
        await authorizationService.changePassword(updatePasswordData)

        const updatedUser = await authorizationService.getUser(userId)

        expect(updatedUser.password).toEqual('asdfgh123')
    })

    test("user's country should be changed and currency should be updated", async () => {
        const userData = new SignUpUserInput('Kimberly', 'hfi3u498u4', 'France')

        const token = await authorizationService.signUp(userData)
        const userId = await authorizationService.verifyToken(token)

        await authorizationService.changeCountry('Ukraine', userId)
        const updatedUser = await authorizationService.getUser(userId)

        expect(updatedUser.country).toEqual('Ukraine')
        expect(updatedUser.currency).toEqual('Hryvnia')
    })

    test("user should be deleted", async () => {
        const userData = new SignUpUserInput('Monica', '098765432', 'China')

        const token = await authorizationService.signUp(userData)
        const userId = await authorizationService.verifyToken(token)

        await authorizationService.deleteAccount(userId)

        const user = await authorizationService.getUser(userId)

        expect(user).toEqual(undefined)
    })
})