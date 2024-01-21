import { authorizationService } from "../auth/authServices"
import { SignUpUserInput } from "../auth/inputs/signUpUserInput"
import { pool } from "../common/connection"
import { subscriptionService } from "../subscriptions/subscriptionsService"
import { categoriesService } from "./categoriesServices"
import { AddCategoryInput } from "./inputs/addCategoryInput"
import { EditCategoryInput } from "./inputs/editCategoryInput"

jest.setTimeout(60 * 1000)

describe('Category Service', () => {
    beforeEach(async () => {
        const connection = await pool.getConnection()

        await connection.query('TRUNCATE users')
        await connection.query('TRUNCATE categories')
    })

    test('category should be added and isFavorite should be equal to zero', async () => {
        const userData = new SignUpUserInput('Marta', '12345678', 'Poland')

        const token = await authorizationService.signUp(userData)
        const userId = await authorizationService.verifyToken(token)

        const categoryData = new AddCategoryInput('Sport', userId)
        await categoriesService.addCategory(categoryData)

        const category = await categoriesService.getUserCategory(userId)

        expect(category.length).toEqual(1)
        expect(category[0].name).toEqual('Sport')
        expect(category[0].userWhoCreated).toEqual(userId)
        expect(category[0].isFavorite).toEqual(0)
    })

    test("user without subscription shouldn't add more than 5 categories", async () => {
        const userData = new SignUpUserInput('Milana', '2211334455', 'Belgium')
        
        const token = await authorizationService.signUp(userData)
        const userId = await authorizationService.verifyToken(token)

        const categoryDataOne = new AddCategoryInput('One', userId)
        const categoryDataTwo = new AddCategoryInput('Two', userId)
        const categoryDataThree = new AddCategoryInput('Three', userId)
        const categoryDataFour = new AddCategoryInput('Four', userId)
        const categoryDataFive = new AddCategoryInput('Five', userId)
        const categoryDataSix = new AddCategoryInput('Six', userId)

        await categoriesService.addCategory(categoryDataOne)
        await categoriesService.addCategory(categoryDataTwo)
        await categoriesService.addCategory(categoryDataThree)
        await categoriesService.addCategory(categoryDataFour)
        await categoriesService.addCategory(categoryDataFive)
        await categoriesService.addCategory(categoryDataSix)

        const categories = await categoriesService.getUserCategory(userId)

        expect(categories[5]).toBeUndefined()
        expect(categories.length).toEqual(5)
    })

    test("user with subscription should add as many categories as they want, no limits", async () => {
        const userData = new SignUpUserInput('Ann', '12345678', 'Hungary')
        
        const token = await authorizationService.signUp(userData)
        const userId = await authorizationService.verifyToken(token)

        await subscriptionService.addSubscription(userId)

        const categoryDataOne = new AddCategoryInput('One', userId)
        const categoryDataTwo = new AddCategoryInput('Two', userId)
        const categoryDataThree = new AddCategoryInput('Three', userId)
        const categoryDataFour = new AddCategoryInput('Four', userId)
        const categoryDataFive = new AddCategoryInput('Five', userId)
        const categoryDataSix = new AddCategoryInput('Six', userId)
        const categoryDataSeven = new AddCategoryInput('Seven', userId)

        await categoriesService.addCategory(categoryDataOne)
        await categoriesService.addCategory(categoryDataTwo)
        await categoriesService.addCategory(categoryDataThree)
        await categoriesService.addCategory(categoryDataFour)
        await categoriesService.addCategory(categoryDataFive)
        await categoriesService.addCategory(categoryDataSix)
        await categoriesService.addCategory(categoryDataSeven)

        const categories = await categoriesService.getUserCategory(userId)

        expect(categories.length).toEqual(7)
    })

    test('user should get edited category', async () => {
        const userData = new SignUpUserInput('Barbara', 'fyru4884', 'India')

        const token = await authorizationService.signUp(userData)
        const userId = await authorizationService.verifyToken(token)

        const categoryData = new AddCategoryInput("Restaurants", userId)
        await categoriesService.addCategory(categoryData)
        const category = await categoriesService.getUserCategory(userId)

        const categoryId = category[0].id

        const editedCategoryData = new EditCategoryInput("Food", categoryId, userId)
        await categoriesService.editCategory(editedCategoryData)
        const editedCategory = await categoriesService.getUserCategory(userId)

        expect(editedCategory[0].name).toEqual('Food')
        expect(editedCategory[0].id).toEqual(categoryId)
        expect(editedCategory[0].userWhoCreated).toEqual(userId)
    })

    test('category should be deleted', async () => {
        const userData = new SignUpUserInput('Monika', '56439i3nf9', 'Albania')
        
        const token = await authorizationService.signUp(userData)
        const userId = await authorizationService.verifyToken(token)

        const categoryData = new AddCategoryInput("Beauty", userId)
        await categoriesService.addCategory(categoryData)

        const category = await categoriesService.getUserCategory(userId)
        const categoryId = await category[0].id

        await categoriesService.deleteCategory(categoryId, userId)
        const deletedCategory = await categoriesService.getUserCategory(userId)

        expect(deletedCategory.length).toEqual(0)
    }) 

    test('category should be favorite', async () => {
        const userData = new SignUpUserInput('John', '12345678', 'Slovakia')
        
        const token = await authorizationService.signUp(userData)
        const userId = await authorizationService.verifyToken(token)

        const categoryData = new AddCategoryInput('Restaurants', userId)
        await categoriesService.addCategory(categoryData)

        const category = await categoriesService.getUserCategory(userId)
        const categoryId = category[0].id

        await categoriesService.makeCategoryFavorite(categoryId, userId)
        const favoriteCategory = await categoriesService.getUserCategory(userId)

        expect(favoriteCategory[0].isFavorite).toEqual(1)
    })

    test ("category shouldn't be favorite", async () => {
        const userData = new SignUpUserInput('Kate', 'fo33e3r', 'France')

        const token = await authorizationService.signUp(userData)
        const userId = await authorizationService.verifyToken(token)

        const categoryData = new AddCategoryInput('Groceries', userId)
        await categoriesService.addCategory(categoryData)
        const category = await categoriesService.getUserCategory(userId)
        const categoryId = category[0].id

        await categoriesService.makeCategoryFavorite(categoryId, userId)
        const favoriteCategory = await categoriesService.getUserCategory(userId)

        await categoriesService.makeCategoryNotFavorite(categoryId, userId)
        const notFavoriteCategory = await categoriesService.getUserCategory(userId)

        expect(favoriteCategory[0].isFavorite).toEqual(1)
        expect(notFavoriteCategory[0].isFavorite).toEqual(0)
    })

    test ('should get all user categories', async () => {
        const userData = new SignUpUserInput('Mark', '32345frv', 'Turkey')

        const token = await authorizationService.signUp(userData)
        const userId = await authorizationService.verifyToken(token)

        const categoryDataOne = new AddCategoryInput('Food', userId)
        const categoryDataTwo = new AddCategoryInput('Beauty', userId)
        const categoryDataThree = new AddCategoryInput('Education', userId)

        await categoriesService.addCategory(categoryDataOne)
        await categoriesService.addCategory(categoryDataTwo)
        await categoriesService.addCategory(categoryDataThree)

        const categories = await categoriesService.getUserCategory(userId)

        expect(categories.length).toEqual(3)
    })

    test('user shoul get only their categories', async () => {
        const userDataOne = new SignUpUserInput("Nina", "12345678", 'Greece')
        const userDataTwo = new SignUpUserInput("Mary", "223345432", "Romania")
        
        const tokenOne = await authorizationService.signUp(userDataOne)
        const tokenTwo = await authorizationService.signUp(userDataTwo)

        const userIdOne = await authorizationService.verifyToken(tokenOne)
        const userIdTwo = await authorizationService.verifyToken(tokenTwo)

        const userOneCategoryData = new AddCategoryInput("User1", userIdOne)
        const userTwoCategoryData = new AddCategoryInput("User2", userIdTwo)

        await categoriesService.addCategory(userOneCategoryData)
        await categoriesService.addCategory(userTwoCategoryData)

        const userOneCategory = await categoriesService.getUserCategory(userIdOne)
        const userTwoCategory = await categoriesService.getUserCategory(userIdTwo)

        expect(userOneCategory[0].name).toEqual('User1')
        expect(userTwoCategory[0].name).toEqual('User2')
    })
})