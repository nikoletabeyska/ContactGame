import pkg from 'knex';
import knexConfig from "../knexfile.js"
import { Model } from "objection"
import express, { json } from "express"
import { authRouter } from "./routers/auth.js"
import { gameRouter } from "./routers/game.js"
import { config } from "./config.js"
import cors from "cors"
import { Server } from 'socket.io';
import { createServer } from 'http';
import { GameService } from "./services/game.js"

const { knex } = pkg;
const knexClient = knex(knexConfig.development)
Model.knex(knexClient)

const app = express()
const port = config.get("port")
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"],
    },
});

const gameService = new GameService()

app.use(cors())

app.use((req, res, next) => {
    console.log("Request received", {
        path: req.path,
        method: req.method,
        params: req.params,
        body: req.body,
        query: req.query
    })

    next()
})

app.use(json())

app.use("/auth", authRouter)

app.use("/game", gameRouter)

httpServer.listen(port, () => {
    console.log(`Server is listening on :${port}`);
});

let gameRooms = {};

io.on('connection', async (socket) => {
    console.log('A user connected', socket.id);
    io.engine.on("connection_error", (err) => {
        console.log(err);
    });

    socket.on('createGame', (userId, userName) => {
        const gameId = gameService.generateGameId();
        const gameLink = `http://localhost:${port}/join/${gameId}`;
        gameRooms[gameId] = {
            players: [{ id: socket.id, name: userName }],
            owner: userId,
            gameId,
            gameLink,
            maxPlayers: 8,
            gameWord: "",
            letterIndex: 0,
            questions: [],
            contacts: []
        };
        socket.emit('gameCreated', gameRooms[gameId]);
        socket.join(gameId);
        console.log(`New room created with ID: ${gameId} and link ${gameLink} and creator ${userName}`);
    });

    socket.on('joinGame', (gameId, playerName) => {
        if (gameRooms[gameId]) {
            socket.join(gameId);
            gameRooms[gameId].players.push({ playerName, id: socket.id });
            console.log(`Player ${socket.id} joined room ${gameId}`);
            socket.emit('gameInfo', gameRooms[gameId]);
            socket.broadcast.to(gameId).emit('playerJoined', playerName);
        } else {
            socket.emit('roomNotFound');
        }
    });

    socket.on('startGame', (gameId) => {
        io.to(gameId).emit('gameStarted');

        const gameRoom = gameRooms[gameId];
        if (gameRoom) {
            const players = gameRoom.players;
            const randomPlayer = players[Math.floor(Math.random() * players.length)];
            io.to(gameId).emit('gameLead', randomPlayer.id, randomPlayer.playerName, gameId);
        }
    })

    socket.on('gameWord', (word, gameId) => {
        console.log('gameWord start', gameWord);
        if (gameRooms[gameId]) {
            gameRooms[gameId].gameWord = word;
            gameRooms[gameId].letterIndex += 1;
            console.log('gameWord end', gameWord);
            io.to(gameId).emit('letterReveal', word[0]);
        } else {
            console.log('Error: Game does not exist:', gameId);
        }
    })

    socket.on('revealLetter', (gameId) => {
        console.log('revealLetter start', gameWord);
        if (gameRooms[gameId]) {
            const index = gameRooms[gameId].letterIndex;
            io.to(gameId).emit('letterReveal', gameRooms[gameId].gameWord[index]);
            console.log('revealLetter continue', gameWord);
            gameRooms[gameId].questions = [];
            if (index === gameRooms[gameId].gameWord.length - 1) {
                io.to(gameId).emit('gameOver');
            } else {
                gameRooms[gameId].letterIndex += 1;
                console.log('revealLetter end', gameWord);
            }
        } else {
            console.log('Error: Game does not exist:', gameId);
        }
    })

    socket.on('askQuestion', (question, answer, gameId, socketId, playerName) => {
        console.log('askQuestion begin', gameWord);
        if (gameRooms[gameId]) {
            const game = gameRooms[gameId];
            //should we store socket id here?
            const currentQuestion = { question, answer, socketId, playerName };
            gameRooms[gameId].questions.push(currentQuestion);
            if (gameRooms[gameId].players.length - 1 === game.questions.length) {
                //not sending question answer 
                const questions = game.questions;
                console.log('askQuestion end', gameWord);
                io.to(gameId).emit('question', { question: questions[0].question, playerName: questions[0].playerName });
            }
        } else {
            console.log('Error: Game does not exist:', gameId);
        }
    })

    socket.on('leadAnswerToQuestion', (answer, gameId) => {
        console.log('leadAnswerToQuestion begin', gameWord);
        if (gameRooms[gameId]) {
            const currentQuestion = gameRooms[gameId].questions[0];
            if (currentQuestion.answer.toUpperCase() === answer.toUpperCase()) {
                gameRooms[gameId].questions.shift();
                if (gameRooms[gameId].questions.length === 0) {
                    io.to(gameId).emit('askQuestion');
                } else {
                    console.log('leadAnswerToQuestion correct', gameWord);
                    io.to(gameId).emit('correctAnswer', { answer, correct: true }, { question: gameRooms[gameId].questions[0].question, playerName: gameRooms[gameId].questions[0].playerName });
                }
            } else {
                console.log('leadAnswerToQuestion incorrect', gameWord);

                socket.to(gameId).emit('incorrectAnswer', { answer, correct: false }, currentQuestion.answer);
                //io.to(socket.id).emit('leaderOnlyAnswer');
                // socket.emit('leaderOnlyAnswer', { answer, correct: false }, currentQuestion.answer);
            }
        } else {
            console.log('Error: Game does not exist:', gameId);
        }
    })

    socket.on('contact', (contactAnswer, gameId) => {
        console.log('contact begin', gameWord);
        if (gameRooms[gameId]) {
            const contacts = gameRooms[gameId].contacts;
            contacts.push(contactAnswer);
            console.log('contact end', gameWord);

        } else {
            console.log('Error: Game does not exist:', gameId);
        }
    })

    socket.on('getContacts', (gameId) => {
        console.log('getContacts begin', gameWord);
        if (gameRooms[gameId]) {
            if (gameRooms[gameId].contacts.length === 0) {
                if (gameRooms[gameId].questions.length > 0) {
                    const nextQuestion = gameRooms[gameId].questions.shift();
                    io.to(gameId).emit('noContacts', { question: nextQuestion.question, playerName: nextQuestion.playerName });
                } else {
                    // when is the game over?
                    io.to(gameId).emit('askQuestion');
                }
            } else {
                const duplicates = gameRooms[gameId].contacts.filter((item, index) => gameRooms[gameId].contacts.indexOf(item) !== index);
                if (duplicates.length > 0) {
                    console.log('getContacts contacts', gameWord);
                    socket.to(gameId).emit('contacts', duplicates);
                    const index = gameRooms[gameId].letterIndex;
                    socket.to(gameId).emit('letterReveal', gameRooms[gameId].gameWord[index]);
                    gameRooms[gameId].questions = [];
                }
                else {
                    const nextQuestion = gameRooms[gameId].questions.shift();
                    console.log('getContacts no contacts', gameWord);
                    socket.to(gameId).emit('noContacts', { question: nextQuestion.question, playerName: nextQuestion.playerName });
                }
                // io.to(socket.id).emit('leaderOnlyContacts');
                // socket.emit('leaderOnlyContacts', gameRooms[gameId].contacts);
                gameRooms[gameId].contacts = [];
                // gameRooms[gameId].questions = [];
                console.log('getContacts end', gameWord);
            }
        } else {
            console.log('Error: Game does not exist:', gameId);
        }
    })

    socket.on('disconnect', () => {
        console.log(`Client ${socket.id} disconnected`);
        gameRooms = {};
        for (const roomId in gameRooms) {
            for (let i = 0; i < players.length; i++) {
                if (players[i].id === socket.id) {
                    // Remove the player from the game room
                    players.splice(i, 1);
                    // Emit event to inform other players about the player leaving
                    io.to(roomId).emit('playerLeft', socket.id);
                    // If no more players are left in the game room, delete the game room
                    if (players.length === 0) {
                        delete gameRooms[roomId];
                    }
                    break;
                }
            }
        }
    });
});


