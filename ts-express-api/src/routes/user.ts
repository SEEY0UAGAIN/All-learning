import { Router, Request, Response, NextFunction } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

interface CustomError extends Error {
    status?: number;
}

const router = Router();
const userRepo = AppDataSource.getRepository(User);

router.get("/", async (req:Request, res:Response) => {
    const users = await userRepo.find();
    res.json(users);
})

router.post("/", async (req: Request, res: Response ) => {
    const { name, age } = req.body;

    if (typeof name !== "string" || typeof age !== "number") {
        return res.status(400).json({ message: "Invalid input"});
    }
    const user = userRepo.create({ name, age });
    await userRepo.save(user);
    res.status(201).json(user);
});

router.put("/:id", async (req: Request, res: Response , next: NextFunction ) => {
    const id = Number(req.params.id);
    const { name, age } = req.body;

    if (name !== undefined && typeof name !== "string") {
        return res.status(400).json({ message: "Invalid input"});
    }

    if (age !== undefined && typeof age !== "number") {
        return res.status(400).json({ message: "Invalid input"});
    }

    const user = await userRepo.findOneBy({id});

    if (!user) {
        const error: CustomError = new Error("User notfound");
        error.status = 404;
        return next(error);
    }

    if (name !== undefined)user.name = name;
    if (name !== undefined)user.age = age;

    await userRepo.save(user);

    res.json(user);
});

// router.get("/:id", (req: Request, res: Response) => {
//     const id = Number(req.params.id);
//     const user = users.find((u) => u.id === id);

//     if (!user) return res.status(404).json({ message: "User not found" });

//     res.json(user);
// });

router.delete("/:id", async(req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id)
    const user = await userRepo.findOneBy({id});

    if (!user) {
        const error:CustomError = new Error("User not found");
        error.status = 404;
        return next(error);
    } else {
        await userRepo.remove(user);
        res.status(204).send();
    }
})


export default router;