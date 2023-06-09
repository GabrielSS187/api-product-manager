import { ProductRepositoryContract } from "../../repositories/Product-repository-contract";
import { TCreateUserRequest, createProductSchema } from "./schema";
import { ProductError } from "../../errors/Product-error";

export class GetProductCase {
	constructor(private readonly productRepository: ProductRepositoryContract) {}

	async getProduct(request: { id: string }) {
		try {
			const product = await this.productRepository.getProduct({
				id: request.id,
			});

			if (!product) {
				throw new ProductError("Product not found.", 404);
			}

			return {
				statusCode: 200,
				success: product,
			};
		} catch (error) {
			if (error instanceof ProductError) {
				throw new ProductError(error.message, error.statusCode);
			}

			throw new ProductError(`${error}`, 500);
		}
	}
}
