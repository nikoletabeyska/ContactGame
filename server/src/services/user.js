import { UserModel } from "../models/user.js"
import bcrypt from "bcrypt"
import { z } from "zod"
import { UniqueViolationError } from "objection"
import { NotFoundError } from "../errors.js"
import { EmailAlreadyExistsError } from "../errors.js"

export const RegistrationInputSchema = z.object({
    name: z
        .string()
        .min(2, "Name should have at least 2 alphabets")
        .refine(
            value => /^[a-zA-Z]+[-'s]?[a-zA-Z ]+$/.test(value),
            "Name should contain only alphabets"
        )
        .refine(
            value => /^[a-zA-Z]+\s+[a-zA-Z]+$/.test(value),
            "Please enter both first name and last name"
        ),
    email: z
        .string()
        .min(5)
        .email("Email must be valid!"),
    password: z.string().min(8)
})

export const ModifyUserInputSchema = z.object({
    name: z
        .string()
        .min(2, "Name should have atleast 2 alphabets")
        .refine(
            value => /^[a-zA-Z]+[-'s]?[a-zA-Z ]+$/.test(value),
            "Name should contain only alphabets"
        )
        .refine(
            value => /^[a-zA-Z]+\s+[a-zA-Z]+$/.test(value),
            "Please enter both firstname and lastname"
        )
        .optional(),
    password: z
        .string()
        .min(8)
        .optional()
})

const SALT_ROUNDS = 10

export class UserService {
    async register(data) {
        const hashPassword = await bcrypt.hash(data.password, SALT_ROUNDS)
        try {
            return await UserModel.query().insertAndFetch({
                name: data.name,
                email: data.email,
                password: hashPassword
            })
        } catch (err) {
            if (
                err instanceof UniqueViolationError &&
                err.constraint === "users_email_unique"
            ) {
                throw new EmailAlreadyExistsError("This email is already used!")
            }
            throw err
        }
    }

    async login(email, password) {
        const user = await UserModel.query().findOne({ email })

        if (!user) {
            throw new NotFoundError("There is no user with this email!")
        }

        const correctPassword = await bcrypt.compare(password, user.password)

        if (!correctPassword) {
            throw new NotFoundError("There is no user with this email and password combination!")
        }

        return user
    }

    async getUserById(id) {
        return await UserModel.query().findById(id)
    }

    async update(id, data) {
        let hashPassword = data?.password
        if (data.password !== undefined) {
            hashPassword = await bcrypt.hash(data.password, SALT_ROUNDS)
        }
        const user = await UserModel.query().findById(id)
        return await user
            ?.$query()
            .patchAndFetch({ name: data?.name, password: hashPassword })
    }

    async deleteById(id) {
        return await UserModel.query().deleteById(id)
    }
}
