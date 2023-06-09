import { ZodError } from "zod";
import { UserRepositoryContract } from "../../repositories/User-repository-contract";
import { BCryptContract } from "../../adapters/Bcrypt-contract";
import { TCreateUserRequest, createUserSchema } from "./schemas";
import { UserError } from "../../errors/User-error";

export class CreateUserCase {
	constructor(
		private readonly userRepository: UserRepositoryContract,
		private readonly bcrypt: BCryptContract,
	) {}
	#emailAllowedToBeAdmin: string[] = [
		"gabriel_admin@gmail.com",
		"diogojpina_admin@gmail.com",
	];

	async create(request: TCreateUserRequest) {
		try {
			createUserSchema.parse(request);
		} catch (error) {
			if (error instanceof ZodError) {
				throw new UserError(error.issues[0].message, 406);
			}
		}

		const { name, email, password } = request;
		let role: "admin" | "normal" = "normal";

		const user = await this.userRepository.findUserByEmail(email);
		if (user) {
			throw new UserError(
				"There is already a registered user with this email.",
				409,
			);
		}

		const encryptPassword = await this.bcrypt.hashEncrypt({ password });

		const adminUserEmailAccepted = this.#emailAllowedToBeAdmin.find(
			(emailInList) => emailInList === email,
		);
		if (adminUserEmailAccepted) role = "admin";

		try {
			await this.userRepository.create({
				name,
				email,
				password: encryptPassword,
				role,
			});
		} catch (error) {
			throw new UserError(`${error}`, 500);
		}

		return {
			statusCode: 201,
			success: request,
		};
	}
}
