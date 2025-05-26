import { NextFunction } from "express";
import PaymentService from "../services/paymentService";
import { PaymentRequestRegister, PaymentResponseRegister } from "../types/paymentType";

class PaymentController {
    constructor(private paymentService: PaymentService = new PaymentService()) { }

    public registerPayment = async (req: PaymentRequestRegister, res: PaymentResponseRegister, next: NextFunction) => {
        try {
            const { amount, method, userId } = req.body;

            const payment = await this.paymentService.registerPaymentService(userId, method, amount);

            await this.paymentService.simulateHomologation(
                payment.paymentId,
                method,
                amount,
                userId
            );

            res.status(201).json({
                message: "Payment registered and approved successfully.",
            });
        } catch (error) {
            next(error);
        }
    };
}

export default PaymentController;