import "dotenv/config";
import express, { Request, Response } from 'express';
import cors from "cors";
import connectDB from "./config/db.js";
import { clerkMiddleware } from '@clerk/express'
import { clerkWebhook } from "./controllers/webhooks.js";
import makeAdmin from "./scripts/makeAdmin.js";
import ProductRouter from "./routes/productsRoutes.js"
import CartRouter from "./routes/cartRoutes.js"
import ordersRouter from "./routes/ordersRoutes.js";
import addressRouter from "./routes/addressRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import wishlistRouter from "./routes/wishlistRoutes.js";

const app = express();

//connect to mongoDB
await connectDB();

app.post('/api/clerk', express.raw({type: "application.json"}), clerkWebhook)

// Middleware
app.use(cors())
app.use(express.json());
app.use(clerkMiddleware());

const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
});

app.use("/api/products", ProductRouter)
app.use("/api/cart", CartRouter)
app.use("/api/orders", ordersRouter)
app.use("/api/addresses", addressRouter)
app.use("/api/admin", adminRouter)
app.use("/api/wishlist", wishlistRouter)

await makeAdmin();

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});