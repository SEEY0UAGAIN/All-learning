// const mockSave = jest.fn();
// const mockFindOneBy = jest.fn();

// jest.mock("../src/data-source", () => {
//   return {
//     AppDataSource: {
//       getRepository: jest.fn().mockReturnValue({
//         create: jest.fn().mockImplementation((data: any) => data),
//         save: mockSave,
//         findOneBy: mockFindOneBy,
//       }),
//     },
//   };
// });

import { Request, Response, NextFunction } from "express";
import { validateDTO } from "../src/middleware/validateDTO";
import { plainToInstance } from "class-transformer";
import { isString, validate } from "class-validator";
import errorHandler, { AppError } from "../src/middleware/errorHandler";

jest.mock("class-transformer", () => ({
  plainToInstance: jest.fn()
}));

jest.mock("class-validator", () => ({
  validate: jest.fn()
}));

describe("Middleware - validateDTO", () => {
    const mockNext = jest.fn();

    const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ไม่มี error
    it("should call next() when no validation error", async () => {
        (plainToInstance as jest.Mock).mockReturnValue({ some: "dto"});

        (validate as jest.Mock).mockResolvedValue([]);

        const middleware = validateDTO(class {});
        await middleware({ body: {} } as any, mockRes as any, mockNext);

        expect(mockNext).toHaveBeenCalled();
        expect(mockRes.status).not.toHaveBeenCalled();
    });
    // error
    it("should return 400 when validation errors exist", async () => {
        (plainToInstance as jest.Mock).mockReturnValue({ some: "dto" });

        (validate as jest.Mock).mockResolvedValue([
            { constraints: { isString: "must be string" } }
        ]);

        const middleware = validateDTO(class {});
        await middleware({ body: {} } as any, mockRes as any, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(400);

        expect(mockRes.json).toHaveBeenCalledWith({
            status: 400,
            message: "Validation failed",
            error: [{ isString: "must be string" }]
        });

        expect(mockNext).not.toHaveBeenCalled();
    });
});

describe("errorHandler middleware", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(), 
      json: jest.fn(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  it("should handle AppError with custom status", () => {
    const err = new AppError("Custom error", 418); 
    errorHandler(err, mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(418);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: 418,
      message: "Custom error",
    });
  });

  it("should handle generic Error with default 500", () => {
    const err = new Error("Something went wrong");
    errorHandler(err, mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: 500,
      message: "Something went wrong",
    });
  });

  it("should handle string error", () => {
    const err = "This is a string error";
    errorHandler(err, mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500); // default 500
    expect(mockRes.json).toHaveBeenCalledWith({
      status: 500,
      message: "This is a string error",
    });
  });

  it("should handle number error", () => {
    const err = 404;
    errorHandler(err, mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: 404,
      message: "Error code: 404",
    });
  });
});
