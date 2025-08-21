import { Router, Request, Response, NextFunction } from "express";

interface User {
    id: number;
    name: string;
    age: number;
}

interface CustomError extends Error {
    status?: number;
}

const users: User[] = [
    { id: 1, name: "John", age: 23},
    { id: 2, name: "Jane", age: 30},
    { id: 3, name: "JJJ", age: 24}
]

const router = Router();

router.get("/", (req:Request, res:Response) => {
    res.json(users);
})

router.post("/", (req: Request, res: Response ) => {
    const { name, age } = req.body;

    if (typeof name !== "string" || typeof age !== "number") {
        return res.status(400).json({ message: "Invalid input: name must be string, age must be number"});
    }

    const newUser: User = {
        id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
        name,
        age
    }

    users.push(newUser);

    res.status(201).json(newUser);
});

router.get("/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const user = users.find((u) => u.id === id);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
});

router.delete("/:id", (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id)
    const index = users.findIndex(u => u.id === id);

    if (index !== -1) {
        users.splice(index, 1);
        res.status(204).send();
    } else {
        const error = new Error("User not found");
        (error as any).status = 404;
        return next(error);
    }
})

router.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error"
    })
})


export default router;