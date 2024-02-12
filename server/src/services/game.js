import { GameModel } from "../models/game.js"

export class GameService {

    async createGame() {
        try {
            return await GameModel.query().insertAndFetch({

            })
        } catch (error) {
            console.error("Error creating game:", error.message);
            throw error;
        }
    }

    generateGameId() {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }
}