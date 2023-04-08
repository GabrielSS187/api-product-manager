import { ZodError } from "zod";
import { UserRepositoryContract } from "../../repositories/User-repository-contract";
import { BCryptContract } from "../../adapters/Bcrypt-contract";
import { JwtContract } from "../../adapters/Jwt-contract";
import { TLoginUserRequest, loginUserSchema } from "./schemas";
import { UserError } from "../../errors/User-error";

export class LoginUserCase {
	constructor(
		private readonly userRepository: UserRepositoryContract,
		private readonly bcrypt: BCryptContract,
		private readonly jwt: JwtContract,
	) {}

	async login(request: TLoginUserRequest) {
		try {
			loginUserSchema.parse(request);
		} catch (error) {
			if (error instanceof ZodError) {
				throw new UserError(error.issues[0].message, 406);
			}
		}

		const { email, password } = request;

		const foundUser = await this.userRepository.findUserByEmail(email);
		if (!foundUser) {
			throw new UserError("User not found.", 404);
		}

		const verifyPassword = await this.bcrypt.compareHash({
			password,
			passwordDatabase: foundUser.password,
		});
		if (!verifyPassword) {
			throw new UserError("Incorrect password.", 406);
		}

		const generateTokenJwt = this.jwt.generateToken({ role: foundUser.role });

		return {
			statusCode: 200,
			name: foundUser.name,
			token: generateTokenJwt,
		};
	}
}
