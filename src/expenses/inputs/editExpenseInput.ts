export class EditExpenseInput {
    expenseId: string
    userId: string
    expenseName?: string
    categoryId?: string
    moneyAmount?: number
    currency?: string

    constructor(expenseId: string, userId: string, expenseName?: string, categoryId?: string, moneyAmount?: number, currency?: string) {
        this.expenseId = expenseId,
        this.userId = userId
        this.expenseName = expenseName
        this.categoryId = categoryId
        this.moneyAmount = moneyAmount
        this.currency = currency
    }
}