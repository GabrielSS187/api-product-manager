import { TCreateUserDto, TUserDataDto } from "../dtos/user-dtos";

//* Usados nos arquivos. bd/BD-user-repository
//* e tests/repositories/User-repository-in-memory

export abstract class UserRepositoryContract {
  abstract create ( params: TCreateUserDto ): Promise<void>;
  abstract findUserByEmail ( email: string ): Promise<TUserDataDto | null>;
};