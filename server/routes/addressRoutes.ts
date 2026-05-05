import express from "express";
import { authorize, protect } from "../middleware/auth.js";
import { createAddress, deleteAddress, getAddresses, updateAddress } from "../controllers/addressController.js";

const addressRouter = express.Router();

//get all the addresses
addressRouter.get("/", protect, getAddresses);

//create a new address
addressRouter.post("/", protect, createAddress);

//updathe the address
addressRouter.put("/:id", protect, updateAddress);

//delete
addressRouter.delete("/:id", protect, deleteAddress);

export default addressRouter;