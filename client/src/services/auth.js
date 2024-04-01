import { HttpError, HttpService } from "./http"
import { sessionUserStorage } from "./session";

export class InvalidCredentialsError extends Error { }

class AuthService {
    http = new HttpService()

    async login(email, password) {
        try {
            const body = await this.http.post("/auth/login", {
                body: { email, password }
            })
            sessionUserStorage.save(body.token, body.name);
        } catch (error) {
            console.log(error);
            if (error instanceof HttpError && error.status === 404) {
                console.log(error.message)
                throw new InvalidCredentialsError(error.message)
            }
            throw error
        }
    }

    logout() {
        sessionStorage.clear()
    }

    async register(input) {
        try {
            const body = await this.http.post("/auth/registration", {
                body: input
            })
            sessionUserStorage.save(body.token, body.name);
            return body;
        } catch (error) {
            throw error
        }
    }
}

export const authService = new AuthService()
