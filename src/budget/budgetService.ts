import { authorizationRepository } from "../auth/authRepository";
import { authorizationService } from "../auth/authServices";
import { budgetRepository } from "./budgetRepository";

class BudgetService {
    async addBudget(budget: number, categoryId: string, userId: string) {
        const currency = await budgetRepository.getUserCurrency(userId)
        console.log(currency)
        const wasBudgetAdded = await budgetRepository.addBudget(budget, categoryId, userId, currency)
        return wasBudgetAdded
    }

    async deleteBudget(categoryId: string, userId: string) {
        const wasBudgetDeleted = await budgetRepository.deleteBudget(categoryId, userId)
        return wasBudgetDeleted
    }

    async getAllCategoriesBudget(userId: string) {
        const categoriesBudget = await budgetRepository.getAllCategoriesBudget(userId)
        return categoriesBudget
    }

    async sumMonthBudget(userId: string) {
        const sumMonthBudget = await budgetRepository.getBudgetSum(userId)
        return sumMonthBudget
    }

    async updateBudgetCurrency(currency: string, categoryId: string, userId: string) {
        const changedCurrency = await budgetRepository.updateBudgetCurrency(currency, categoryId, userId)
        return changedCurrency
    }
}

export const budgetService = new BudgetService()