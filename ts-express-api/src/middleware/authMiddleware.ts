import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface JwtPayload { // กำหนด interface ของ payload ใน jwt
    userId: number; // ID
    username: string; // ชื่อผู้ใช้
    role: string; // สิทธิ์ของผู้ใช้
}

export interface AuthRequest extends Request {
    user?: JwtPayload;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"]; // ดึง AuthHeader จาก Request

    const token = authHeader && authHeader.split(' ')[1]; // ดึงโทเคนจาก AuthHeader

    if (!token) return res.status(401).json({ message: "Access token required" }); // ไม่มี token ส่งสถานะพร้อมข้อความ

    // ตรวจสอบความถูฏต้องของ token
    try { 
        // ถ้า token ถูกจะได้ payload กลับมา
        const payload = jwt.verify(token, process.env.JWT_SECRET || "secret") as JwtPayload;

        req.user = payload; //เก็บ payload ไว้ใน req.user เพื่อให้ route ใช้งานได้

        next(); // เรียก next() เพื่อไปยัง middleware หรือ function ถัดไป
    } catch {
        return res.status(403).json({ message: "Invalid or expired token "}); // ถ้า token ไม่ถูกต้องหรือหมดอายุจะแสดงสถานะ 403
    };
};

// Middleward ตรวจสอบ Role ของผู้ใช้
export const authorizeRole = (role: string) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        // ถ้าไม่มี role หรือ role ไม่ถูฏต้องจะแสดง 403 พร้อมข่้อความ
        if (!req.user || req.user.role !== role) {
            return res.status(403).json({ message: "Forbidden: insufficient rights" });
        }

        next(); // ถ้า role ถูกต้องจะไปที่ route ต่อไป
    };
};