import { BaseModel } from "./base.js"

class UserModel extends BaseModel {
    static tableName = "users"

    static modifiers = {
        dontShowPasswordUser(query) {
            query.select("users.id", "users.name", "users.email")
        }
    }
}

export { UserModel }
