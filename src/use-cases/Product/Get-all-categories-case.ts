import { ProductRepositoryContract } from "../../repositories/Product-repository-contract";
import { TCreateUserRequest, createProductSchema } from "./schema";
import { ProductError } from "../../errors/Product-error";

export class GetAllCategoriesCase {
	constructor(private readonly productRepository: ProductRepositoryContract) {}

	async getAllCategories() {
		try {
			const categories = await this.productRepository.getAllCategories();

			return {
				statusCode: 200,
				success: categories,
			};
		} catch (error) {
			throw new ProductError(`${error}`, 500);
		}
	}
}
