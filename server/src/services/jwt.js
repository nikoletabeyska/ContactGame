import jwt from "jsonwebtoken"
import { config } from "../config.js"

export class JwtService {
    create(user) {
        const { expiryTime, privateKey } = config.get("jwt")

        return jwt.sign({ id: user.id, email: user.email }, privateKey, {
            expiresIn: expiryTime
        })
    }

    parse(token) {
        return jwt.verify(token, config.get("jwt.privateKey"))
    }
}
