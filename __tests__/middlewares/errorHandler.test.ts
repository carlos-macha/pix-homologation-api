import errorHandler from "../../src/middlewares/errorHandler";
import { Request } from "express";

describe("errorHandler middleware", () => {
  it("should handle error correctly", () => {
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    const next = jest.fn();
    const error = { status: 400, message: "Test error" };

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: { message: "Test error", stack: undefined },
    });
  });
});
