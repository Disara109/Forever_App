import {ImageCapture, ICartItem } from '../types/index.js';
import mongoose ,{ Schema } from 'mongoose';

const cartItemSchema = new Schema<ICartItem> ({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    //create the fckass schema from here
})