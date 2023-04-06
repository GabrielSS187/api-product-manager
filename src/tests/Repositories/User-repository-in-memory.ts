import crypto from "node:crypto";

import { TCreateUserDto, UserDataDto } from "../../dtos/user-dtos";
import { UserRepositoryContract } from "../../repositories/User-repository-contract";

import { userList } from "./local-data";

export class UserRepositoryInMemory 
implements UserRepositoryContract {
  async create(data: TCreateUserDto): Promise<void> {
    userList.push({
      _id: crypto.randomUUID(),
      ...data
    });
  };

  async findUserByEmail(email: string): Promise<UserDataDto | undefined> {
    const foundUser = userList.find(( user ) => {
      return user.email === email;
    });
    
    return foundUser;
  };
};