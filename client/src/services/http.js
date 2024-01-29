import { config } from "../config"
import { userInfoStorage } from "./userInfoStorage"

export class HttpError extends Error {
    constructor(status, message) {
        super(message)
        this.status = status
    }
}
export class UnauthorizedError extends HttpError { }

export class EmailAlreadyExists extends HttpError { }

export class InputError extends HttpError {
    constructor(status, message, formErrors, fieldErrors) {
        super(status, message)
        this.formErrors = formErrors
        this.fieldErrors = fieldErrors
    }
}

export class HttpService {
    async get(path, options = {}) {
        return this.request("GET", path, options)
    }

    async post(path, options) {
        return this.request("POST", path, options)
    }

    async patch(path, options) {
        return this.request("PATCH", path, options)
    }

    async put(path, options) {
        return this.request("PUT", path, options)
    }

    async delete(path, options) {
        return this.request("DELETE", path, options)
    }

    async request(method, path, { body, query }) {
        const authToken = userInfoStorage.token

        const queryString = new URLSearchParams(query).toString()
        const response = await fetch(
            `${config.serverBaseUrl.replace(/\/$/, "")}/${path.replace(
                /^\//,
                ""
            )}?${queryString}`,
            {
                method,
                headers: {
                    ...(body ? { "Content-Type": "application/json" } : {}),
                    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
                },
                body: JSON.stringify(body)
            }
        )

        if (!response.ok) {
            const statusCode = response.status
            const body = this.tryToParseAsJson(await response.text())
            const message = body?.message ?? "Error: HTTP request failed."

            if (statusCode === 401) {
                userInfoStorage.clear()
                throw new UnauthorizedError(statusCode, message)
            }

            if (statusCode === 400 && body.fieldErrors && body.formErrors) {
                throw new InputError(
                    statusCode,
                    message,
                    body.formErrors,
                    body.fieldErrors
                )
            }

            if (statusCode === 400 && message === "This email is already used!") {
                throw new EmailAlreadyExists(statusCode, message)
            }

            throw new HttpError(statusCode, message)
        }

        return response.json()
    }

    tryToParseAsJson(text) {
        try {
            return JSON.parse(text)
        } catch (error) { }
    }
}
