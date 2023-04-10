import { Request, Response } from "express";
import { LoginUserCase } from "../../use-cases/User/Login-user-case";
import { UserRepository } from "../../repositories/bd/BD-user-repository";
import { JwtAdapter } from "../../adapters/JwtAdapter/Jwt-adapter";
import { BCryptAdapter } from "../../adapters/BcryptAdapter/Bcrypt-adapter";

export class LoginUserController {
	async login(req: Request, res: Response): Promise<Response> {
		const { email, password } = req.body;

		const userRepository = new UserRepository();
		const jwtAdapter = new JwtAdapter();
		const bcryptAdapter = new BCryptAdapter();
		const loginUserCase = new LoginUserCase(
			userRepository,
			bcryptAdapter,
			jwtAdapter,
		);

		const result = await loginUserCase.login({
			email,
			password,
		});

		return res.status(result.statusCode).json({
			name: result.name,
			token: result.token,
		});
	}
}
