export class AddCategoryInput {
    categoryName: string
    creatorId: string
    monthBudget?: number

    constructor(categoryName: string, creatorId: string, monthBudget?: number) {
        this.categoryName = categoryName
        this.creatorId = creatorId
        this.monthBudget = monthBudget
    }
}

