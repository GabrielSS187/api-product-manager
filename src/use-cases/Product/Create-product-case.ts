import { ZodError } from "zod";
import { ProductRepositoryContract } from "../../repositories/Product-repository-contract";
import { TCreateUserRequest, createProductSchema } from "./schema";
import { ProductError } from "../../errors/Product-error";

type TRequest = {
  role: "admin" | "normal";
  body: TCreateUserRequest;
};

export class CreateProductCase {
  constructor(
    private readonly productRepository: ProductRepositoryContract 
  ){};
  #allowedCategories = ["pc", "console", "monitor", "game"];

  async create ( request: TRequest ) {
    try {
			createProductSchema.parse(request);
		} catch (error) {
			if (error instanceof ZodError) {
				throw new ProductError(error.issues[0].message, 406);
			}
		};

    const { body, role } = request;

    if ( role !== "admin" ) {
      new ProductError("Not authorized. You are not an administrator.", 401);
    };

    const filteredCategoriesBody = this.#allowedCategories
    .filter((category) => {
      return body.categories.includes(category);
    });
    if ( filteredCategoriesBody.length === 0 ) {
      throw new ProductError(`The only allowed categories are: ${
        this.#allowedCategories.map((category) => category)
      }`, 406);
    };

    try {
      await this.productRepository.create(body);
    } catch (error) {
      throw new ProductError(`${error}`, 500);
    };
  };
};