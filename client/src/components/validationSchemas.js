import { z } from "zod";
export const LoginInputSchema = z.object({
    email: z.string().email("Email must be valid!"),
    password: z.string().min(8, { message: "Password must be at least 8 symbols!" })
})

export const RegistrationInputSchema = z.object({
    name: z
      .string()
      .min(2, "Name should have at least 2 alphabets")
      .refine(
        value => /^[a-zA-Z]+[-'s]?[a-zA-Z ]+$/.test(value),
        "Name should contain only alphabets!"
      )
      .refine(
        value => /^[a-zA-Z]+\s+[a-zA-Z]+$/.test(value),
        "Please enter both first name and last name!"
      ),
  
    email: z
      .string()
      .min(5)
      .email("Email must be valid!"),
    password: z.string().min(8, { message: "Password must be at least 8 symbols!" })
})