import { ProductRepositoryContract } from "../../repositories/Product-repository-contract";
import { TCreateUserRequest, createProductSchema } from "./schema";
import { ProductError } from "../../errors/Product-error";

type TRequest = {
  role: "admin" | "normal";
  id: string;
  body: TCreateUserRequest;
};

export class CreateProductCase {
  constructor(
    private readonly productRepository: ProductRepositoryContract 
  ){};

  async create ( request: TRequest ) {
    
  };
};