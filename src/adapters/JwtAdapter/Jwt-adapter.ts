import { env } from "process";
import * as jwt from "jsonwebtoken";
import { 
  JwtContract,
  TJwtAuthenticationData,
  TJwtGetTokenData
} from "../Jwt-contract";

export class JwtAdapter implements JwtContract {
  generateToken ( {  id, role  }: TJwtAuthenticationData ) {
    const expiresIn = 1647456000; //* 30 dias
    const token = jwt.sign(
      {
        id,
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
      id: payload.id,
      role: payload.role
    };
    return result;
  };
};