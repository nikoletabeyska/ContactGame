import { errorHandler } from "../errors.js"

export class ResponseWithCode {
    constructor(statusCode, body) {
        this.statusCode = statusCode
        this.body = body
    }
}

export function requestHandler(handler) {
    return async (req, res) => {
        try {
            const result = await handler(req, res)
            if (result instanceof ResponseWithCode) {
                res.status(result.statusCode).send(result.body)
                return
            }
            res.send(result)
        } catch (err) {
            errorHandler(err, res)
        }
    }
}
