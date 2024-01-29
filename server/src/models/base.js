import { Model } from "objection"

class BaseModel extends Model {
    async $beforeUpdate(opt, queryContext) {
        await super.$beforeUpdate(opt, queryContext)
        this.updatedAt = new Date()
    }
}

export { BaseModel }
