import { authorizationService } from "../auth/authServices"
import { SignUpUserInput } from "../auth/inputs/signUpUserInput"
import { categoriesService } from "../categories/categoriesServices"
import { AddCategoryInput } from "../categories/inputs/addCategoryInput"
import { EditCategoryInput } from "../categories/inputs/editCategoryInput"
import { pool } from "../common/connection"
import { subscriptionService } from "../subscriptions/subscriptionsService"
import { budgetService } from "./budgetService"

jest.setTimeout(60 * 1000)

describe('Budget Service', () => {
    beforeEach(async () => {
        const connection = await pool.getConnection()

        await connection.query('TRUNCATE users')
        await connection.query('TRUNCATE categories')
    })

    test('budget should be added to the category ONLY if user has a subscription', async () => {
        const userDataOne = new SignUpUserInput("Marta is Subscribed", "fh3u2rhhwj", "Germany")
        const userDataTwo = new SignUpUserInput("Milana NoSubscription", '483824903', 'Slovakia')

        const tokenOne = await authorizationService.signUp(userDataOne)
        const tokenTwo = await authorizationService.signUp(userDataTwo)

        const userIdWithSubscription = await authorizationService.verifyToken(tokenOne)
        const userIdNoSubscription = await authorizationService.verifyToken(tokenTwo)

        await subscriptionService.addSubscription(userIdWithSubscription)

        const categoryDataOne = new AddCategoryInput("Subscriptions", userIdWithSubscription)
        const categoryDataTwo = new AddCategoryInput("Food", userIdNoSubscription)

        await categoriesService.addCategory(categoryDataOne)
        await categoriesService.addCategory(categoryDataTwo)

        const categoryWithSubscription = await categoriesService.getUserCategory(userIdWithSubscription)
        const categoryNoSubscription = await categoriesService.getUserCategory(userIdNoSubscription)

        const categoryWithSubscriptionId = categoryWithSubscription[0].id
        const categoryNoSubscriptionId = categoryNoSubscription[0].id
        
        await budgetService.addBudget(150, categoryWithSubscriptionId, userIdWithSubscription)
        await budgetService.addBudget(150, categoryNoSubscriptionId, userIdNoSubscription) 

        const categoryWithBudget = await budgetService.getAllCategoriesBudget(userIdWithSubscription)
        const categoryNoBudget = await budgetService.getAllCategoriesBudget(userIdNoSubscription)

        expect(categoryWithBudget[0].monthBudget).toEqual(150)
        expect(categoryNoBudget).toEqual(undefined)
    })

    test("currency should be suitable for a country of user", async () => {
        const userData = new SignUpUserInput("Jessica", "12345678", "Spain")

        const token = await authorizationService.signUp(userData)
        const userId = await authorizationService.verifyToken(token)

        await subscriptionService.addSubscription(userId)

        const categoryData = new AddCategoryInput("Sport", userId)
        await categoriesService.addCategory(categoryData)

        const category = await categoriesService.getUserCategory(userId)
        const categoryId = category[0].id

        await budgetService.addBudget(250, categoryId, userId)

        const budget = await budgetService.getAllCategoriesBudget(userId)

        expect(budget[0].currency).toEqual('EUR')
    })

    test("category should be created by user who adding budget", async () => {
        const userDataOne = new SignUpUserInput("Mark", "fk34rj3j4", "Italy")
        const userDataTwo = new SignUpUserInput("Sophie", "3h4riuhff", "Ukraine")

        const tokenOne = await authorizationService.signUp(userDataOne)
        const tokenTwo = await authorizationService.signUp(userDataTwo)

        const userIdOne = await authorizationService.verifyToken(tokenOne)
        const userIdTwo = await authorizationService.verifyToken(tokenTwo)

        await subscriptionService.addSubscription(userIdOne)
        await subscriptionService.addSubscription(userIdTwo)

        const categoryDataOne = new AddCategoryInput("Food", userIdOne)
        const categoryDataTwo = new AddCategoryInput("Restaurants", userIdTwo)

        await categoriesService.addCategory(categoryDataOne)
        await categoriesService.addCategory(categoryDataTwo)

        const categoryOne = await categoriesService.getUserCategory(userIdOne)
        const categoryTwo = await categoriesService.getUserCategory(userIdTwo)

        const categoryIdOne = categoryOne[0].id
        const categoryIdTwo = categoryTwo[0].id

        await budgetService.addBudget(300, categoryIdOne, userIdTwo)
        await budgetService.addBudget(200, categoryIdTwo, userIdTwo)

        const budget = await budgetService.getAllCategoriesBudget(userIdTwo)

        expect(budget.length).toEqual(1)
        expect(budget[0].monthBudget).toEqual(200)
    })

    test('monthBudget and currency should be equal NULL after deleting', async () => {
        const userData = new SignUpUserInput("Lana", "12345678", "Egypt")

        const token = await authorizationService.signUp(userData)
        const userId = await authorizationService.verifyToken(token)

        await subscriptionService.addSubscription(userId)

        const categoryData = new AddCategoryInput("Beauty", userId)
        await categoriesService.addCategory(categoryData)

        const category = await categoriesService.getUserCategory(userId)
        const categoryId = category[0].id

        await budgetService.addBudget(50, categoryId, userId)
        const budget = await budgetService.getAllCategoriesBudget(userId)

        await budgetService.deleteBudget(categoryId, userId)
        const deletedBudget = await budgetService.getAllCategoriesBudget(userId)

        expect(budget[0].monthBudget).toEqual(50)
        expect(budget[0].currency).toEqual("EGP")
        expect(deletedBudget[0].monthBudget).toEqual(null)
        expect(deletedBudget[0].currency).toEqual(null)
    })

    test ("should get all categories budget", async () => {
        const userData = new SignUpUserInput("Daisy", "djoi3irmr", "Bulgaria")

        const token = await authorizationService.signUp(userData)
        const userId = await authorizationService.verifyToken(token)

        await subscriptionService.addSubscription(userId)

        const categoryDataOne = new AddCategoryInput("Beauty", userId)
        const categoryDataTwo = new AddCategoryInput("Food", userId)
        const categoryDataThree = new AddCategoryInput("Education", userId)


        await categoriesService.addCategory(categoryDataOne)
        await categoriesService.addCategory(categoryDataTwo)
        await categoriesService.addCategory(categoryDataThree)

        const categories = await categoriesService.getUserCategory(userId)

        const categoryIdOne = categories[0].id
        const categoryIdTwo = categories[1].id
        const categoryIdThree = categories[2].id

        await budgetService.addBudget(200, categoryIdOne, userId)
        await budgetService.addBudget(300, categoryIdTwo, userId)
        await budgetService.addBudget(400, categoryIdThree, userId) 

        const categoriesBudget = await budgetService.getAllCategoriesBudget(userId)

        expect(categoriesBudget.length).toEqual(3)
    })

    test("should get sum of all categories budget", async () => {
        const userData = new SignUpUserInput("Melody", "12121212", "Canada") 
        
        const token = await authorizationService.signUp(userData)
        const userId = await authorizationService.verifyToken(token)

        await subscriptionService.addSubscription(userId)

        const categoryDataOne = new AddCategoryInput("Food", userId)
        const categoryDataTwo = new AddCategoryInput("Beauty", userId)
        const categoryDataThree = new AddCategoryInput("Sport", userId)

        await categoriesService.addCategory(categoryDataOne)
        await categoriesService.addCategory(categoryDataTwo)
        await categoriesService.addCategory(categoryDataThree)

        const categories = await categoriesService.getUserCategory(userId)

        const categoryIdOne = categories[0].id
        const categoryIdTwo = categories[1].id
        const categoryIdThree = categories[2].id

        await budgetService.addBudget(250, categoryIdOne, userId)
        await budgetService.addBudget(200, categoryIdTwo, userId)
        await budgetService.addBudget(50, categoryIdThree, userId)

        const budgetSum = await budgetService.sumMonthBudget(userId)

        expect(budgetSum.monthBudgetSum).toEqual('500')
    })

    test("should get updated budget", async () => {
        const userData = new SignUpUserInput("Mia", "hri38u5ijr", "Greece") 

        const token = await authorizationService.signUp(userData)
        const userId = await authorizationService.verifyToken(token)

        const categoryData = new AddCategoryInput("Clothes", userId)
        await categoriesService.addCategory(categoryData)

        const category = await categoriesService.getUserCategory(userId)
        const categoryId = category[0].id

        const editedCategoryData = new EditCategoryInput("Dresses", categoryId, userId)
        await categoriesService.editCategory(editedCategoryData)

        const editedCategory = await categoriesService.getUserCategory(userId)

        expect(category[0].name).toEqual("Clothes")
        expect(editedCategory[0].name).toEqual("Dresses")
    })
})