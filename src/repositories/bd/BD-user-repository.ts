import { TCreateUserDto, UserDataDto } from "../../dtos/user-dtos";
import { UserRepositoryContract } from "../../repositories/User-repository-contract";

export class UserRepository 
implements UserRepositoryContract {
  async create(data: TCreateUserDto): Promise<void> {
    
  };

  async findUserByEmail(email: string): Promise<UserDataDto | undefined> {
    
  };
};