import { ProductRepositoryContract } from "../../repositories/Product-repository-contract";
import { TCreateUserRequest, createProductSchema } from "./schema";
import { ProductError } from "../../errors/Product-error";

type TRequest = {
	role: "admin" | "normal";
	id: string;
};

export class DeleteProductCase {
	constructor(private readonly productRepository: ProductRepositoryContract) {}

	async delete(request: TRequest) {
		if (request.role !== "admin") {
			throw new ProductError(
				"Not authorized. You are not an administrator.",
				401,
			);
		}

		const foundProduct = await this.productRepository.getProduct({
			id: request.id,
		});
		if (!foundProduct) {
			throw new ProductError("Product not found", 404);
		}

		try {
			await this.productRepository.deleteProduct(request.id);
		} catch (error) {
			throw new ProductError(`${error}`, 500);
		}

		return {
			statusCode: 200,
			success: "Product deleted.",
		};
	}
}
