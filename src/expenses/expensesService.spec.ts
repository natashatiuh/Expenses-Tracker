import { authorizationService } from "../auth/authServices"
import { AddCategoryInput } from "../categories/inputs/addCategoryInput"
import { categoriesService } from "../categories/categoriesServices"
import { pool } from "../common/connection"
import { expensesService } from "./expensesService"
import { SignUpUserInput } from "../auth/inputs/signUpUserInput"
import { AddExpenseInput } from "./inputs/addExpenseInput"
import { EditExpenseInput } from "./inputs/editExpenseInput"

jest.setTimeout(60 * 1000)

describe('Expenses Service', () => {
    beforeEach(async () => {
        const connection = await pool.getConnection()

        await connection.query('TRUNCATE expenses')
        await connection.query('TRUNCATE categories')
        await connection.query('TRUNCATE users')
    })
    
    test('should receive new expense after adding', async () => {
        const userData = new SignUpUserInput("fake", "cjwiuehf", "Ukraine")
        const token = await authorizationService.signUp(userData)

        const userId = await authorizationService.verifyToken(token)
        
        const categoryData = new AddCategoryInput("Test Category 3", userId)

        await categoriesService.addCategory(categoryData)

        const category = await categoriesService.getUserCategory(userId)
        const categoryId = await category[0].id
    
        const input: AddExpenseInput = {
            userId: userId,
            expenseName: "Fake",
            categoryId: categoryId,
            moneyAmount: 400,
        }

        await expensesService.addExpense(input)
        const expenses = await expensesService.getExpenses(userId)
    
        const ourCreatedExpense = expenses[0]
    
        expect(ourCreatedExpense).not.toBeUndefined()
        expect(ourCreatedExpense.expenseName).toEqual('Fake')
        expect(ourCreatedExpense.moneyAmount).toEqual(400)
    })

    test('user should receive only his expenses', async () => {
        const firstUserData = new SignUpUserInput("aosdjopasjd", "aksdoask", "Japan")
        const secondUserData = new SignUpUserInput("fake2", "asdasda", "China")

        const firstToken = await authorizationService.signUp(firstUserData)
        const secondToken = await authorizationService.signUp(secondUserData)

        const firstUserId = await authorizationService.verifyToken(firstToken)
        const secondUserId = await authorizationService.verifyToken(secondToken)

        const firstCategoryData = new AddCategoryInput("Food", firstUserId)
        const secondCategoryData = new AddCategoryInput("Groceries", secondUserId)

        await categoriesService.addCategory(firstCategoryData)
        await categoriesService.addCategory(secondCategoryData)

        const firstCategory = await categoriesService.getUserCategory(firstUserId)
        const secondCategory = await categoriesService.getUserCategory(secondUserId)

        const firstCategoryId = firstCategory[0].id
        const secondCategoryId = secondCategory[0].id

        await expensesService.addExpense({
            userId: firstUserId,
            expenseName: "My Groceries",
            categoryId: firstCategoryId,
            moneyAmount: 400,
        })
        await expensesService.addExpense({
            userId: secondUserId,
            expenseName: "REstaurant",
            categoryId: secondCategoryId,
            moneyAmount: 600,
        })

        const expenses = await expensesService.getExpenses(firstUserId)

        expect(expenses.length).toEqual(1)
        expect(expenses[0].expenseName).toEqual("My Groceries")
    })

    test ('user should receive edited expenses after edditing', async () => {
        const userData = new SignUpUserInput("Pablo", "fhwerwioehfio", "Spain")
        const userToken = await authorizationService.signUp(userData)

        const userId = await authorizationService.verifyToken(userToken)

        const categoryData = new AddCategoryInput("Food", userId)

        await categoriesService.addCategory(categoryData)

        const category = await categoriesService.getUserCategory(userId)
        const categoryId = category[0].id

        const addInput: AddExpenseInput = {
            userId: userId,
            expenseName: "Buy food",
            categoryId: categoryId,
            moneyAmount: 100,
        }

        const expenseId = await expensesService.addExpense(addInput)

        const editInput: EditExpenseInput = {
            expenseId: expenseId,
            userId: userId,
            expenseName: "Buy groseries",
            moneyAmount: 120
        }

        const editedExpense = await expensesService.editExpense(editInput)

        expect(editedExpense.length).toEqual(1)
        expect(editedExpense[0].expenseName).toEqual("Buy groseries")
        expect(editedExpense[0].moneyAmount).toEqual(120)
    })

    test("user shouldn't receive deleted expense after deleting", async () => {
        const userData = new SignUpUserInput("UserName", "pfkwkdmke", "India")
        const userToken = await authorizationService.signUp(userData)

        const userId = await authorizationService.verifyToken(userToken)

        const categoryData = new AddCategoryInput("Clothes", userId)

        await categoriesService.addCategory(categoryData)

        const category = await categoriesService.getUserCategory(userId)
        const categoryId = category[0].id

       const input: AddExpenseInput = {
        userId: userId,
        expenseName: "Shopping in Zara",
        categoryId: categoryId,
        moneyAmount: 230,
       }

       const expenseId = await expensesService.addExpense(input)
       const deletedExpense = await expensesService.deleteExpense(expenseId, userId)

       const expenses = await expensesService.getExpenses(userId)
       
       expect(deletedExpense).toEqual(true)
       expect(expenses.length).toEqual(0)
    })

    test('user should receive his expenses in special category', async () => {
        const userData = new SignUpUserInput("UserName", "jclsjdkljd", "China")
        const userToken = await authorizationService.signUp(userData)

        const userId = await authorizationService.verifyToken(userToken)
        
        const firstCategoryData = new AddCategoryInput("Clothes", userId)
        const secondCategoryData = new AddCategoryInput("Food", userId)

        await categoriesService.addCategory(firstCategoryData)
        await categoriesService.addCategory(secondCategoryData)

        const firstCategory = await categoriesService.getUserCategory(userId)
        const secondCategory = await categoriesService.getUserCategory(userId)

        const firstCategoryId = firstCategory[0].id
        const secondCategoryId = secondCategory[1].id

        const firstInput: AddExpenseInput = {
            userId: userId,
            expenseName: "Buy clothes",
            categoryId: firstCategoryId,
            moneyAmount: 150,
        }

        const secondInput: AddExpenseInput = {
            userId: userId,
            expenseName: "Buy food",
            categoryId: secondCategoryId,
            moneyAmount: 100,
        }

        await expensesService.addExpense(firstInput)
        await expensesService.addExpense(secondInput)

        const expenses = await expensesService.getCategoryExpenses(firstCategoryId, userId)

        expect(expenses.length).toEqual(1)
        expect(expenses[0].categoryId).toEqual(firstCategoryId)
    })

    test("user should receive all expenses, which they added", async () => {
        const userData = new SignUpUserInput("UserName", "fhfkshfks", "Georgia")
        const userToken = await authorizationService.signUp(userData)

        const userId = await authorizationService.verifyToken(userToken)

        const categoryData = new AddCategoryInput("Clothes", userId)

        await categoriesService.addCategory(categoryData)
        
        const category = await categoriesService.getUserCategory(userId)
        const categoryId = category[0].id
        
        const firstInput: AddExpenseInput = {
            userId: userId,
            expenseName: "Buy T-shirt",
            categoryId: categoryId,
            moneyAmount: 100,
        }

        const secondInput: AddExpenseInput = {
            userId: userId,
            expenseName: "Buy skirt",
            categoryId: categoryId,
            moneyAmount: 200,
        }

        const thirdInput: AddExpenseInput = {
            userId: userId,
            expenseName: "Buy dress",
            categoryId: categoryId,
            moneyAmount: 300,
        }

        await expensesService.addExpense(firstInput)
        await expensesService.addExpense(secondInput)
        await expensesService.addExpense(thirdInput)

        const expenses = await expensesService.getExpenses(userId)

        expect(expenses.length).toEqual(3)
    })
})