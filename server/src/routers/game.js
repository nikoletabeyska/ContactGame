import { Router } from "express"
import { GameService } from "../services/game.js"
import {
    requestHandler,
    ResponseWithCode
} from "../middlewares/request-handler.js"
import { authMiddleware } from '../middlewares/auth.js';

const gameRouter = Router()
const gameService = new GameService()

gameRouter.post(
    "/create",
    authMiddleware,
    requestHandler(async req => {
        const game = await gameService.create(input)
        return new ResponseWithCode(201, { game: game })
    })
)


export { gameRouter }
