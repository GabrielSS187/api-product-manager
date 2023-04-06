import { TCreateUserDto, UserDataDto } from "../dtos/user-dtos";

export abstract class UserRepositoryContract {
  abstract create ( params: TCreateUserDto ): Promise<void>;
  abstract findUserByEmail ( email: string ): Promise<UserDataDto | undefined>;
};