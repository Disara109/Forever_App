import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import { getAdminStats } from "../controllers/adminController.js";

const adminRouter = express.Router()

//get dashboard stats 
adminRouter.get('/stats', protect,authorize('admin'), getAdminStats )

export default adminRouter;