import { Router } from "express";
import { UserControllers } from "../controllers/User-controllers";

export const userRouter = Router();

const userControllers = new UserControllers();

userRouter.post("/sign-up", userControllers.create);
userRouter.post("/sign-in", userControllers.login);