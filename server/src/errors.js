import { ZodError } from "zod"

class ErrorBase extends Error {
    constructor(message) {
        super(message)

        Error.captureStackTrace(this, this.constructor)

        this.name = this.constructor.name
        this.status = 400
    }
}

export class BadRequestError extends ErrorBase {
    constructor(message) {
        super(message)

        ErrorBase.captureStackTrace(this, this.constructor)

        this.name = this.constructor.name
        this.status = 400
    }
}

export class NotFoundError extends ErrorBase {
    constructor(message) {
        super(message)

        ErrorBase.captureStackTrace(this, this.constructor)

        this.name = this.constructor.name
        this.status = 404
    }
}

export class UnauthorizedError extends ErrorBase {
    constructor(message) {
        super(message)

        ErrorBase.captureStackTrace(this, this.constructor)

        this.name = this.constructor.name
        this.status = 401
    }
}

export class EmailAlreadyExistsError extends ErrorBase {
    constructor(message) {
        super(message)

        ErrorBase.captureStackTrace(this, this.constructor)

        this.name = this.constructor.name
        this.status = 400
    }
}

export function errorHandler(error, res) {
    if (error instanceof ErrorBase) {
        res.status(error.status).send({ message: error.message })
        return
    }
    if (error instanceof ZodError) {
        res.status(400).send(error.flatten())
        return
    }
    res.status(500).send({ message: "Internal Server Error" })
}
