import { ZodError } from "zod";
import { UserRepositoryContract } from "../../repositories/User-repository-contract";
import { BCryptContract } from "../../adapters/Bcrypt-contract";
import { JwtContract } from "../../adapters/Jwt-contract";
import { TLoginUserRequest, loginUserSchema } from "./schemas";
import { UserErrors } from "../../errors/UserErrors";

export class LoginUserCase {
  constructor (
    private readonly userRepository: UserRepositoryContract,
    private readonly bcrypt: BCryptContract,
    private readonly jwt: JwtContract
  ){};

  async login (request: TLoginUserRequest) {
    try {
      loginUserSchema.parse(request);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new UserErrors(error.issues[0].message, 406);
      }
    };

    const { email, password } = request;

    const foundUser = await this.userRepository
    .findUserByEmail(email);
    if ( !foundUser ) {
      throw new UserErrors("User not found.", 404);
    };

    const verifyPassword = await this.bcrypt
    .compareHash({ password, passwordDatabase: foundUser.password });
    if ( !verifyPassword ) {
      throw new UserErrors("Incorrect password.", 406);
    };

    const generateTokenJwt = this.jwt
    .generateToken({ role: foundUser.role });

    return {
      statusCode: 200,
      name: foundUser.name,
      token: generateTokenJwt,
    };
  };
};