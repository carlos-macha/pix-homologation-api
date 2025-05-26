import { NextFunction } from "express";
import AuthService from "../services/authService";
import { UserRequestLogin, UserRequestRegister, UserRequestValidateToken, UserResponseLogin, UserResponseRegister, UserResponseValidateToken } from "../types/userType";

class AuthController {
    constructor(private authService: AuthService = new AuthService()) { }

    public login = async (req: UserRequestLogin, res: UserResponseLogin, next: NextFunction) => {
        try {
            const { email, password } = req.body;

            const response = await this.authService.loginUser(email, password);

            res.status(response.status).json({ message: response.message, token: response.token! });
        } catch (error) {
            next(error);
        }
    };

    public register = async (req: UserRequestRegister, res: UserResponseRegister, next: NextFunction) => {
        try {
            const { email, password, name } = req.body;

            const response = await this.authService.registerUser(email, password, name);

            res.status(response.status).json({ message: response.message });
        } catch (error) {
            next(error);
        }
    };

    public validate = async (req: UserRequestValidateToken, res: UserResponseValidateToken, next: NextFunction) => {
        const token = req.headers.authorization?.split(" ")[1];

        try {
            const result = await this.authService.validateToken(token!);

            res.status(result.status).json({ message: result.message });
        } catch (error) {
            next(error);
        }
    }
}

export default AuthController;