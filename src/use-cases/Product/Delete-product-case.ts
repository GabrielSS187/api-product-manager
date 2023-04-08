import { ProductRepositoryContract } from "../../repositories/Product-repository-contract";
import { TCreateUserRequest, createProductSchema } from "./schema";
import { ProductError } from "../../errors/Product-error";

type TRequest = {
  role: "admin" | "normal",
  id: string;
};

export class DeleteProductCase {
  constructor(
    private readonly productRepository: ProductRepositoryContract 
  ){};

  async delete ( request: TRequest ) {
    
  };
};