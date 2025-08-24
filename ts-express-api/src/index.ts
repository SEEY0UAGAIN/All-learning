import "reflect-metadata";
import { AppDataSource } from "./data-source";
import app from "./app";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 3000;

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

    app.listen(3000, "0.0.0.0", () => {
        console.log(`🚀 Server is running at http:localhost:${port}`);
    })

}

waitForDatabaseAndStart();