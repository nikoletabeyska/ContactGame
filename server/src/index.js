import pkg from 'knex';
import knexConfig from "../knexfile.js"
import { Model } from "objection"
import express, { json } from "express"
import { authRouter } from "./routers/auth.js"
import { gameRouter } from "./routers/game.js"
// import { userRouter } from "./routers/users"
import { config } from "./config.js"
import cors from "cors"
import { Server } from 'socket.io';
import { createServer } from 'http'; 
console.log(555, process.env)

const { knex } = pkg;
const knexClient = knex(knexConfig.development)
Model.knex(knexClient)

const app = express()
const port = config.get("port")
//const host = '0.0.0.0';
const hostname = 'localhost';
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"],
      },
});



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

//for public game
app.use("/game", gameRouter)

// app.use("/users", userRouter)

httpServer.listen(port, () => {
    console.log(`Server is listening on :${port}`);
});

let gameRooms = {};

function generateGameId() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

io.on('connection', async (socket) => {
    console.log('A user connected', socket.id);
    io.engine.on("connection_error", (err) => {
        console.log(err.req);      
        console.log(err.code);     
        console.log(err.message);  
        console.log(err.context);  
    });

    socket.on('createGame', (userId, userName) => {
        const gameId = generateGameId();
        const gameLink = `http://localhost:3000/join/${gameId}`;
        gameRooms[gameId] = {
            players: [{ id: socket.id, name: userName }],
            owner: userId,
            gameId,
            gameLink,
            maxPlayers: 8,
            gameWord: "",
            letterIndex: 0,
            questions: [] 
        };
        socket.emit('gameCreated', gameRooms[gameId]);
        socket.join(gameId);
        console.log(`New room created with ID: ${gameId} and link ${gameLink} and creator ${userName}`);
    });

    socket.on('joinGame', (gameId, playerName) => {
        console.log(1);
        if (gameRooms[gameId]) {
            socket.join(gameId);
            console.log(1);
            gameRooms[gameId].players.push({playerName, id: socket.id});
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
        if(gameRoom) {
            const players = gameRoom.players;
            const randomPlayer = players[Math.floor(Math.random() * players.length)];
            io.to(gameId).emit('gameLead', randomPlayer.id, gameId);
        }
        
        
    })

    socket.on('gameWord', (word, gameId) => {
        console.log('gameId:', gameId);
        console.log('word:', word);
        if (gameRooms[gameId]) {
            gameRooms[gameId].gameWord = word;
            gameRooms[gameId].letterIndex += 1;
            io.to(gameId).emit('letterReveal', word[0]);
        } else {
            console.log('Error: Game does not exist:', gameId);
        }
    })

    socket.on('revealLetter', (gameId) => {
        const index = gameRooms[gameId].letterIndex;
        io.to(gameId).emit('letterReveal', gameRooms[gameId].gameWord[index]);
        if (index === gameRooms[gameId].gameWord.length - 1) {
            io.to(gameId).emit('gameOver');
        } else {
            gameRooms[gameId].letterIndex += 1;

        }
    })

    socket.on('askQuestion', (question, gameId, socketId) => {
        if (gameRooms[gameId]) {
            const game = gameRooms[gameId];
            //should we store socket id here?
            gameRooms[gameId].questions.push({question, socketId});
            if (game.players.length === game.questions.length - 1) {
                const currentQuestion = game.questions.shift();
                io.to(gameId).emit('question', currentQuestion.question);
                     
            }

        }
    })
   
    socket.on('disconnect', () => {
        console.log(`Client ${socket.id} disconnected`);
        gameRooms = {};
    
        for (const roomId in gameRooms) {
            const index = gameRooms[roomId].players.indexOf(socket.id);
            if (index !== -1) {
                gameRooms[roomId].players.splice(index, 1);
                io.to(roomId).emit('playerLeft', socket.id);
                break;
            }
        }
    });
});


