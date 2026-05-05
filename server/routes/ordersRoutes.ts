import express from "express";
import { authorize, protect } from "../middleware/auth.js";
import { createOrder, getOrder, getOrders, updateOrderStatus, getAllOrders } from "../controllers/orderController.js";

const ordersRouter = express.Router();

//get user orders
ordersRouter.get("/", protect, getOrders);

//get a single order
ordersRouter.get("/:id", protect, getOrder);

//create order from the cart
ordersRouter.post("/", protect, createOrder);

//update the order stats (admin)
ordersRouter.put("/:id/status", protect, authorize("admin"), updateOrderStatus);

//get all orders(admin)
ordersRouter.get("/admin/all", protect, authorize("admin"), getAllOrders);

export default ordersRouter;