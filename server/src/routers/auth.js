import { Router } from "express"
import { NotFoundError } from "../errors.js"
import { RegistrationInputSchema, UserService } from "../services/user.js"
import {
    requestHandler,
    ResponseWithCode
} from "../middlewares/request-handler.js"
import { JwtService } from "../services/jwt.js"
import { z } from "zod"

const authRouter = Router()
const jwtService = new JwtService()
const userService = new UserService()

authRouter.post(
    "/registration",
    requestHandler(async req => {
        const input = RegistrationInputSchema.parse(req.body)

        const user = await userService.register(input)
        const token = jwtService.create({ id: user.id, email: user.email })
        return new ResponseWithCode(201, { token: token, name: user.name })
    })
)

const LoginInputSchema = z.object({
    email: z.string(),
    password: z.string()
})

authRouter.post(
    "/login",
    requestHandler(async req => {
        const { email, password } = LoginInputSchema.parse(req.body)
        let user = null;
        try {
            user = await userService.login(email, password)
        } catch (error) {
            throw new NotFoundError(error.message)
        }

        const token = jwtService.create({ id: user.id, email: user.email })
        return { token: token, name: user.name }
    })
)

export { authRouter }
