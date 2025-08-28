import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
    status?: number; // status เป็น optinal ที่มีหรือไม่มีก็ได้แต่ถ้ามีก็ต้องเป็น number
}

export class AppError extends Error implements CustomError {
    status: number;

    constructor(message: string, status: number = 400) {
        super(message); // เรียกใช้งาน constructor ของ Error
        this.status = status; // กำหนด status ที่ส่งเข้ามาหรือ default = 400

        Object.setPrototypeOf(this, AppError.prototype);
    }
}

const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    let message = "Internal Server Error"; // default message
    let status = 500; // default HTTP status

    if (err instanceof Error) {
        message = err.message; // ใช้ message จาก Error object

        status = (err as CustomError).status ?? 500;

    } else if (typeof err === "string") {
        message = err;
    } else if (typeof err === "number") {
        message = `Error code: ${err}`;
        status = err;
    }

    res.status(status).json({ status, message });
};

export default errorHandler;
