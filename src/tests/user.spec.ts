import { describe, test, expect, vi } from "vitest";

import { userList } from "./bd-in-memory/local-data";
import { CreateUserCase } from "../use-cases/User/Create-user-case";
import { LoginUserCase } from "../use-cases/User/Login-user-case";
import { UserRepositoryInMemory } from "./repositories/User-repository-in-memory";
import { JwtAdapter } from "../adapters/JwtAdapter/Jwt-adapter";
import { BCryptAdapter } from "../adapters/BcryptAdapter/Bcrypt-adapter";
import { UserError } from "../errors/User-error";

const sutFactory = () => {
	const userRepositoryInMemory = new UserRepositoryInMemory();
	const jwt = new JwtAdapter();
	const bcrypt = new BCryptAdapter();

	const sutCreateUser = new CreateUserCase(userRepositoryInMemory, bcrypt);
	const sutLoginUser = new LoginUserCase(userRepositoryInMemory, bcrypt, jwt);

	return {
		sutCreateUser,
		sutLoginUser,
		bcrypt,
		jwt,
	};
};

//* 1
describe("Create-user-case", () => {
	test("It should create user.", async () => {
		const { sutCreateUser, bcrypt } = sutFactory();
		const spyHashEncrypt = vi.spyOn(bcrypt, "hashEncrypt");

		const newUser = {
			name: "Alan José",
			email: "ala_jose@gmail.com",
			password: "12345678",
		};

		const result = await sutCreateUser.create(newUser);
		const foundUser = userList.find((user) => user.email === newUser.email);

		expect(result).toEqual({ statusCode: 201, success: newUser });
		expect(spyHashEncrypt).toHaveBeenCalledOnce();
		expect(userList).toHaveLength(3);
		expect(foundUser).toBeDefined();
		expect(foundUser).toHaveProperty("_id");
		expect(foundUser).toHaveProperty("role");
		expect(foundUser?.password).toHaveLength(60);
		expect(foundUser?.role).toBeDefined();
		expect(foundUser?.role).toBe("normal");

		spyHashEncrypt.mockRestore();
	});

	test("the user must be with the role (admin) if the email is: gabriel_admin@gmail.com.", async () => {
		const { sutCreateUser, bcrypt } = sutFactory();
		const spyHashEncrypt = vi.spyOn(bcrypt, "hashEncrypt");

		const newUser = {
			name: "Gabriel Silva",
			email: "gabriel_admin@gmail.com",
			password: "12345678",
		};

		const result = await sutCreateUser.create(newUser);
		const foundUser = userList.find((user) => user.email === newUser.email);

		expect(result).toEqual({ statusCode: 201, success: newUser });
		expect(spyHashEncrypt).toHaveBeenCalledOnce();
		expect(userList).toHaveLength(4);
		expect(foundUser).toBeDefined();
		expect(foundUser).toHaveProperty("_id");
		expect(foundUser).toHaveProperty("role");
		expect(foundUser?.password).toHaveLength(60);
		expect(foundUser?.role).toBeDefined();
		expect(foundUser?.role).toBe("admin");

		spyHashEncrypt.mockRestore();
	});

	test("You should not create the user if the email already exists.", async () => {
		const { sutCreateUser, bcrypt } = sutFactory();
		const spyHashEncrypt = vi.spyOn(bcrypt, "hashEncrypt");

		const newUser = {
			name: "Maria Soares",
			email: "gabriel_admin@gmail.com",
			password: "1111111",
		};

		try {
			const result = await sutCreateUser.create(newUser);
			expect(result.statusCode).not.toBe(201);
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).toBeInstanceOf(UserError);
			expect(error.statusCode).toBe(409);
			expect(error.message).toBe(
				"There is already a registered user with this email.",
			);
		}

		expect(spyHashEncrypt).not.toHaveBeenCalled();
		expect(userList).toHaveLength(4);

		spyHashEncrypt.mockRestore();
	});

	test("Must not create user if a property is empty.", async () => {
		const { sutCreateUser, bcrypt } = sutFactory();
		const spyHashEncrypt = vi.spyOn(bcrypt, "hashEncrypt");

		const newUser = {
			name: "",
			email: "gabriel_silva@gmail.com",
			password: "1111111",
		};

		try {
			const result = await sutCreateUser.create(newUser);
			expect(result.statusCode).not.toBe(201);
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).toBeInstanceOf(UserError);
			expect(error.statusCode).toBe(406);
			expect(error.message).toBe("String must contain at least 5 character(s)");
		}

		expect(spyHashEncrypt).not.toHaveBeenCalled();
		expect(userList).toHaveLength(4);

		spyHashEncrypt.mockRestore();
	});

	test("Should throw an error if the mail is not in a correct format.", async () => {
		const { sutCreateUser, bcrypt } = sutFactory();
		const spyHashEncrypt = vi.spyOn(bcrypt, "hashEncrypt");

		const newUser = {
			name: "Maria Soares",
			email: "maria_soaresil.com",
			password: "1111111",
		};

		try {
			const result = await sutCreateUser.create(newUser);
			expect(result.statusCode).not.toBe(201);
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).toBeInstanceOf(UserError);
			expect(error.statusCode).toBe(406);
			expect(error.message).toBe("Email invalid.");
		}

		expect(spyHashEncrypt).not.toHaveBeenCalled();
		expect(userList).toHaveLength(4);

		spyHashEncrypt.mockRestore();
	});

	test("Do not create user if password contains blanks.", async () => {
		const { sutCreateUser, bcrypt } = sutFactory();
		const spyHashEncrypt = vi.spyOn(bcrypt, "hashEncrypt");

		const newUser = {
			name: "Carlos",
			email: "carlos@gmail.com",
			password: "111 1115",
		};

		try {
			const result = await sutCreateUser.create(newUser);
			expect(result.statusCode).not.toBe(201);
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).toBeInstanceOf(UserError);
			expect(error.statusCode).toBe(406);
			expect(error.message).toBe("Password cannot contain spaces.");
		}

		expect(spyHashEncrypt).not.toHaveBeenCalled();
		expect(userList).toHaveLength(4);

		spyHashEncrypt.mockRestore();
	});
});

//* 2
describe("Login-user-case", () => {
	const newUser = {
		name: "kaka123",
		email: "kaka@gmail.com",
		password: "12345678",
	};

	test("It should login without errors.", async () => {
		const { sutLoginUser, sutCreateUser, bcrypt, jwt } = sutFactory();
		const spyHashEncrypt = vi.spyOn(bcrypt, "hashEncrypt");
		const spyJwtGenerateToken = vi.spyOn(jwt, "generateToken");

		await sutCreateUser.create(newUser);
		const searchUser = userList.find((user) => {
			return user.email === newUser.email;
		});

		const result = await sutLoginUser.login({
			email: "kaka@gmail.com",
			password: "12345678",
		});

		expect(result).toBeDefined();
		expect(result.statusCode).toBe(200);
		expect(result.name).toBe(searchUser?.name);
		expect(result.token).toBeDefined();
		expect(result).toHaveProperty("token");
		expect(spyHashEncrypt).toHaveBeenCalledOnce();
		expect(spyJwtGenerateToken).toHaveBeenCalled();

		spyHashEncrypt.mockRestore();
		spyJwtGenerateToken.mockRestore();
	});

	test("Should generate an error if email does not exist.", async () => {
		const { sutLoginUser, jwt, bcrypt } = sutFactory();
		const spyHashEncrypt = vi.spyOn(bcrypt, "hashEncrypt");
		const spyJwtGenerateToken = vi.spyOn(jwt, "generateToken");

		const request = {
			email: "k@gmail.com",
			password: "12345678",
		};

		try {
			const result = await sutLoginUser.login(request);
			expect(result.statusCode).not.toBe(200);
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).toBeInstanceOf(UserError);
			expect(error.statusCode).toBe(404);
			expect(error.message).toBe("User not found.");
		}
		expect(spyHashEncrypt).not.toHaveBeenCalled();
		expect(spyJwtGenerateToken).not.toHaveBeenCalled();

		spyHashEncrypt.mockRestore();
		spyJwtGenerateToken.mockRestore();
	});

	test("It should generate an error if the password is incorrect.", async () => {
		const { sutLoginUser, bcrypt } = sutFactory();
		const spyCompareHash = vi.spyOn(bcrypt, "compareHash");

		try {
			const result = await sutLoginUser.login({
				email: "kaka@gmail.com",
				password: "1234567",
			});
			expect(result.statusCode).not.toBe(200);
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).toBeInstanceOf(UserError);
			expect(error.statusCode).toBe(406);
			expect(error.message).toBe("Incorrect password.");
		}

		expect(spyCompareHash).toHaveBeenCalledOnce();

		spyCompareHash.mockRestore();
	});

	test("Must not log in if any properties are empty.", async () => {
		const { sutLoginUser } = sutFactory();

		try {
			const result = await sutLoginUser.login({
				email: "",
				password: "12345678",
			});
			expect(result.statusCode).not.toBe(200);
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).toBeInstanceOf(UserError);
			expect(error.statusCode).toBe(406);
			expect(error.message).toBe("Email invalid.");
		}
	});
});
