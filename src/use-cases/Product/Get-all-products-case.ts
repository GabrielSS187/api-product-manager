import { ProductRepositoryContract } from "../../repositories/Product-repository-contract";
import { TCreateUserRequest, createProductSchema } from "./schema";
import { ProductError } from "../../errors/Product-error";

export class GetAllProductsCase {
	constructor(private readonly productRepository: ProductRepositoryContract) {}

	async getAllProducts() {
		try {
			const products = await this.productRepository.getAllProducts();

			return {
				statusCode: 200,
				success: products,
			};
		} catch (error) {
			throw new ProductError(`${error}`, 500);
		}
	}
}
