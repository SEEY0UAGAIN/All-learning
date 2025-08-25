import request from "supertest";
import { AppDataSource } from "../src/data-source";
import app from "../src/app";
import jwt from "jsonwebtoken";

process.env.JWT_SECRET = "testSecret";

let accessToken: string;
let userId: number;

// ฮุกของ Jest: beforeAll จะรัน "ครั้งเดียว" ก่อนทุก test ในไฟล์นี้
beforeAll(async () =>{
    await AppDataSource.initialize(); // .intiialize() มีหน้าที่ในการเปิดการเชื่อมต่อ DB
});
// ฮุกของ Jest: afterAll จะรัน "ครั้งเดียว" หลังจากทุก test ในไฟล์นี้เสร็จหมดแล้ว
afterAll(async () => {
    await AppDataSource.destroy(); // .destroy() ปิดการเชื่อมต่อ DB  // ปิดการเขื่อต่อหลัง tset เสร็จ
});

describe("Auth API", () => {
    it("POST /register should create a user", async () => {
        const res = await request(app)
        .post("/register")
        .send({ username: "integrationTest", password: "123456"});

        expect(res.status).toBe(201);

        expect(res.body).toHaveProperty("userId");

        userId = res.body.userId;
    });

    it("POST /login should return JWT token", async () => {
        const res = await request (app)
        .post("/login")
        .send({ username: "integrationTest", password: "123456"});

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("accessToken");

        accessToken = res.body.accessToken;
    });
 
    it("POST /refresh - no token should return 401", async () => {
        const res = await request(app)
        .post("/refresh")
        .send(); // ไม่มี cookie

        expect(res.status).toBe(401);
        expect(res.body).toEqual({ message: "No refresh token provided" });
    });

    it("POST /refresh - invalid token should return 403", async () => {
        const res = await request(app)
        .post("/refresh")
        .set("Cookie", ["refreshToken=invalidToken"]) // cookie ไม่ตรง
        .send();

        expect(res.status).toBe(403);
        expect(res.body).toEqual({ message: "Invalid refresh token" });
    });
    
    it("POST /refresh - valid token should return new access token", async () => {
        const secret = "testSecret";
        process.env.JWT_SECRET = secret;

        const refreshToken = jwt.sign({ userId }, secret, { expiresIn: "15m" });

        const res = await request(app)
        .post("/refresh")
        .set("Cookie", [`refreshToken=${refreshToken}`])
        .send();

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("accessToken");
    });
});

describe("ProfileAPI", () => {
    it("GET /profile - should return profile", async () => {
        const res = await request(app)
        .get("/profile")
        .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual(expect.objectContaining({
        message: "Profile access granted",
        user: expect.any(Object),
    }));
  });

    it("PUT /profile/:id - EDIT Profile", async () => {
        const res = await request (app)
        .put(`/profile/${userId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ username: "updatedName" });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "Profile Updated");
        expect(res.body.user.username).toBe("updatedName");
    });
});

describe("Admin Routes", () => {
    // ทดสอบแบบไม่ส่ง token
    it("should deny access without token", async () => {
        const res = await request(app).delete("/admin/user/1"); // ส่ง request ไปที่ user/1 โดยไม่มี token
        expect(res.status).toBe(401); // ผลที่คาดหวังคือ status = 401
    });
    // ทดสอบกรณีไม่ใช่ admin
    it("should deny access if not admin role", async () => { 
        const token = jwt.sign({ userId: 1, username: "testuser", role: "user" }, "secret"); // สร้าง jwt ให้ user

        const res = await request(app) // ส่ง request ไปที่ app
            .delete("/admin/user/1") // ลบ user id = 1
            .set("Authorization", `Bearer ${token}`); // แนบ Authorization header พร้อม token ที่ได้าร้างไว้ด้านบน

        expect(res.status).toBe(403); // ผลที่คาดหวังคือ status = 403 
    });
    // ทดสอบกรณี role = admin
    it("should allow admin to delete user", async () => {
        const token = jwt.sign({ userId: 1, username: "adminuser", role: "admin" },process.env.JWT_SECRET || "secret",{ expiresIn: "1h" }); // สร้าง jwt ให้ admin

        const res = await request(app)
            .delete("/admin/user/1") // ส่ง Delete request ไปที่ user/1
            .set("Authorization", `Bearer ${token}`) // แนบ Authorization header พร้อม token ที่ได้าร้างไว้ด้านบน
        
        expect(res.status).toBe(200); // ผลที่คาดหวัง status 200
    })
})