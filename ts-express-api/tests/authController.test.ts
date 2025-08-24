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

import { register, login, refresh} from "../src/controllers/authController";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

const createMockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn();
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

describe("AuthController - Login", () => {
  it("Login complete", async () => {
    const secret = "testSecret";
    process.env.JWT_SECRET = secret;
    const hashedPassword = await bcrypt.hash("123456", 10);
    const fakeUser = { id:1, username: "testuser", password: hashedPassword };

    mockFindOneBy.mockResolvedValue(fakeUser);

    const res: Partial<Response> = {
      json: jest.fn(),
      cookie: jest.fn(),
    } as any;

    const req = {
      body: { username: "testuser", password: "123456" },
    } as Partial<Response>;

    await login(req as any,res as any);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        accessToken: expect.any(String),
      })
    );

    expect(res.cookie).toHaveBeenCalledWith(
      "refreshToken",
      expect.any(String),
      expect.objectContaining({
        httpOnly: true,
        sameSite: "strict",
      })
    )
  });

  it("User not found", async () => {
    mockFindOneBy.mockReturnValue(null);

    const req = { body: { username: "UUUUUUUU", password: "123456"} } as Partial<Request>;
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await login(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

    it("Password is invalid", async () => {
    const hashedPassword = await bcrypt.hash("1111111", 10);
    const fakeUser = { id:1, username: "testuser", password: hashedPassword };

    mockFindOneBy.mockResolvedValue(fakeUser);

    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    } as any;

    const req = { body: { username: "testuser", password: "1112221" } } as Partial<Response>;

    await login(req as any,res as any);

  expect(res.status).toHaveBeenCalledWith(401);
  expect(res.json).toHaveBeenCalledWith({ message: "Invalid password" });
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
