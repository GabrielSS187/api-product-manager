export type TJwtAuthenticationData = {
  role: "admin" | "normal";
};

export type TJwtGetTokenData = {
  token: string;
};

export abstract class JwtContract { 
  abstract generateToken ( params: TJwtAuthenticationData ): string;
  abstract getToken ( params: TJwtGetTokenData ): TJwtAuthenticationData; 
};