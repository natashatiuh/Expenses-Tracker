import express from "express";
import { categoriesService } from "./categoriesServices";
import { auth } from "../common/middlewares/auth";
import { validation } from "../common/middlewares/validation";
import { addCategorySchema } from "./schemas/addCategorySchema";
import { MyRequest } from "../auth/requestDefinition";
import { editCategorySchema } from "./schemas/editCategorySchema";
import { deleteCategorySchema } from "./schemas/deleteCategorySchema";
import { makeCategoryFavoriteSchema } from "./schemas/makeCategoryFavoriteSchema";
import { makeCategoryNotFavoriteSchema } from "./schemas/makeCategoryNotFavoriteSchema";
import { AddCategoryInput } from "./inputs/addCategoryInput";
import { EditCategoryInput } from "./inputs/editCategoryInput";

export const router = express.Router()

router.post('/', auth(), validation(addCategorySchema), async (req, res) => {
    try {
        let { name, monthBudget } = req.body as any
        if (monthBudget === undefined) monthBudget = null
        const categoryData = new AddCategoryInput(name, (req as MyRequest).userId, monthBudget)
        const category = await categoriesService.addCategory(categoryData)
        if (!category) {
            res.json({success: false})
        } else {
            res.json({success: true})
        }
    } catch (error) {
        console.log(error)
        res.json({success: false})
    }
})

router.patch('/name', auth(), validation(editCategorySchema), async (req, res) => {
    try {
        const { newName, categoryId } = req.body as any
        const editedcategoryData = new EditCategoryInput(newName, categoryId, (req as MyRequest).userId)
        const editedCategory = await categoriesService.editCategory(editedcategoryData)
        if(!editedCategory) {
            res.json({success: false})
        } else {
            res.json({editedCategory})
        }
    } catch (error) {
        console.log(error)
        res.json({success: false})
    }
})

router.delete('/', auth(), validation(deleteCategorySchema), async (req, res) => {
    try {
        const { categoryId } = req.body as any
        const isDeletedCategory = await categoriesService.deleteCategory(categoryId, (req as MyRequest).userId)
        if(!isDeletedCategory) {
            res.json({success: false})
        } else {
            res.json({success: true})
        }
    } catch (error) {
        console.log(error)
        res.json({success: false})
    }
})

router.patch('/favorite', auth(), validation(makeCategoryFavoriteSchema), async (req, res) => {
    try {
        const { categoryId } = req.body as any
        const isFavorite = await categoriesService.makeCategoryFavorite(categoryId, (req as MyRequest).userId)
        if (!isFavorite) {
            res.send('Something goes wrong!') 
        } else {
            res.send('The category was added to your favorites!')
        }
    } catch (error) {
        console.log(error)
        res.send(error)
    }
})

router.patch('/not-favorite', auth(), validation(makeCategoryNotFavoriteSchema), async (req, res) => {
    try {
        const { categoryId } = req.body as any
        const isNotFavorite = await categoriesService.makeCategoryNotFavorite(categoryId, (req as MyRequest).userId)
        if (!isNotFavorite) {
            res.send('Something goes wrong!')
        } else {
            res.send('The category was deleted from favorites!')
        }
    } catch (error) {
        console.log(error)
        res.send(error)
    }
})

router.get('/', auth(), async (req, res) => {
    try {
        const userCategories = await categoriesService.getUserCategory((req as MyRequest).userId)
        if(userCategories === false) {
            res.json({success: false})
        } else {
            res.json({userCategories})
        }
    } catch (error) {
        console.log(error) 
        res.json({success: false})
    }
})