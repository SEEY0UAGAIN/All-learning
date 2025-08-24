import { register, login, refresh} from "../src/controllers/authController";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const mockSave = jest.fn();
const mockFindOneBy = jest.fn();

jest.mock("../src/data-source", () => {
  return {
    AppDataSource: {
      getRepository: jest.fn().mockReturnValue({
        create: jest.fn().mockImplementation((data: any) => data),
        save: mockSave,
        findOneBy: mockFindOneBy,
      }),
    },
  };
});

const createMockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe("AuthController - register", () => {
  it("should return 201 and create user", async () => {
    const req = { body: { username: "testuser", password: "123456" } } as Request;

    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { status } as unknown as Response;

    await register(req, res);

    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ message: "User registered" }));
  });
});

describe("AuthController - refresh", () => {
  it("should return 401 if no refresh token", async () => {
    const req: Partial<Request> = { cookies: {} };
    const res = createMockResponse();

    await refresh(req as any, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "No refresh token provided" });
  });

  it("should return 403 if token is invalid", async () => {
    const req: Partial<Request> = { cookies: { refreshToken: "invalid" } };
    const res = createMockResponse();

    await refresh(req as any, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid refresh token" });
  });

  it("should return new access token if token is valid", async () => {
    const secret = "testSecret";
    process.env.JWT_SECRET = secret;

    const fakeToken = jwt.sign({ userId: 1 }, secret, { expiresIn: "1h" });
    const req: Partial<Request> = { cookies: { refreshToken: fakeToken } };
    const res = createMockResponse();

    await refresh(req as any, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ accessToken: expect.any(String) })
    );
  });
});
