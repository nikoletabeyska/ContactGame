class SessionStorage {
    constructor(key) {
        this.key = key;
    }

    get() {
        return sessionStorage.getItem(this.key);
    }

    set(value) {
        sessionStorage.setItem(this.key, value);
    }

    clear() {
        sessionStorage.removeItem(this.key);
    }
}

class UserInfoStorage {
    handler = undefined
    tokenStorage = new SessionStorage("token")
    nameStorage = new SessionStorage("name")
    gameStorage = new SessionStorage("game")
    idStorage = new SessionStorage("id")

    setHandler(handler) {
        this.handler = handler
    }

    get token() {
        return this.tokenStorage.get()
    }

    get name() {
        return this.nameStorage.get()
    }

    get game() {
        return this.gameStorage.get()   
    }
    get id() {
        return this.idStorage.get()   
    }

    save(token, name, id) {
        this.tokenStorage.set(token)
        this.nameStorage.set(name)
        this.idStorage.set(id)
        this.handler?.(this.userInfo)
    }

    saveGame(gameInfo) {
        this.gameStorage.set(gameInfo)
    }

    clear() {
        this.tokenStorage.clear()
        this.nameStorage.clear()
        this.handler?.(undefined)
    }

    clearGame() {
        this.gameStorage.clear()
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

export const sessionUserStorage = new UserInfoStorage()