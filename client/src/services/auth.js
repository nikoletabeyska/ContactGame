import { HttpError, HttpService } from "./http"
import { userInfoStorage } from "./userInfoStorage"
import { sessionUserStorage } from "./session";

export class InvalidCredentialsError extends Error { }

class AuthService {
    http = new HttpService()

    async login(email, password) {
        try {
            const body = await this.http.post("/auth/login", {
                body: { email, password }
            })
            //userInfoStorage.save(body.token, body.name)
            sessionUserStorage.save(body.token, body.name, body.id);
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
       // userInfoStorage.clear()
    }

    async register(input) {
        
        try {
            const body = await this.http.post("/auth/registration", {
                body: input
            })
            //userInfoStorage.save(body.token, body.name)
            sessionUserStorage.save(body.token, body.name);
            console.log(body)
        } catch (error) {
            console.log("oh no", err)
            throw error
        }
       
        //return body
    }
}

export const authService = new AuthService()
