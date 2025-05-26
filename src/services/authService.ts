import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { compare } from "bcrypt";
import prisma from "../prisma/client";
import { getEnvVar } from "../utils/environmentVariableHandling";
import { HttpError } from "../utils/HttpError";
import { ServiceUserResponse } from "../types/userType";
import { userSchemaLogin, userSchemaRegister } from "../schemas/userSchema";

class AuthService {
    async registerUser(email: string, password: string, name: string): Promise<{ status: number, message: string }> {
        try {
            const parsedData = userSchemaRegister.parse({ email, password, name });

            const userExists = await prisma.user.findUnique({ where: { email: parsedData.email } });

            if (userExists) {
                throw new HttpError(409, "Email already registered");
            }

            const hashedPassword = await bcrypt.hash(parsedData.password, 10);

            await prisma.user.create({
                data: { email: parsedData.email, password: hashedPassword, name: name },
            });

            return { status: 201, message: "User created successfully" };
        } catch (error) {
            if (error instanceof HttpError) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
            throw new HttpError(500, errorMessage);
        }
    }

    async loginUser(email: string, password: string): Promise<ServiceUserResponse> {
        try {
            const parsedData = userSchemaLogin.parse({ email, password });
            const user = await prisma.user.findUnique({ where: { email: email } });

            if (!user) {
                throw new HttpError(404, "user does not exist");
            }

            const isValidPassword = await compare(parsedData.password, user!.password);

            if (!isValidPassword) {
                throw new HttpError(401, "Invalid password");
            }

            const token = jwt.sign({ userId: user!.id }, getEnvVar("JWT_SECRET") as string, {
                expiresIn: "7d",
            });

            return { status: 200, message: "Login successfully", token: token }
        } catch (error) {
            if (error instanceof HttpError) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
            throw new HttpError(500, errorMessage);
        }
    }

    async validateToken(token: string): Promise<{ status: number; message: string }>  {
        if (!token) {
            throw new HttpError(401, "Token not provided");
        }

        try {
            jwt.verify(token!, getEnvVar("JWT_SECRET") as string) as jwt.JwtPayload;

            return { status: 200, message: "Valid token" };
        } catch (error) {
            throw new HttpError(401, "Invalid or expired token");
        }
    }
}

export default AuthService;