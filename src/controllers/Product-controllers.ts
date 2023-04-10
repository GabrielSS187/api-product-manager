import { Request, Response } from "express";
import { CreateProductCase } from "../use-cases/Product/Create-product-case";
import { EditProductCase } from "../use-cases/Product/Edit-product-case";
import { DeleteProductCase } from "../use-cases/Product/Delete-product-case";
import { GetProductCase } from "../use-cases/Product/Get-product-case";
import { GetAllProductsCase } from "../use-cases/Product/Get-all-products-case";
import { GetAllCategoriesCase } from "../use-cases/Product/Get-all-categories-case";
import { ProductRepository } from "../repositories/bd/BD-product-repository";

export class ProductControllers {
	async create(req: Request, res: Response): Promise<Response> {
		const { name, qty, price, categories } = req.body;
		const role = req.userRole;

		const productRepository = new ProductRepository();
		const createProductCase = new CreateProductCase(productRepository);

		const result = await createProductCase.create({
			role,
			body: {
				categories,
				name,
				qty,
				price,
			},
		});

		return res.status(result.statusCode).json(result.success);
	}

	async edit(req: Request, res: Response): Promise<Response> {
		const { name, qty, price, categories } = req.body;
		//* ID do produto á ser editado.
		const { id } = req.params;
		const role = req.userRole;

		const productRepository = new ProductRepository();
		const editProductCase = new EditProductCase(productRepository);

		const result = await editProductCase.edit({
			role,
			id,
			body: {
				categories,
				name,
				qty,
				price,
			},
		});

		return res.status(result.statusCode).json(result.success);
	}

	async delete(req: Request, res: Response): Promise<Response> {
		const { id } = req.params;
		const role = req.userRole;

		const productRepository = new ProductRepository();
		const deleteProductCase = new DeleteProductCase(productRepository);

		const result = await deleteProductCase.delete({
			role,
			id,
		});

		return res.status(result.statusCode).json(result.success);
	}

	async getProduct(req: Request, res: Response): Promise<Response> {
		const { id } = req.params;

		const productRepository = new ProductRepository();
		const getProductCase = new GetProductCase(productRepository);

		const result = await getProductCase.getProduct({ id });

		return res.status(result.statusCode).json(result.success);
	}

	async getAllProducts(req: Request, res: Response): Promise<Response> {
		const productRepository = new ProductRepository();
		const getAllProductsCase = new GetAllProductsCase(productRepository);

		const result = await getAllProductsCase.getAllProducts();

		return res.status(result.statusCode).json(result.success);
	}

	async getAllCategories(req: Request, res: Response): Promise<Response> {
		const productRepository = new ProductRepository();
		const getAllCategoriesCase = new GetAllCategoriesCase(productRepository);

		const result = await getAllCategoriesCase.getAllCategories();

		return res.status(result.statusCode).json(result.success);
	}
}
