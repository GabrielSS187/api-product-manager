import { Request, Response, NextFunction } from "express";
import { app } from "./config/server";
import "express-async-errors";

import { userRouter } from "./routes/User-routers";
import { productRouter } from "./routes/Product-routes";
import { CustomError } from "./errors/Custom-error";

app.use("/user", userRouter);
app.use("/product", productRouter);

//* Errors assíncronos ===================================================
// rome-ignore lint/suspicious/noExplicitAny: <explanation>
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
	return error instanceof CustomError
		? res.status(error.statusCode).send(error.message)
		: res.status(500).send(error.message || error.pgMessage);
});
