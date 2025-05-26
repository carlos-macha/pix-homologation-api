import { Router } from "express";
import PaymentController from "../controllers/paymentController";
import AuthMiddleware from "../middlewares/authMiddleware";

const paymentController = new PaymentController();
const paymentRouter = Router();

paymentRouter.post("/register_payment", AuthMiddleware.verifyToken, paymentController.registerPayment);

export default paymentRouter;