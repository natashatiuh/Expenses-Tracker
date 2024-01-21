export class addMonthBudgetInput {
    categoryId: string
    userId: string
    monthBudget?: number

    constructor(categoryId: string, userId: string, monthBudget?: number) {
        this.categoryId = categoryId,
        this.userId = userId,
        this.monthBudget = monthBudget
    }
}