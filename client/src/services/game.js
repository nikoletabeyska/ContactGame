import io from 'socket.io-client';
const socket = io("http://127.0.0.1:3000", { transports: ['websocket'], upgrade: false }, {multiplex: false});
export class GameService {
    /*
    async createGame() {
        try {
            const body = await this.http.post("/auth/login", {
                body: { email, password }
            })
            userInfoStorage.save(body.token, body.name)
        } catch (error) {
            console.log(error);
            if (error instanceof HttpError && error.status === 404) {
                console.log(error.message)
                throw new InvalidCredentialsError(error.message)
            }

            throw error
        }
    }
    */
    connect() {
        socket.on("connect", () => {
        socket.connect;
        console.log('connected be',);
        socket.emit("join", "Hello World from client");
        });
    }

    createGame(userId, userName, callback) {
        socket.emit('createGame', userId, userName);
        socket.on('gameCreated', (gameInfo) => {
             callback(gameInfo);
        })
    }

    joinGame(link, playerName, callback) {
        const path = link;
        const parts = path.split('/');
        const gameId = parts[parts.length - 1];
        console.log('Joining gameID', gameId);
        socket.emit('joinGame', gameId, playerName);
        socket.on('gameInfo', (gameInfo) => {
            callback(gameInfo);
        });
        socket.on('roomNotFound', () => {
            console.log('Room not found');
        });
    }

    displayLeaveEvent() {
        socket.on('playerLeft', (playerId) => {
            console.log(`Player ${playerId} left the game room`);
        });
    }

    static getQuestion(callback) {
        socket.on('question', (question) => {
            callback(question);
        });
    }

}

export {socket};