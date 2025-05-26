import { Router } from "express";
import AuthController from "../controllers/authController";

const authController = new AuthController();
const authRouter = Router();

authRouter.post("/login", authController.login);
authRouter.post("/register", authController.register);
authRouter.get("/validate", authController.validate);

export default authRouter;