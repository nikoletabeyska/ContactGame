import { Router } from "express"
import { GameService } from "../services/game.js"
import {
    requestHandler,
    ResponseWithCode
} from "../middlewares/request-handler.js"
import { JwtService } from "../services/jwt.js"

const gameRouter = Router()
const jwtService = new JwtService()
const gameService = new GameService()

gameRouter.post(
    "/create",
    requestHandler(async req => {
        const game = await gameService.create(input)
        //return new ResponseWithCode(201, { token: token, name: user.name })
    })
)


export { gameRouter }
