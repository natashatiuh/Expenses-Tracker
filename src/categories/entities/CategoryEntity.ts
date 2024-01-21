export class CategoryEntity {
    id: string
    categoryName: string
    creatorId: string
    isFavorite: boolean

    constructor(id: string, categoryName: string, creatorId: string, isFavorite: boolean) {
        this.id = id
        this.categoryName = categoryName
        this.creatorId = creatorId
        this.isFavorite = isFavorite
    } 
}