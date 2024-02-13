import { Router } from "express"
import { GameService } from "../services/game.js"
import {
    requestHandler,
    ResponseWithCode
} from "../middlewares/request-handler.js"

const gameRouter = Router()
const gameService = new GameService()

gameRouter.post(
    "/create",
    requestHandler(async req => {
        const game = await gameService.create(input)
        // return new ResponseWithCode(201, { name: user.name })
    })
)


export { gameRouter }
