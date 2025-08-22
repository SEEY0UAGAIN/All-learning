import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import dotenv from "dotenv";

dotenv.config(); 

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: process.env.NODE_ENV !== "production",  // prod ไม่ควร sync schema อัตโนมัติ
    logging: process.env.NODE_ENV === "development",     // log เฉพาะตอน dev
    entities: [User],
    migrations: [],
    subscribers: [],
});
