import PaymentService from "../../src/services/paymentService";
import prisma from "../../src/prisma/client";
import { Payment } from "../../src/models/paymentModel";

jest.mock("../../src/prisma/client", () => ({
  user: {
    findUnique: jest.fn(),
  },
}));

jest.mock("../../src/models/paymentModel", () => ({
  Payment: {
    findByIdAndUpdate: jest.fn(),
    create: jest.fn(),
  },
}));

describe("PaymentService", () => {
  const service = new PaymentService();

  describe("registerPaymentService", () => {
    it("should throw 404 if user not found", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.registerPaymentService(1, "PIX", 100))
        .rejects
        .toThrow("User not found.");
    });

    it("should create a payment if user exists", async () => {
      const mockUser = { id: 1 };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      const mockPayment = { _id: "payment123" };
      (Payment.create as jest.Mock).mockResolvedValue(mockPayment);

      const result = await service.registerPaymentService(1, "PIX", 100);

      expect(result).toEqual({ message: "registered payment.", paymentId: "payment123" });
    });
  });

  describe("simulateHomologation", () => {
    it("should reject if method is not PIX", async () => {
      await expect(service.simulateHomologation("p1", "CREDIT", 100, 1))
        .rejects
        .toThrow("Invalid payment method for approval.");
    });

    it("should reject if amount <= 0", async () => {
      await expect(service.simulateHomologation("p1", "PIX", 0, 1))
        .rejects
        .toThrow("Payment amount must be greater than zero.");
    });

    it("should reject if user does not exist", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.simulateHomologation("p1", "PIX", 100, 999))
        .rejects
        .toThrow("User not found.");
    });

    it("should approve payment if valid", async () => {
      const mockUser = { id: 1 };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (Payment.findByIdAndUpdate as jest.Mock).mockResolvedValue(true);

      const result = await service.simulateHomologation("p1", "PIX", 100, 1);

      expect(result).toEqual({ message: "Payment approved successfully." });
    });

    it("should throw 500 if unexpected error occurs", async () => {
      (prisma.user.findUnique as jest.Mock).mockImplementation(() => {
        throw new Error("DB crashed");
      });

      await expect(service.simulateHomologation("p1", "PIX", 100, 1))
        .rejects
        .toThrow("DB crashed");
    });
  });
});
