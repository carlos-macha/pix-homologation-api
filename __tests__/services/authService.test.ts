import AuthService from "../../src/services/authService";
import prisma from "../../src/prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getEnvVar } from "../../src/utils/environmentVariableHandling";

jest.mock("../../src/prisma/client", () => {
  return {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };
});
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../../src/utils/environmentVariableHandling");

describe("AuthService", () => {
  const authService = new AuthService();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("registerUser", () => {
    it("should create a user successfully", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
      (prisma.user.create as jest.Mock).mockResolvedValue({});

      const result = await authService.registerUser("test@example.com", "123456", "John");

      expect(result.status).toBe(201);
      expect(result.message).toBe("User created successfully");
    });

    it("should throw error if email already exists", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1 });

      await expect(
        authService.registerUser("test@example.com", "123456", "John")
      ).rejects.toThrow("Email already registered");
    });

    it("should throw 500 on unexpected error", async () => {
      (prisma.user.findUnique as jest.Mock).mockImplementation(() => {
        throw new Error("DB error");
      });

      await expect(
        authService.registerUser("test@example.com", "123456", "John")
      ).rejects.toThrow("DB error");
    });
  });

  describe("loginUser", () => {
    it("should login successfully and return token", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1, email: "test@example.com", password: "hashed" });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (getEnvVar as jest.Mock).mockReturnValue("secret");
      (jwt.sign as jest.Mock).mockReturnValue("fake-jwt-token");

      const result = await authService.loginUser("test@example.com", "123456");

      expect(result.status).toBe(200);
      expect(result.token).toBe("fake-jwt-token");
    });

    it("should throw 404 if user not found", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(authService.loginUser("no-user@example.com", "123456")).rejects.toThrow("user does not exist");
    });

    it("should throw 401 if password is invalid", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ email: "test@example.com", password: "hashed" });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.loginUser("test@example.com", "wrongpass")).rejects.toThrow("Invalid password");
    });
  });

  describe("validateToken", () => {
    it("should return 200 if token is valid", async () => {
      (getEnvVar as jest.Mock).mockReturnValue("secret");
      (jwt.verify as jest.Mock).mockReturnValue({ userId: 1 });

      const result = await authService.validateToken("valid-token");

      expect(result.status).toBe(200);
      expect(result.message).toBe("Valid token");
    });

    it("should throw 401 if token is missing", async () => {
      await expect(authService.validateToken("")).rejects.toThrow("Token not provided");
    });

    it("should throw 401 if token is invalid", async () => {
      (getEnvVar as jest.Mock).mockReturnValue("secret");
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("invalid");
      });

      await expect(authService.validateToken("bad-token")).rejects.toThrow("Invalid or expired token");
    });
  });
});
