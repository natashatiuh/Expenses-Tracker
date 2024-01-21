import { categoriesRepository } from "./categoriesRepository";
import { AddCategoryInput } from "./inputs/addCategoryInput";
import { CategoryEntity } from "./entities/CategoryEntity";
import { EditCategoryInput } from "./inputs/editCategoryInput";


class CategoriesService {
    async addCategory(input: AddCategoryInput) {

        const categoryId = await categoriesRepository.addCategory(input)
        return categoryId
    }

    async editCategory(input: EditCategoryInput) {
        const wasCategoryEdited = await categoriesRepository.editCategory(input)

        const isFavorite = await categoriesRepository.checkIfCategoryIsFavorite(input.categoryId)

        const editedCategory = new CategoryEntity(input.newName, input.categoryId, input.creatorId, isFavorite)

        if (wasCategoryEdited === true) return editedCategory
        return false 
    }

    async deleteCategory(categoryId: string, userId: string) {
        const deletedCategory = await categoriesRepository.deleteCategory(categoryId, userId)
        return deletedCategory
    }

    async makeCategoryFavorite(categoryId: string, userId: string) {
        const favoriteCategory = await categoriesRepository.makeItFavorite(categoryId, userId)
        return favoriteCategory
    }

    async makeCategoryNotFavorite(categoryId: string, userId: string) {
        const notFavoriteCategory = await categoriesRepository.deleteFromFavorites(categoryId, userId)
        return notFavoriteCategory
    }

    async getUserCategory(userId: string) {
        const userCategories = await categoriesRepository.getUserCategories(userId)
        return userCategories
    }
}

export const categoriesService = new CategoriesService()