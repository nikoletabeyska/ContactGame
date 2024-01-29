import jwtDecode from "jwt-decode"
import { LocalStorage } from "../lib/LocalStorage"

class UserInfoStorage {
    handler = undefined
    tokenStorage = new LocalStorage("token")
    nameStorage = new LocalStorage("name")

    setHandler(handler) {
        this.handler = handler
    }

    get token() {
        return this.tokenStorage.get()
    }

    get name() {
        return this.nameStorage.get()
    }

    save(token, name) {
        this.tokenStorage.set(token)
        this.nameStorage.set(name)
        this.handler?.(this.userInfo)
    }

    clear() {
        this.tokenStorage.clear()
        this.nameStorage.clear()
        this.handler?.(undefined)
    }

    get userInfo() {
        const token = this.token
        const name = this.name
        return token
            ? name
                ? { tokenInfo: this.userInfoFromToken(token), name: name }
                : undefined
            : undefined
    }

    userInfoFromToken(token) {
        return jwtDecode(token)
    }
}

export const userInfoStorage = new UserInfoStorage()
