import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getEnvVar } from "../utils/environmentVariableHandling";
import { HttpError } from "../utils/HttpError";
import { PaymentRequestRegister } from "../types/paymentType";

class AuthMiddleware {
  static verifyToken(req: PaymentRequestRegister, res: Response, next: NextFunction) {
    const authHeader = req.header("Authorization");

    const token = authHeader?.split(" ")[1];


    try {
      if (!token) {
        return next(new HttpError(401, "Token not provided"));
      }

      const decoded = jwt.verify(token, getEnvVar("JWT_SECRET") as string) as jwt.JwtPayload;

      req.body.userId = decoded.userId;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return next(new HttpError(401, "Token expired"));
      }

      if (error instanceof jwt.JsonWebTokenError) {
        return next(new HttpError(401, "Invalid token"));
      }

      return next(new HttpError(500, "Failed to process token"));
    }
  }
}

export default AuthMiddleware;
