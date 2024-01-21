export class AddExpenseInput {
    userId: string
    expenseName: string
    categoryId: string
    moneyAmount: number

    constructor(userId: string, expenseName: string, categoryId: string, moneyAmount: number) {
        this.userId = userId
        this.expenseName = expenseName
        this.categoryId = categoryId
        this.moneyAmount = moneyAmount
    }
}