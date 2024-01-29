import jwt from "jsonwebtoken"
import { authorizationRepository } from "./authRepository";
import { SignUpUserInput } from "./inputs/signUpUserInput";
import { UpdatePasswordInput } from "./inputs/updatePasswordInput";

class AuthorizationService {
    async signUp(input: SignUpUserInput) {
        await authorizationRepository.signUpUser(input)
        const userId = await authorizationRepository.getUserId(input.userName, input.password)
        
        const token = await authorizationRepository.getToken(userId)
        
        return token
    }

    async signIn(userName: string, password: string) {
        const userId = await authorizationRepository.getUserId(userName, password)
        const token = await authorizationRepository.getToken(userId)
        return token
    }

    async changeName(newName: string, userId: string) {
        const changedName = await authorizationRepository.updateName(newName, userId)
        console.log("Id")
        console.log(userId)
        console.log(changedName)
        return changedName
    }

    async changeCountry(newCountry: string, userId: string) {
        const changedCountry = await authorizationRepository.updateCountry(newCountry, userId)
        const user = await authorizationRepository.getUser(userId)
        const updatedCountry = user.country
        await authorizationRepository.updateCurrency(updatedCountry, userId)
        return changedCountry
    }

    async changePassword(input: UpdatePasswordInput) {
        const changedPassword = await authorizationRepository.updatePassword(input)
        return changedPassword
    }

    async deleteAccount(userId: string) {
        const deletedAccount = await authorizationRepository.deleteUser(userId)
        return deletedAccount
    }

    async verifyToken(token: string) {
        const secretKey: any = 'secret_key'
        const tokenInfo: any = jwt.verify(token, secretKey)

        return tokenInfo.userId
    }

    async getUser(userId: string) {
        const user = await authorizationRepository.getUser(userId)
        return user
    }

    async getCurrency(userId: string) {
        const currency = await authorizationRepository.getCurrency(userId)
        return currency
    }

}

export const authorizationService = new AuthorizationService()