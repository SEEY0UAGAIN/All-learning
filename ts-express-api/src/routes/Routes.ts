import { Router } from "express";
import { register, login, refresh } from "../controllers/authController";
import { deleteUser, getAllUsers } from "../controllers/adminController";
import { getProfile, editProfile } from "../controllers/profileController";
import { authenticateToken, authorizeRole } from "../middleware/authMiddleware";

const router = Router();

// auth
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);

// profile
router.get("/profile", authenticateToken,getProfile);
router.put("/profile/:id",authenticateToken,editProfile);

// admin
router.get("/admin/users", authenticateToken, authorizeRole("admin"), getAllUsers)
router.delete("/admin/user/:id", authenticateToken, authorizeRole("admin"), deleteUser);

export default router;
