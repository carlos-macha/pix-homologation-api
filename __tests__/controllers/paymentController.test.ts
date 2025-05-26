import PaymentController from "../../src/controllers/paymentController";
import PaymentService from "../../src/services/paymentService";
import { Request, Response, NextFunction } from "express";

jest.mock("../../src/services/paymentService");

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("PaymentController", () => {
  let paymentService: jest.Mocked<PaymentService>;
  let paymentController: PaymentController;
  let next: NextFunction;

  beforeEach(() => {
    paymentService = new PaymentService() as jest.Mocked<PaymentService>;
    paymentController = new PaymentController(paymentService);
    next = jest.fn();
  });

  describe("registerPayment", () => {
    it("should register and approve a payment", async () => {
      const req = {
        body: {
          userId: 1,
          method: "PIX",
          amount: 100,
        },
      } as Request;

      const res = mockResponse();

      paymentService.registerPaymentService.mockResolvedValue({
        message: "registered payment.",
        paymentId: "mockPaymentId123",
      });

      paymentService.simulateHomologation.mockResolvedValue({
        message: "Payment approved successfully.",
      });

      await paymentController.registerPayment(req, res, next);

      expect(paymentService.registerPaymentService).toHaveBeenCalledWith(1, "PIX", 100);
      expect(paymentService.simulateHomologation).toHaveBeenCalledWith("mockPaymentId123", "PIX", 100, 1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Payment registered and approved successfully.",
      });
    });

    it("should call next on error", async () => {
      const req = {
        body: {
          userId: 1,
          method: "PIX",
          amount: 100,
        },
      } as Request;

      const res = mockResponse();
      const error = new Error("Failure on registering payment");

      paymentService.registerPaymentService.mockRejectedValue(error);

      await paymentController.registerPayment(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
