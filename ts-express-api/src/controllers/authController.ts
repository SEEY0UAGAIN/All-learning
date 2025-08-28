import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { AppError } from "../middleware/errorHandler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export interface RegisterRequest {
    email: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export const register = async (req: Request<{}, {}, RegisterRequest>,res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const userRepo = AppDataSource.getRepository(User);

        if (!email.endsWith("@example.com")) {
          throw new AppError("Email must be example.com", 400);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = userRepo.create({ email, password: hashedPassword });
        await userRepo.save(newUser);

        res.status(201).json({ message: "User registered", userId: newUser.id });
    } catch (err) {
        next(err);
    }
};

export const login = async (req: Request<{}, {}, LoginRequest>,res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const userRepo = AppDataSource.getRepository(User);

        const user = await userRepo.findOneBy({ email });
        if (!user) {
            throw new AppError("User not found", 404);
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            throw new AppError("Invalid password", 401);
        }

        // สร้าง Access Token
        const secret = process.env.JWT_SECRET;
        if (!secret) throw new AppError("JWT secret not configured", 500);

        const accessToken = jwt.sign(
            { userId: user.id, email: user.email },
            secret,
            { expiresIn: "15m" } // access token อายุสั้น
        );

        // สร้าง Refresh Token
        const refreshToken = jwt.sign({ userId: user.id }, secret, {
            expiresIn: "7d",
        });

        // เก็บ Refresh Token ลง Cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true, // JS ฝั่ง client อ่านไม่ได้
            secure: process.env.NODE_ENV === "production", // dev=false, prod=true
            sameSite: "strict", // ป้องกัน CSRF
        });

        // ✅ ส่ง Access Token กลับไป
        res.json({ accessToken });
    } catch (err) {
        next(err)
    }
};

export const refresh = async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken; // ดึง refresh token จาก cookie

    if (!token) {
        return res.status(401).json({ message: "No refresh token provided" });
    }

    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    const secret = process.env.JWT_SECRET;

    try {
        // ตรวจสอบ refresh token
        const decoded = jwt.verify(token, secret) as { userId: number };

        // สร้าง access token ใหม่
        const newAccessToken = jwt.sign(
            { userId: decoded.userId },
            secret,
            { expiresIn: "15m" }
        );

        res.json({ accessToken: newAccessToken });
    } catch (err) {
        return res.status(403).json({ message: "Invalid refresh token" });
    }
};

