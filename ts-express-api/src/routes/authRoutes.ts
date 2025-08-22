import { Router, Request, Response, NextFunction } from "express";
import { register, login } from "../controllers/authController";
import { AuthRequest,authenticateJWT } from "../middleware/auth";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import bcrypt from "bcryptjs";

const router = Router();

interface CustomError extends Error {
    status?: number;
}

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authenticateJWT, (req, res) => {
  res.json({ message: "Profile access granted", user: (req as any).user });
});
router.put("/profile/:id",authenticateJWT, async (req: AuthRequest, res: Response, next: NextFunction) => {
        const id = Number(req.params.id);
        const { username, password } = req.body;

        if (username !== undefined && typeof username !== "string") {
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

        if (username !== undefined) user.username = username;
        if (password !== undefined) user.password = await bcrypt.hash(password, 10);

        await userRepo.save(user);
        res.json({ message: "Profile Updated", user });
  }
);

export default router;
