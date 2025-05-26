import { HttpError } from "../utils/HttpError";
import prisma from "../prisma/client";
import { Payment } from "../models/paymentModel";
import { PaymentStatus } from "../types/paymentType";
import { paymentSchema, simulateHomologationSchema } from "../schemas/paymentSchema";

class PaymentService {
    async simulateHomologation(PaymentId: string, method: string, amount: number, userId: number): Promise<{ message: string }> {
        try {
            const parsedData = simulateHomologationSchema.parse({ PaymentId, method, amount, userId });

            if (parsedData.method !== 'PIX') {
                return this.rejectPayment(
                    parsedData.PaymentId,
                    "Invalid payment method for approval.",
                    400
                );
            }

            if (parsedData.amount <= 0) {
                return this.rejectPayment(
                    parsedData.PaymentId,
                    "Payment amount must be greater than zero.",
                    400
                );
            }

            const user = await prisma.user.findUnique({
                where: { id: parsedData.userId },
            });

            if (!user) {
                return this.rejectPayment(
                    parsedData.PaymentId,
                    "User not found.",
                    404
                );
            }

            await Payment.findByIdAndUpdate(
                parsedData.PaymentId, { status: "COMPLETED" as PaymentStatus }
            );

            return { message: "Payment approved successfully." };
        } catch (error) {
            if (error instanceof HttpError) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
            throw new HttpError(500, errorMessage);
        }
    }

    async registerPaymentService(userId: number, method: string, amount: number): Promise<{ message: string, paymentId: string }> {
        const parsedData = paymentSchema.parse({ userId, method, amount });

        const user = await prisma.user.findUnique({
            where: { id: parsedData.userId },
        });

        if (!user) {
            throw new HttpError(404, "User not found.");
        }

        const payment = await Payment.create({
            amount: parsedData.amount,
            method: parsedData.method,
            userId: parsedData.userId,
            status: "PENDING" as PaymentStatus
        });

        return { message: "registered payment.", paymentId: payment._id.toString() };
    }

    private async rejectPayment(paymentId: string, reason: string, status: number): Promise<never> {
        await Payment.findByIdAndUpdate(paymentId, { status: "REJECTED" });
        throw new HttpError(status, reason);
    }
}

export default PaymentService;