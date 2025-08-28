import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import bcrypt from "bcryptjs";

interface CustomError extends Error {
    status?: number;
}

export const getProfile = (req: Request, res: Response) => {
  res.json({ message: "Profile access granted", user: (req as any).user });
};

export const editProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
const id = Number(req.params.id);
        const { email, password } = req.body;

        if (email !== undefined && typeof email !== "string") {
          return res.status(400).json({ message: "Invalid input" });
        }

        if (password !== undefined && typeof password !== "string") {
          return res.status(400).json({ message: "Invalid input" });
        }

        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOneBy({ id });

        if (!user) {
            const error: CustomError = new Error("User not found");
            error.status = 404;
            return next(error);
        }

        if (email !== undefined) user.email = email;
        if (password !== undefined) user.password = await bcrypt.hash(password, 10);

        await userRepo.save(user);
        res.json({ message: "Profile Updated", user });
};

