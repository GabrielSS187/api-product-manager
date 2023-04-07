import { env } from "process";
import { config } from "dotenv";
import * as jwt from "jsonwebtoken";
import { 
  JwtContract,
  TJwtAuthenticationData,
  TJwtGetTokenData
} from "../Jwt-contract";

config();

export class JwtAdapter implements JwtContract {
  generateToken ( { role }: TJwtAuthenticationData ) {
    const expiresIn = 1647456000; //* 30 dias
    const token = jwt.sign(
      {
        role
      },
        env.JWT_KEY as string,
     {
        expiresIn
     }
    );
    return token;
  };

  getToken ({ token }: TJwtGetTokenData) {
    const payload = jwt.verify(token, env.JWT_KEY as string) as TJwtAuthenticationData;
    const result = {
      role: payload.role
    };
    return result;
  };
};