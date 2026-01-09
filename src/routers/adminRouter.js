import { Router } from "express";
import { authenticateToken } from "../middleware/authenticateToken.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { listUsers, getUserById, deleteUser } from "../controllers/adminController.js";
import { validateParams } from "../middleware/validation.js";
import { getByIdSchema } from "../controllers/models/collection.js"; 

const router = Router();

router.use(authenticateToken);
router.use(isAdmin);

router.get("/users", listUsers);
router.get("/users/:id", validateParams(getByIdSchema), getUserById);
router.delete("/users/:id", validateParams(getByIdSchema), deleteUser);

export default router;
