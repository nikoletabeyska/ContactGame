import io from 'socket.io-client';
const socket = io("http://127.0.0.1:3000", { transports: ['websocket'], upgrade: false }, { multiplex: false });
export class GameService {
    connect() {
        socket.on("connect", () => {
            socket.connect;
            console.log('connected be',);
            socket.emit("join", "Hello World from client");
        });
    }

    createGame(userName, callback) {
        socket.emit('createGame', userName);
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
}

export { socket };