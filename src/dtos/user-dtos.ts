export type TCreateUserDto = {
  name: string;
  email: string;
  password: string;
  role: "admin" | "normal";
};

export type UserDataDto = {
  _id: string;
  name: string;
  email: string;
  password: string; 
  role: "admin" | "normal" 
}