import express from "express";
import { getProduct, getProducts, createProduct, updateProduct, deleteProduct } from "../controllers/productController.js";
import upload from "../middleware/upload.js"
import {authorize, protect } from "../middleware/auth.js"


const ProductRouter = express.Router()

 //get all products
ProductRouter.get('/', getProducts)

 //get single Product
ProductRouter.get('/:id', getProduct)

 //create
ProductRouter.post('/', upload.array("images", 5), protect, authorize('admin'), createProduct)

 //update
ProductRouter.put('/:id', upload.array("images", 5), protect, authorize('admin'), updateProduct)

 //delete
ProductRouter.delete('/', upload.array("images", 5), protect, authorize('admin'), deleteProduct)

export default ProductRouter;
 
