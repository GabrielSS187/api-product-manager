import { NextFunction, Request, Response } from "express";

import { JwtAdapter } from "../adapters/JwtAdapter/Jwt-adapter";

const jwt = new JwtAdapter();

export const authMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { authorization } = req.headers;

	if (!authorization) throw new Error("Unauthorized, token is required");

	const token = authorization.replace("Bearer", "").trim();

	try {
		const decoded = jwt.getToken({ token });

		const { role } = decoded;
		req.userRole = role;

		next();
		// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	} catch (error: any) {
		return res.status(401).json(error.message);
	}
};
