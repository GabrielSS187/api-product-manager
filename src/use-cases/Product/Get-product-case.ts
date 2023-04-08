import { ProductRepositoryContract } from "../../repositories/Product-repository-contract";
import { TCreateUserRequest, createProductSchema } from "./schema";
import { ProductError } from "../../errors/Product-error";

export class GetProductCase {
  constructor(
    private readonly productRepository: ProductRepositoryContract 
  ){};

  async getProduct () {
    
  };
};