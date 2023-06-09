import { describe, test, expect, vi } from "vitest";

import { productList, categories } from "./bd-in-memory/local-data";
import { CreateProductCase } from "../use-cases/Product/Create-product-case";
import { EditProductCase } from "../use-cases/Product/Edit-product-case";
import { DeleteProductCase } from "../use-cases/Product/Delete-product-case";
import { GetProductCase } from "../use-cases/Product/Get-product-case";
import { GetAllProductsCase } from "../use-cases/Product/Get-all-products-case";
import { GetAllCategoriesCase } from "../use-cases/Product/Get-all-categories-case";
import { ProductRepositoryInMemory } from "./repositories/Product-repository-in-memory";
import { ProductError } from "../errors/Product-error";

const sutFactory = () => {
	const productRepositoryInMemory = new ProductRepositoryInMemory();

	const sutCreateProduct = new CreateProductCase(productRepositoryInMemory);
	const sutEditProduct = new EditProductCase(productRepositoryInMemory);
	const sutDeleteProduct = new DeleteProductCase(productRepositoryInMemory);
	const sutGetProduct = new GetProductCase(productRepositoryInMemory);
	const sutGetAllProducts = new GetAllProductsCase(productRepositoryInMemory);
	const sutGetAllCategories = new GetAllCategoriesCase(
		productRepositoryInMemory,
	);

	return {
		sutCreateProduct,
		sutEditProduct,
		sutDeleteProduct,
		sutGetProduct,
		sutGetAllProducts,
		sutGetAllCategories,
	};
};


//* 1
describe("Create-product-case", () => {
	const newProduct = {
		name: "PlayStation 5",
		qty: 2000,
		price: 5000.99,
		categories: ["game,", "pc"],
	};

	test("Must create a product if user is an admin.", async () => {
		const { sutCreateProduct } = sutFactory();

		const result = await sutCreateProduct.create({
			role: "admin",
			body: newProduct,
		});

		const productAfterCreate = productList.find((product) => {
			return product.name === newProduct.name;
		});

		expect(result).toEqual({
			statusCode: 201,
			success: newProduct,
		});
		expect(productList).toHaveLength(4);
		expect(productAfterCreate).toBeDefined();
		expect(productAfterCreate).toHaveProperty("_id");
		expect(productAfterCreate).toHaveProperty("createdAt");
		expect(productAfterCreate?.categories).toHaveLength(2);
		expect(productAfterCreate?.categories[0]).toHaveProperty("_id");
		expect(productAfterCreate?.categories[0]).toHaveProperty("parent");
		expect(productAfterCreate?.categories[1]).toHaveProperty("_id");
		expect(productAfterCreate?.categories[1]).toHaveProperty("parent");
	});

	test("Should throw an error if the role is normal.", async () => {
		const { sutCreateProduct } = sutFactory();

		try {
			const result = await sutCreateProduct.create({
				role: "normal",
				body: newProduct,
			});
			expect(result.statusCode).not.toBe(201);
			expect(result.success).toBeUndefined();
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).toBeInstanceOf(ProductError);
			expect(error.statusCode).toBe(401);
			expect(error.message).toBe(
				"Not authorized. You are not an administrator.",
			);
		}
	});

	test("Should throw an error if the product name already exists in the list.", async () => {
		const { sutCreateProduct } = sutFactory();

		try {
			const result = await sutCreateProduct.create({
				role: "admin",
				body: { ...newProduct },
			});
			expect(result.statusCode).not.toBe(201);
			expect(result.success).toBeUndefined();
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).toBeInstanceOf(ProductError);
			expect(error.statusCode).toBe(409);
			expect(error.message).toBe("A product with that name already exists.");
		}
	});

	test("It should throw an error if the user chooses more than 2 categories.", async () => {
		const { sutCreateProduct } = sutFactory();

		newProduct.name = "Jatot";
		newProduct.categories = ["pc", "console", "monitor", "game"];

		try {
			const result = await sutCreateProduct.create({
				role: "admin",
				body: newProduct,
			});
			expect(result.statusCode).not.toBe(201);
			expect(result.success).toBeUndefined();
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).toBeInstanceOf(ProductError);
			expect(error.statusCode).toBe(406);
			expect(error.message).toBe("You cannot choose more than 2 categories.");
		}
	});

	test("It should throw an error if the chosen category is different from those allowed.", async () => {
		const { sutCreateProduct } = sutFactory();

		newProduct.name = "GTA 5";
		newProduct.categories = ["carro"];

		try {
			const result = await sutCreateProduct.create({
				role: "admin",
				body: newProduct,
			});
			expect(result.statusCode).not.toBe(201);
			expect(result.success).toBeUndefined();
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).toBeInstanceOf(ProductError);
			expect(error.statusCode).toBe(406);
			expect(error.message).toBe(
				"The only allowed categories are: pc,console,monitor,game.",
			);
		}
	});

	test("Should throw an error if no category is chosen.", async () => {
		const { sutCreateProduct } = sutFactory();

		newProduct.name = "Avião";
		newProduct.categories = [];

		try {
			const result = await sutCreateProduct.create({
				role: "admin",
				body: newProduct,
			});
			expect(result.statusCode).not.toBe(201);
			expect(result.success).toBeUndefined();
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).toBeInstanceOf(ProductError);
			expect(error.statusCode).toBe(406);
			expect(error.message).toBe("Must have at least one category.");
		}
	});

	test("Should throw an error if the quantity is less than 1.", async () => {
		const { sutCreateProduct } = sutFactory();

		newProduct.name = "Nintendo";
		newProduct.categories = ["game"];
		newProduct.qty = 0;

		try {
			const result = await sutCreateProduct.create({
				role: "admin",
				body: newProduct,
			});
			expect(result.statusCode).not.toBe(201);
			expect(result.success).toBeUndefined();
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).toBeInstanceOf(ProductError);
			expect(error.statusCode).toBe(406);
			expect(error.message.length).toBeGreaterThan(0);
		}
	});

	test("Should throw an error if the price is less than 5.", async () => {
		const { sutCreateProduct } = sutFactory();

		newProduct.name = "Nintendo";
		newProduct.categories = ["game"];
		newProduct.qty = 10;
		newProduct.price = 2.99;

		try {
			const result = await sutCreateProduct.create({
				role: "admin",
				body: newProduct,
			});
			expect(result.statusCode).not.toBe(201);
			expect(result.success).toBeUndefined();
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).toBeInstanceOf(ProductError);
			expect(error.statusCode).toBe(406);
			expect(error.message.length).toBeGreaterThan(0);
		}
	});
});

//* 2
describe("Edit-product-case", () => {
	test("Must edit a product without errors", async () => {
		const { sutEditProduct } = sutFactory();

		const newData = {
			name: "Xbox one X",
		};

		const idProduct = "188288293903";

		const result = await sutEditProduct.edit({
			role: "admin",
			id: idProduct,
			body: newData,
		});

		expect(result).toEqual({
			statusCode: 200,
			success: "Product updated successfully.",
		});
	});

	test("Should throw an error if the user is not an administrator.", async () => {
		const { sutEditProduct } = sutFactory();

		const product = {
			name: "Xbox",
		};

		try {
			const result = await sutEditProduct.edit({
				id: "188288293903",
				role: "normal",
				body: product,
			});

			expect(result).toBeUndefined();
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).toBeInstanceOf(ProductError);
			expect(error.statusCode).toBe(401);
			expect(error?.message).toBe(
				"Not authorized. You are not an administrator.",
			);
		}
	});

	test("Should throw an error if the product is not found by _id.", async () => {
		const { sutEditProduct } = sutFactory();

		const product = {
			name: "Deus da Guerra 2",
		};

		try {
			const result = await sutEditProduct.edit({
				id: "não existe",
				role: "admin",
				body: product,
			});

			expect(result).toBeUndefined();
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).toBeInstanceOf(ProductError);
			expect(error.statusCode).toBe(404);
			expect(error?.message).toBe("Product not found.");
		}
	});

	test("Should throw an error if the chosen field is blank.", async () => {
		const { sutEditProduct } = sutFactory();

		const product = {
			name: "",
		};

		try {
			const result = await sutEditProduct.edit({
				id: "188288293903",
				role: "admin",
				body: product,
			});

			expect(result).toBeUndefined();
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).toBeInstanceOf(ProductError);
			expect(error.statusCode).toBe(406);
			expect(error?.message.length).toBeGreaterThan(0);
		}
	});

	test("Should throw an error if the product name already exists in the list.", async () => {
		const { sutEditProduct } = sutFactory();

		try {
			const result = await sutEditProduct.edit({
				id: "55757957544444",
				role: "admin",
				body: { name: "GTA 5" },
			});
			expect(result.statusCode).not.toBe(201);
			expect(result.success).toBeUndefined();
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).toBeInstanceOf(ProductError);
			expect(error.statusCode).toBe(409);
			expect(error.message).toBe(
				"A product with that name already exists in the list.",
			);
		}
	});

	test("It should throw an error if the category already exists.", async () => {
		const { sutEditProduct } = sutFactory();

		const product = {
			name: "Xbox one Series S",
			categories: ["game"],
		};

		try {
			const result = await sutEditProduct.edit({
				id: "68838882997777",
				role: "admin",
				body: product,
			});

			expect(result).toBeUndefined();
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).toBeInstanceOf(ProductError);
			expect(error.statusCode).toBe(409);
			expect(error?.message).toBe(
				"This category has already been added to this product.",
			);
		}
	});

	test("Should throw an error with the maximum number of categories exceeded.", async () => {
		const { sutEditProduct } = sutFactory();

		const product = {
			name: "Xbox one",
			categories: ["console", "pc", "monitor"],
		};

		try {
			const result = await sutEditProduct.edit({
				id: "68838882997777",
				role: "admin",
				body: product,
			});

			expect(result).toBeUndefined();
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).toBeInstanceOf(ProductError);
			expect(error.statusCode).toBe(406);
			expect(error?.message).toBe(
				"This product already has the maximum category number. Are you trying to add some more.",
			);
		}
	});

	test("It should throw an error if the chosen category does not exist in the allowed categories.", async () => {
		const { sutEditProduct } = sutFactory();

		const product = {
			name: "Xbox one 58",
			categories: ["carro"],
		};

		try {
			const result = await sutEditProduct.edit({
				id: "55757957544444",
				role: "admin",
				body: product,
			});

			expect(result).toBeUndefined();
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).toBeInstanceOf(ProductError);
			expect(error.statusCode).toBe(406);
			expect(error?.message).toBe(
				"The only allowed categories are: pc,console,monitor,game.",
			);
		}
	});
});

//* 3
describe("Delete-product-case", () => {
	test("Must delete a product if the user is an administrator.", async () => {
		const { sutDeleteProduct } = sutFactory();

		const result = await sutDeleteProduct.delete({
			role: "admin",
			id: "55757957544444",
		});

		expect(result).toEqual({
			statusCode: 200,
			success: "Product deleted.",
		});
		expect(productList.length).toBe(2);
	});

	test("Should throw an error if the user is not admin.", async () => {
		const { sutDeleteProduct } = sutFactory();

		try {
			const result = await sutDeleteProduct.delete({
				role: "normal",
				id: "55757957544444",
			});

			expect(result).toBeUndefined();
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).toBeInstanceOf(ProductError);
			expect(error.statusCode).toBe(401);
			expect(error.message).toBe(
				"Not authorized. You are not an administrator.",
			);
		}

		expect(productList.length).toBe(2);
	});

	test("Should throw an error if the product does not exist.", async () => {
		const { sutDeleteProduct } = sutFactory();

		try {
			const result = await sutDeleteProduct.delete({
				role: "admin",
				id: "55757",
			});

			expect(result).toBeUndefined();
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).toBeInstanceOf(ProductError);
			expect(error.statusCode).toBe(404);
			expect(error.message).toBe("Product not found");
		}

		expect(productList.length).toBe(2);
	});
});

//* 4
describe("Get-product-case", () => {
	test("It should return a product without error.", async () => {
		const { sutGetProduct } = sutFactory();

		const result = await sutGetProduct.getProduct({ id: "188288293903" });

		const product = productList.find((item) => item._id === "188288293903");

		expect(result).toEqual({
			statusCode: 200,
			success: product,
		});
	});

	test("Should throw an error if the product does not exist.", async () => {
		const { sutGetProduct } = sutFactory();

		try {
			const result = await sutGetProduct.getProduct({
				id: "1882882",
			});

			expect(result).toBeUndefined();
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).toBeInstanceOf(ProductError);
			expect(error.statusCode).toBe(404);
			expect(error.message).toBe("Product not found.");
		}
	});
});

//* 5
describe("Get-all-products-case", () => {
	test("Must return all products without error.", async () => {
		const { sutGetAllProducts } = sutFactory();

		const result = await sutGetAllProducts.getAllProducts();

		expect(result).toEqual({
			statusCode: 200,
			success: productList,
		});
		expect(result.success.length).toBeGreaterThan(0);
	});
});

//* 6
describe("Get-all-categories-case", () => {
	test("It should return all categories without error.", async () => {
		const { sutGetAllCategories } = sutFactory();

		const result = await sutGetAllCategories.getAllCategories();

		expect(result).toEqual({
			statusCode: 200,
			success: categories,
		});
		expect(result.success.length).toBeGreaterThan(0);
	});
});
