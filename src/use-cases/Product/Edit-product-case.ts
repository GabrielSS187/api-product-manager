import { ZodError } from "zod";
import { ProductRepositoryContract } from "../../repositories/Product-repository-contract";
import { TEditProductRequest, editProductSchema } from "./schema";
import { ProductError } from "../../errors/Product-error";

type TRequest = {
	role: "admin" | "normal";
	id: string;
	body: TEditProductRequest;
};

export class EditProductCase {
	constructor(private readonly productRepository: ProductRepositoryContract) {}
	#allowedCategories = ["pc", "console", "monitor", "game"];

	async edit(request: TRequest) {
		if (request.role !== "admin") {
			throw new ProductError(
				"Not authorized. You are not an administrator.",
				401,
			);
		}

		const { id, body } = request;

		const searchProduct = await this.productRepository.getProduct({ id });
		if (!searchProduct) {
			throw new ProductError("Product not found.", 404);
		}

		try {
			editProductSchema.parse(request.body);
		} catch (error) {
			if (error instanceof ZodError) {
				throw new ProductError(error.issues[0].message, 406);
			}
		}

		if (body.categories?.length) {
			if (body.categories.length > 0 && searchProduct.categories.length === 2) {
				throw new ProductError(
					"This product already has two categories than the maximum number.",
					406,
				);
			}

			const filteredCategoriesBody = this.#allowedCategories.filter(
				(category) => {
					return body.categories?.includes(category);
				},
			);
			if (filteredCategoriesBody.length === 0) {
				throw new ProductError(
					`The only allowed categories are: ${this.#allowedCategories.map(
						(category) => category,
					)}.`,
					406,
				);
			}
		}

		const formattedArrayCategories = searchProduct.categories.map(
			(category) => category.name,
		);

		const infoProduct = {
			categories: body.categories || formattedArrayCategories,
			name: body.name || searchProduct.name,
			qty: body.qty || searchProduct.qty,
			price: body.price || searchProduct.price,
		};

		try {
			await this.productRepository.editProduct({
				id,
				data: infoProduct,
			});
		} catch (error) {
			throw new ProductError(`${error}`, 500);
		}
	}
}
