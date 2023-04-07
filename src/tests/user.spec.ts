import { describe, test, expect, vi } from "vitest";

import { userList } from "./repositories/local-data";
import { CreateUserCase } from "../use-cases/User/Create-user-case";
import { UserRepositoryInMemory } from "./repositories/User-repository-in-memory";
import { UserErrors } from "../errors/UserErrors";

const sutFactory = () => {
	const userRepositoryInMemory = new UserRepositoryInMemory();
	const mockBCrypt = {
		hashEncrypt: vi.fn().mockReturnValue("hashed_password"),
		compareHash: vi.fn(),
	};

	const sut = new CreateUserCase(userRepositoryInMemory, mockBCrypt);

	return { sut, mockBCrypt };
};

describe("Create-user", () => {
	test("It should create user.", async () => {
		const { sut, mockBCrypt } = sutFactory();

		const newUser = {
			name: "Alan José",
			email: "ala_jose@gmail.com",
			password: "12345678",
		};

		const result = await sut.create(newUser);
		const foundUser = userList.find((user) => user.email === newUser.email);

		expect(result).toEqual({ statusCode: 201, success: newUser });
		expect(mockBCrypt.hashEncrypt).toBeCalledTimes(1);
		expect(userList).toHaveLength(3);
		expect(foundUser).toBeDefined();
		expect(foundUser).toHaveProperty("_id");
		expect(foundUser).toHaveProperty("role");
		expect(foundUser?.password).toBe("hashed_password");
		expect(foundUser?.role).toBeDefined();
		expect(foundUser?.role).toBe("normal");
	});

	test("the user must be with the role (admin) if the email is: gabriel_admin@gmail.com.", async () => {
		const { sut, mockBCrypt } = sutFactory();

		const newUser = {
			name: "Gabriel Silva",
			email: "gabriel_admin@gmail.com",
			password: "12345678",
		};

		const result = await sut.create(newUser);
		const foundUser = userList.find((user) => user.email === newUser.email);

		expect(result).toEqual({ statusCode: 201, success: newUser });
		expect(mockBCrypt.hashEncrypt).toBeCalledTimes(1);
		expect(userList).toHaveLength(4);
		expect(foundUser).toBeDefined();
		expect(foundUser).toHaveProperty("_id");
		expect(foundUser).toHaveProperty("role");
		expect(foundUser?.password).toBe("hashed_password");
		expect(foundUser?.role).toBeDefined();
		expect(foundUser?.role).toBe("admin");
	});

	test("You should not create the user if the email already exists.", async () => {
		const { sut, mockBCrypt } = sutFactory();

		const newUser = {
			name: "Maria Soares",
			email: "gabriel_admin@gmail.com",
			password: "1111111",
		};

		try {
			await sut.create(newUser);
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).toBeInstanceOf(UserErrors);
			expect(error.statusCode).toBe(409);
			expect(error.message).toBe("There is already a registered user with this email.");
		}

		expect(mockBCrypt.hashEncrypt).toBeCalledTimes(0);
		expect(userList).toHaveLength(4);
	});

	test("Must not create user if a property is empty.", async () => {
		const { sut, mockBCrypt } = sutFactory();

		const newUser = {
      name: "",
			email: "gabriel_silva@gmail.com",
			password: "1111111",
		};

		try {
			await sut.create(newUser);
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).toBeInstanceOf(UserErrors);
			expect(error.statusCode).toBe(406);
			expect(error.message).toBe("String must contain at least 5 character(s)");
		}

		expect(mockBCrypt.hashEncrypt).toBeCalledTimes(0);
		expect(userList).toHaveLength(4);
	});

  test("Should throw an error if the mail is not in a correct format.", async () => {
    const { sut, mockBCrypt } = sutFactory();
  
    const newUser = {
      name: "Maria Soares",
      email: "maria_soaresil.com",
      password: "1111111",
    };
  
    try {
      await sut.create(newUser);
      // rome-ignore lint/suspicious/noExplicitAny: <explanation>
    } catch (error: any) {
      expect(error).toBeInstanceOf(UserErrors);
      expect(error.statusCode).toBe(406);
      expect(error.message).toBe("Email invalid.");
    }
  
    expect(mockBCrypt.hashEncrypt).toBeCalledTimes(0);
    expect(userList).toHaveLength(4);
  });

  test("Do not create user if password contains blanks.", async () => {
		const { sut, mockBCrypt } = sutFactory();

		const newUser = {
      name: "Carlos",
			email: "carlos@gmail.com",
			password: "111 1115",
		};

		try {
			await sut.create(newUser);
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).toBeInstanceOf(UserErrors);
			expect(error.statusCode).toBe(406);
			expect(error.message).toBe("Password cannot contain spaces.");
		}

		expect(mockBCrypt.hashEncrypt).toBeCalledTimes(0);
		expect(userList).toHaveLength(4);
	});
});

