import { Router } from "express";
import { ProductControllers } from "../controllers/Product-controllers";
import { authMiddleware } from "../middlewares/auth-middleware";

export const productRouter = Router();

const productControllers = new ProductControllers();

productRouter.get("/", productControllers.getAllProducts);
productRouter.get("/categories", productControllers.getAllCategories);
productRouter.get("/:id", productControllers.getProduct);

productRouter.post("/", authMiddleware, productControllers.create);
productRouter.patch("/:id", authMiddleware, productControllers.edit);
productRouter.delete("/:id", authMiddleware, productControllers.delete);
