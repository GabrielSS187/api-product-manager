import { Types } from "mongoose";

//* Usados no arq.  repositories/User-repository-contract

export type TCreateUserDto = {
  name: string;
  email: string;
  password: string;
  role: "admin" | "normal";
};

export type TUserDataDto = {
  _id: Types.ObjectId | string;
  name: string;
  email: string;
  password: string; 
  role: "admin" | "normal" ;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}