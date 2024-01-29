import { HttpError, HttpService } from "./http"
import { userInfoStorage } from "./userInfoStorage"

export class InvalidCredentialsError extends Error { }

class AuthService {
    http = new HttpService()

    async login(email, password) {
        try {
            const body = await this.http.post("/auth/login", {
                body: { email, password }
            })
            userInfoStorage.save(body.token, body.name)
        } catch (error) {
            if (error instanceof HttpError && error.status === 404) {
                throw new InvalidCredentialsError()
            }

            throw error
        }
    }

    logout() {
        userInfoStorage.clear()
    }

    async register(input) {
        const body = await this.http.post("/auth/registration", {
            body: input
        })

        userInfoStorage.save(body.token, body.name)
        return body
    }
}

export const authService = new AuthService()
