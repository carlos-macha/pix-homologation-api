import { Request, Response } from "express";

export interface UserErrorResponse {
  error: string;
}

export interface PaymentRegisterRequestBody {
    userId: number,
    method: string,
    amount: number
}

export interface PaymentRegisterSuccessResponse {
    message: string
}

export type PaymentStatus = "REJECTED" | "COMPLETED" | "PENDING";

export type PaymentRequestRegister = Request<{}, {}, PaymentRegisterRequestBody>;
export type PaymentResponseRegister = Response<PaymentRegisterSuccessResponse | UserErrorResponse>;