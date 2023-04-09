import { describe, test, expect, vi } from "vitest";

import { userList, productList, categories } from "./bd-in-memory/local-data";
import { CreateProductCase } from "../use-cases/Product/Create-product-case";
import { ProductRepositoryInMemory } from "./repositories/Product-repository-in-memory";
import { ProductError } from "../errors/Product-error";

const sutFactory = () => {
	const productRepositoryInMemory = new ProductRepositoryInMemory();

	const sutCreateProduct = new CreateProductCase(productRepositoryInMemory);

	return {
		sutCreateProduct,
	};
};

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
		expect(productList).toHaveLength(3);
		expect(productAfterCreate).toBeDefined();
		expect(productAfterCreate).toHaveProperty("_id");
		expect(productAfterCreate).toHaveProperty("created_at");
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
