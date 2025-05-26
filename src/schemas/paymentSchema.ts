import { z } from "zod";

export const paymentSchema = z.object({
    userId: z.number(),
    method: z.string(),
    amount: z.number()
});

export const simulateHomologationSchema = z.object({
    userId: z.number(),
    PaymentId: z.string(),
    method: z.string(),
    amount: z.number()
});