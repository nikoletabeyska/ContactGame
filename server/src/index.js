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
        console.log(err.req);
        console.log(err.code);
        console.log(err.message);
        console.log(err.context);
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
        console.log('gameId:', gameId);
        console.log('word:', word);
        if (gameRooms[gameId]) {
            gameRooms[gameId].gameWord = word;
            gameRooms[gameId].letterIndex += 1;
            io.to(gameId).emit('firstLetterReveal', word[0]);
        } else {
            console.log('Error: Game does not exist:', gameId);
        }
    })

    socket.on('revealLetter', (gameId) => {
        if (gameRooms[gameId]) {
            const index = gameRooms[gameId].letterIndex;
            console.log('index:', index, 'word:', gameRooms[gameId].gameWord[index]);
            io.to(gameId).emit('letterReveal', gameRooms[gameId].gameWord[index]);
            if (index === gameRooms[gameId].gameWord.length - 1) {
                io.to(gameId).emit('gameOver');
            } else {
                gameRooms[gameId].letterIndex += 1;
            }  
        } else {
            console.log('Error: Game does not exist:', gameId);
        }
    })

    socket.on('askQuestion', (question, answer, gameId, socketId, playerName) => {
        if (gameRooms[gameId]) {
            const game = gameRooms[gameId];
            //should we store socket id here?
            const currentQuestion = {question, answer, socketId, playerName};
            gameRooms[gameId].questions.push(currentQuestion);
            if (gameRooms[gameId].players.length - 1 === game.questions.length) {
                //not sending question answer 
                const questions = game.questions;
                //console.log(questions);
                //onsole.log(currentQuestion);
                io.to(gameId).emit('question', {question: questions[0].question, playerName: questions[0].playerName});
                     
            }

        } else {
            console.log('Error: Game does not exist:', gameId);
        }
    })



    socket.on('leadAnswerToQuestion', (answer, gameId) => {
        if(gameRooms[gameId]) {
            const currentQuestion = gameRooms[gameId].questions[0];
            console.log(3,currentQuestion.answer.toUpperCase(), answer.toUpperCase());
            if (currentQuestion.answer.toUpperCase() === answer.toUpperCase()) {
                gameRooms[gameId].questions.shift();
                if (gameRooms[gameId].questions.length === 0) {
                    io.to(gameId).emit('gameOver');
                } else {
                    io.to(gameId).emit('correctAnswer', {answer, correct: true}, {question: gameRooms[gameId].questions[0].question, playerName:  gameRooms[gameId].questions[0].playerName});
                }
            } else {
                console.log('incorrect answer');
               socket.to(gameId).emit('incorrectAnswer', {answer, correct: false}, currentQuestion.answer);
               //io.to(socket.id).emit('leaderOnlyAnswer');
               socket.emit('leaderOnlyAnswer', {answer, correct: false}, currentQuestion.answer);
            }
        } else {
            console.log('Error: Game does not exist:', gameId);
        }
        
    })


    socket.on('contact', (contactAnswer, gameId, playerName, question) => {
        console.log(4,contactAnswer, gameId, playerName, question);
        if(gameRooms[gameId]) {
            console.log(1, contactAnswer.toUpperCase());
            console.log(2, gameRooms[gameId].questions[0].answer.toUpperCase());
            if (contactAnswer.toUpperCase() === gameRooms[gameId].questions[0].answer.toUpperCase()) {
                const contacts = gameRooms[gameId].contacts;
                contacts.push(playerName);                
            }        
        } else {
            console.log('Error: Game does not exist:', gameId);
        }

    })

    socket.on('getContacts', (gameId) => {
        if(gameRooms[gameId]) {
            if (gameRooms[gameId].contacts.length === 0) {
                if (gameRooms[gameId].questions.length > 0) {
                    const nextQuestion = gameRooms[gameId].questions.shift();
                    io.to(gameId).emit('noContacts', {question: nextQuestion.question, playerName: nextQuestion.playerName});
                } else {
                    // when is the game over?
                    io.to(gameId).emit('noQuestions');
                }
                
                
            } else {
                socket.to(gameId).emit('contacts',  gameRooms[gameId].contacts);
               // io.to(socket.id).emit('leaderOnlyContacts');
               socket.emit('leaderOnlyContacts',  gameRooms[gameId].contacts);

                gameRooms[gameId].contacts = [];
                gameRooms[gameId].questions = [];
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


