import express from "express";
import { router as authorizationRouter } from "./auth/authController"
import { router as categoriesRouter } from "./categories/categoriesController"
import { router as expensesRouter } from "./expenses/expensesController"
import { router as subscriptionRouter } from "./subscriptions/subscriptionsController"
import { router as budgetRouter } from "./budget/budgetController"
import cors from 'cors'

async function main() {
    const app = express()

    app.use(express.json())
    app.use(cors())

    app.use('/authorization', authorizationRouter)
    app.use('/categories', categoriesRouter)
    app.use('/expenses', expensesRouter)
    app.use('/subscriptions', subscriptionRouter)
    app.use('/budget', budgetRouter)

    const port = 3001

    app.listen(port, () => console.log(`Server listen on port ${port}`))
}

main()
