import { Router } from "express";
import { register, login, refresh } from "../controllers/authController";
import { getProfile, editProfile } from "../controllers/profileController";
import { authenticateJWT } from "../middleware/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.get("/profile", authenticateJWT,getProfile);
router.put("/profile/:id",authenticateJWT,editProfile);

export default router;
