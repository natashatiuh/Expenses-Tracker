export class EditCategoryInput {
    newName: string
    categoryId: string
    creatorId: string

    constructor(newName: string, categoryId: string, creatorId: string) {
        this.newName = newName
        this.categoryId = categoryId
        this.creatorId = creatorId
    }
} 