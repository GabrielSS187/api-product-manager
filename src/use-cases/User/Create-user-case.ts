import { ZodError } from "zod";
import { UserRepositoryContract } from "../../repositories/User-repository-contract";
import { BCryptContract } from "../../adapters/Bcrypt-contract";
import { TCreateUserRequest, createUserSchema } from "./schemas";
import { UserErrors } from "../../errors/UserErrors";

export class CreateUserCase {
  constructor(
    private readonly userRepository: UserRepositoryContract,
    private readonly bcrypt: BCryptContract
  ) {};
  #emailAllowedToBeAdmin: string[] = [
    "gabriel_admin@gmail.com",
    "diogojpina_admin@gmail.com"
  ];

  async create(request: TCreateUserRequest) {
    try {
      createUserSchema.parse(request);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new UserErrors(error.issues[0].message, 406);
      }
    };

    const { name, email, password } = request;
    let role: "admin" | "normal" = "normal";

    const user = await this.userRepository.findUserByEmail(email);
    if ( user ) {
      throw new UserErrors(
        "There is already a registered user with this email.",
        409
      );
    };

    const encryptPassword = await this.bcrypt.hashEncrypt({ password });

    const adminUserEmailAccepted = this.#emailAllowedToBeAdmin
    .find((emailInList) => emailInList === email);
    if ( adminUserEmailAccepted ) role = "admin";

    await this.userRepository.create({
      name,
      email,
      password: encryptPassword,
      role
    });

    return {
      statusCode: 201,
      success: request
    };
  };
};