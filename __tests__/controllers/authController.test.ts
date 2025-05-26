import AuthController from "../../src/controllers/authController";
import AuthService from "../../src/services/authService";
import { Request, Response, NextFunction } from "express";

jest.mock("../../src/services/authService");

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("AuthController", () => {
  let authService: jest.Mocked<AuthService>;
  let authController: AuthController;
  let next: NextFunction;

  beforeEach(() => {
    authService = new AuthService() as jest.Mocked<AuthService>;
    authController = new AuthController(authService);
    next = jest.fn();
  });

  describe("login", () => {
    it("should return token on successful login", async () => {
      const req = {
        body: { email: "test@example.com", password: "password123" }
      } as any;

      const res = mockResponse();

      authService.loginUser.mockResolvedValue({
        status: 200,
        message: "Login successfully",
        token: "mockToken"
      });

      await authController.login(req, res, next);

      expect(authService.loginUser).toHaveBeenCalledWith("test@example.com", "password123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Login successfully",
        token: "mockToken"
      });
    });

    it("should call next on login error", async () => {
      const req = { body: { email: "a", password: "b" } } as any;
      const res = mockResponse();
      const error = new Error("Login failed");

      authService.loginUser.mockRejectedValue(error);

      await authController.login(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("register", () => {
    it("should return success message on register", async () => {
      const req = {
        body: { email: "new@example.com", password: "123456", name: "Test" }
      } as any;
      const res = mockResponse();

      authService.registerUser.mockResolvedValue({
        status: 201,
        message: "User created successfully"
      });

      await authController.register(req, res, next);

      expect(authService.registerUser).toHaveBeenCalledWith("new@example.com", "123456", "Test");
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: "User created successfully" });
    });

    it("should call next on register error", async () => {
      const req = { body: { email: "", password: "", name: "" } } as any;
      const res = mockResponse();
      const error = new Error("Register error");

      authService.registerUser.mockRejectedValue(error);

      await authController.register(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("validate", () => {
    it("should return valid token message", async () => {
      const req = {
        headers: { authorization: "Bearer valid.token" }
      } as any;
      const res = mockResponse();

      authService.validateToken.mockResolvedValue({
        status: 200,
        message: "Valid token"
      });

      await authController.validate(req, res, next);

      expect(authService.validateToken).toHaveBeenCalledWith("valid.token");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Valid token" });
    });

    it("should call next on invalid token", async () => {
      const req = {
        headers: { authorization: "Bearer invalid.token" }
      } as any;
      const res = mockResponse();
      const error = new Error("Invalid token");

      authService.validateToken.mockRejectedValue(error);

      await authController.validate(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
