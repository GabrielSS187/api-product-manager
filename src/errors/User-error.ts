import { CustomError } from "./Custom-error";

export class UserError extends CustomError {
  constructor(
    public error: string,
    public statusCode: number
  ){
    super(error, statusCode);
  };
};