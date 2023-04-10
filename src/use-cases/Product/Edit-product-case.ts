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
		const searchProductByName = await this.productRepository.getProduct({
			name: body.name,
		});
		if (!searchProduct) {
			throw new ProductError("Product not found.", 404);
		}
		if (searchProductByName) {
			throw new ProductError(
				"A product with that name already exists in the list.",
				409,
			);
		}

		try {
			editProductSchema.parse(request.body);
		} catch (error) {
			if (error instanceof ZodError) {
				throw new ProductError(error.issues[0].message, 406);
			}
		}

		if (body.categories?.length) {
			const someCategories =
				searchProduct.categories.length + body.categories.length;

			if (someCategories > 2) {
				throw new ProductError(
					"This product already has the maximum category number. Are you trying to add some more.",
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

			const checkCategoryAlreadyExists = searchProduct.categories.filter(
				(category) => {
					return body.categories?.includes(category.name);
				},
			);

			if (checkCategoryAlreadyExists.length > 0) {
				throw new ProductError(
					"This category has already been added to this product.",
					409,
				);
			}
		}

		const formattedArrayCategories = searchProduct.categories.map(
			(category) => category.name,
		);
		const formattedArrayCategoriesBody = body.categories?.map((category) =>
			category.trim(),
		);

		const infoProduct = {
			categories: formattedArrayCategoriesBody || formattedArrayCategories,
			name: body.name?.trim() || searchProduct.name,
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

		return {
			statusCode: 200,
			success: searchProduct,
		};
	}
}
