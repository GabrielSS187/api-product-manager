import { env } from "process";
import * as bcrypt from "bcryptjs";

import { 
  BCryptContract,
  TBcryptComparePassword,
  TBcryptPassword 
} from "../Bcrypt-contract";

export class BCryptAdapter implements BCryptContract {
  async hashEncrypt ( { password }: TBcryptPassword ) {
    const rounds = Number(env.BCRYPT_COST);
    const salt = await bcrypt.genSalt(rounds);
    const result = await bcrypt.hash(password, salt);
    return result;
  };

  async compareHash ( { password,  passwordDatabase }: 
    TBcryptComparePassword ) {
    const result = await bcrypt.compare(password, passwordDatabase);
    return result;
  };
}; 