import "reflect-metadata";
import express from 'express';
import { AppDataSource } from "./data-source";
import userRouter from "./routes/user";
import errorHandler from "./middleware/Middleware";

const app = express();
const port = 3000;

app.use(express.json());

async function waitForDatabaseAndStart() {
    const maxRetries = 10;
    let attempt = 0;

    while (attempt < maxRetries) {
        try {
            attempt++;

            await AppDataSource.initialize();
            console.log("Database connected!");
            break;
        } catch (err) {
            console.log(`DB connection failed (attempt ${attempt}/${maxRetries}). Retrying in 3s...`);
            await new Promise(res => setTimeout(res, 3000))
        }
    }

    if (!AppDataSource.isInitialized) {
        console.error("Could not connect to database. Exiting");
        process.exit(1);
    }

    app.use("/users", userRouter);
    app.use(errorHandler);
    
    app.listen(3000, "0.0.0.0", () => {
        console.log(`🚀 Server is running at http:localhost:${port}`);
    })

}

app.get("/", (req, res) => res.send("Hello from TypeScript + Express!!!"));

waitForDatabaseAndStart();
