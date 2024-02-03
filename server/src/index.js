import pkg from 'knex';
import knexConfig from "../knexfile.js"
import { Model } from "objection"
import express, { json } from "express"
import { authRouter } from "./routers/auth.js"
// import { userRouter } from "./routers/users"
import { config } from "./config.js"
import cors from "cors"
console.log(555, process.env)

const { knex } = pkg;
const knexClient = knex(knexConfig.development)
Model.knex(knexClient)

const app = express()
const port = config.get("port")


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

// app.use("/users", userRouter)

app.listen(port)



console.log("Server started on port", port)
