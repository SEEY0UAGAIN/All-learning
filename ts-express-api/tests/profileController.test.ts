import { getProfile, editProfile } from "../src/controllers/profileController";
import { Request, Response, NextFunction } from "express";

jest.mock("../src/data-source", () => ({
  AppDataSource: {
    getRepository: jest.fn().mockReturnValue({
      create: jest.fn().mockImplementation((data: any) => data),
      save: jest.fn(),
      findOneBy: jest.fn(),
    }),
  },
}));

const createMockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe("ProfileController", () => {
  it("should return user profile", async () => {
    const req = { user: { id: 1, username: "testuser" } } as Partial<Request> & { user: { id: number, username: string } };
    const res = createMockResponse();

    await getProfile(req as Request, res);

    expect(res.json).toHaveBeenCalledWith({
      message: "Profile access granted",
      user: req.user,
    });
  });
});

describe("ProfileController - editProfile", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let repo: any;

  beforeEach(() => {
    req = {
      params: { id: "1" },
      body: { username: "newuser", password: "newpassword" },
    };
    res = createMockResponse();
    next = jest.fn();

    // ดึง repository mock
    const { AppDataSource } = require("../src/data-source");
    repo = AppDataSource.getRepository();
    repo.save.mockReset();
    repo.findOneBy.mockReset();
  });

  it("should update username and password successfully", async () => {
    repo.findOneBy.mockResolvedValue({ id: 1, username: "olduser", password: "oldhash" });

    await editProfile(req as Request, res as Response, next);

    expect(repo.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: "Profile Updated",
      user: expect.objectContaining({
        username: "newuser",
        password: expect.any(String),
      }),
    }));
  });

  it("should return 400 if username is invalid type", async () => {
    req.body = { username: 123, password: "newpassword" };

    await editProfile(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid input" });
  });

  it("should return 404 if user not found", async () => {
    repo.findOneBy.mockResolvedValue(null);

    await editProfile(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    const error = (next as jest.Mock).mock.calls[0][0];
    expect(error.message).toBe("User not found");
    expect(error.status).toBe(404);
  });
});
