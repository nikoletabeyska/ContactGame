import { errorHandler, UnauthorizedError } from "../errors.js"
import { UserService } from "../services/user.js"
import { JwtService } from "../services/jwt.js"

const jwtService = new JwtService()
const userService = new UserService()

export async function authMiddleware(request, response, next) {
    try {
        const authHeader = request.headers.authorization

        if (!authHeader?.startsWith("Bearer ")) {
            throw new UnauthorizedError("Unauthorized!")
        }

        const token = authHeader.replace("Bearer ", "")

        console.log({ token })

        let userInfo

        try {
            userInfo = jwtService.parse(token)
        } catch (err) {
            throw new UnauthorizedError("Unauthorized!")
        }

        const user = await userService.getUserById(userInfo.id)

        if (!user) {
            throw new UnauthorizedError("Unauthorized!")
        }

        response.locals.userId = userInfo.id

        next()
    } catch (err) {
        errorHandler(err, response)
    }
}

export function userIdFromLocals(res) {
    return res.locals.userId
}
