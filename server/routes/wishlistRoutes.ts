import express from "express";
import { protect } from "../middleware/auth.js";
import { getWishlist, removeWishlistItem, toggleWishlistItem } from "../controllers/wishlistController.js";

const wishlistRouter = express.Router();

wishlistRouter.get("/", protect, getWishlist);


wishlistRouter.post("/toggle", protect, toggleWishlistItem);


wishlistRouter.delete("/:productId", protect, removeWishlistItem);

export default wishlistRouter;