import UserSchema from "../../models/user-models";
import { TCreateUserDto, TUserDataDto } from "../../dtos/user-dtos";
import { UserRepositoryContract } from "../../repositories/User-repository-contract";

export class UserRepository implements UserRepositoryContract {
	async create(data: TCreateUserDto): Promise<void> {
		await UserSchema.create(data);
	}

	async findUserByEmail(email: string): Promise<TUserDataDto | null> {
		const user = await UserSchema.findOne({ email })
			.lean<TUserDataDto>()
			.exec();
		return user;
	}
}
