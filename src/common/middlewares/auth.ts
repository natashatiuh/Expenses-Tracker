import jwt from "jsonwebtoken"
import { authorizationService } from "../../auth/authServices"

export const auth = () => {
    return async (req: any, res: any, next: any) => {
        try {
            const token = req.headers.authorization
            console.log(token)
            if(!token) throw new Error('Unauthorized!')

            req.userId = await authorizationService.verifyToken(token)

            next()
        } catch(error) {
            console.log(error)
            res.send("Unauthorized!")
        }
       
    }
}