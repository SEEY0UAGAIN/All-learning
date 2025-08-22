import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export interface Users {
    username: string;
    password: string;
}

export const register = async (req: Request<{},{}, Users>, res: Response) => {
    const { username, password } = req.body;
    const userRepo = AppDataSource.getRepository(User);

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = userRepo.create({ username, password: hashedPassword });

    await userRepo.save(user);
    res.status(201).json({ message: "User registered", userId: user.id});
};

export const login = async (req: Request<{},{}, Users>, res: Response) => {
    const { username, password } = req.body;
    const userRepo = AppDataSource.getRepository(User);

    const user = await userRepo.findOneBy({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: "Invalid password" });

    const secret = process.env.JWT_SECRET || "secret";
    const token = jwt.sign({ userId: user.id, username: user.username }, secret, { expiresIn: "1h" });

    res.json({ token });
};