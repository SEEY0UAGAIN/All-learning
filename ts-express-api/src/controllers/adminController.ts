import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

export const deleteUser = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id); // ดึง userId จาก url และแปลงเป็น number
    
    try {
        const userRepo = AppDataSource.getRepository(User); // ดึงข้อมูล User จาก AppDataSource

        const user = await userRepo.findOneBy({ id: userId }); // ค้นหาผู้ใช้ตาม id

        if (!user) {
            return res.status(404).json({ message: "User not found "});
        }

        await userRepo.remove(user); // ลบ user ออกจาก DB

        return res.json({ message: `User ${userId} Deleted successfully` }); // ส่ง response กลับมาว่า user ถูกลบ
    } catch (err) { // ถ้า error จะแสดง status 500
        return res.status(500).json({ message: "Server error", error:err });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const userRepo = AppDataSource.getRepository(User); // ดึงข้อมูล User จาก AppDataSource
        const users = await userRepo.find(); // ดึงข้อมูล user ทั้งหมด
        return res.json(users); // ส่ง response กลับมาเป็น json ของ user ทั้งหมด
    } catch (err) { // ถ้าเกิด error ระหว่าง query
        return res.status(500).json({ message: "Server error", erroe: err }); // แสดง status 500
    }
}