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
			createProductSchema.parse(request.body);
		} catch (error) {
			if (error instanceof ZodError) {
				throw new ProductError(error.issues[0].message, 406);
			}
		};

    const { body, role } = request;

    if ( role !== "admin" ) {
      throw new ProductError("Not authorized. You are not an administrator.", 401);
    };

    if ( body.categories.length > 2 ) {
      throw new ProductError("You cannot choose more than 2 categories.", 406);
    };

    const filteredCategoriesBody = this.#allowedCategories
    .filter((category) => {
      return body.categories.includes(category);
    });
    if ( filteredCategoriesBody.length === 0 ) {
      throw new ProductError(`The only allowed categories are: ${
        this.#allowedCategories.map((category) => category)
      }.`, 406);
    };

    const searchProduct = await this.productRepository.getProduct({
      name: body.name.trim()
    });
    if ( searchProduct ) {
      throw new ProductError("A product with that name already exists.", 409);
    };

    try {
      await this.productRepository.create(body);
    } catch (error) {
      throw new ProductError(`${error}`, 500);
    };
    
    return {
      statusCode: 201,
      success: request.body,
    };
  };
};