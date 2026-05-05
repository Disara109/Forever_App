import express from "express";
import { protect } from "../middleware/auth.js";
import { clearCart, getCart, removeCartItem, updateCartItems } from "../controllers/cartController.js"
import Cart from "../models/Cart.js";

const CartRouter = express.Router()

//get user cart
CartRouter.get('/', protect, getCart);

//add item to the cart
CartRouter.post('/add', protect, updateCartItems);

//update the cart item quantity
CartRouter.put('/item/:productId', protect, removeCartItem);

//clear the cart
CartRouter.delete('/item/:productId', protect, clearCart);

export default CartRouter;