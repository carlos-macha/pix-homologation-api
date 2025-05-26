import { z } from "zod";

export const userSchemaLogin = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export const userSchemaRegister = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string()
});