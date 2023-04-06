import { UserRepositoryContract } from "../../repositories/User-repository-contract";
import { JwtContract } from "../../adapters/Jwt-contract";

export class CreateUserCase {
  constructor (
    private readonly userRepository: UserRepositoryContract,
    private readonly jwt: JwtContract
  ){};

  async create () {};
};