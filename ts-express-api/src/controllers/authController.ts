import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export interface RegisterRequest {
    username: string;
    password: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export const register = async (req: Request<{}, {}, RegisterRequest>,res: Response) => {
    const { username, password } = req.body;
    const userRepo = AppDataSource.getRepository(User);

    // ✅ Validation
    if (!username || username.length < 3) {
        return res
            .status(400)
            .json({ message: "Username must be at least 3 characters" });
    }
    if (!password || password.length < 6) {
        return res
            .status(400)
            .json({ message: "Password must be at least 6 characters" });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = userRepo.create({ username, password: hashedPassword });
    await userRepo.save(user);

    res.status(201).json({ message: "User registered", userId: user.id });
};

export const login = async (req: Request<{}, {}, LoginRequest>,res: Response) => {
    const { username, password } = req.body;
    const userRepo = AppDataSource.getRepository(User);

    const user = await userRepo.findOneBy({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
        return res.status(401).json({ message: "Invalid password" });

    // สร้าง Access Token
    const secret = process.env.JWT_SECRET as string;
    const accessToken = jwt.sign(
        { userId: user.id, username: user.username },
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
};

export const refresh = async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken; // ดึง refresh token จาก cookie

    if (!token) {
        return res.status(401).json({ message: "No refresh token provided" });
    }

    const secret = process.env.JWT_SECRET || "defaultSecret";

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

export const deleteUser = (req: Request, res: Response) => {
    const userId = req.params.id;
  res.json({ message: `User ${userId} Deleted successfully` });
}