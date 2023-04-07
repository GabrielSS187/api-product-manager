import { CustomError } from "./Custom-error";

export class CategoryError extends CustomError {
  constructor(
    public error: string,
    public statusCode: number
  ){
    super(error, statusCode);
  };
};