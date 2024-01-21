export class EditedExpenseEntity {
    expenseId: string
    userId: string
    expenseName: string
    categoryId: string
    moneyAmount: string
    currency: string

    constructor(expenseId: string, userId: string, expenseName: string, categoryId: string, moneyAmount: string, currency: string) {
        this.expenseId = expenseId
        this.userId = userId
        this.expenseName = expenseName
        this.categoryId = categoryId
        this.moneyAmount = moneyAmount
        this.currency = currency
    }
}