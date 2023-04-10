import crypto from "node:crypto";
import {
	TCategoryData,
	TCreateProduct,
	TProductData,
} from "../../dtos/product-dto";
import { ProductRepositoryContract } from "../../repositories/Product-repository-contract";
import { productList, categories } from "../bd-in-memory/local-data";
import { ProductError } from "../../errors/Product-error";

type TEditProduct = {
	id: string;
	data: TCreateProduct;
};

type TGetProduct = {
	id: string;
	name: string;
};

export class ProductRepositoryInMemory implements ProductRepositoryContract {
	async create(params: TCreateProduct): Promise<void> {
		const { categories: listCategory, name, qty, price } = params;

		function createCategories(parent: string) {
			const receiverCategories = [];

			for (let i = 0; i < listCategory.length; i++) {
				receiverCategories.push({
					_id: crypto.randomUUID(),
					name: listCategory[i],
					parent,
				});
			}

			return receiverCategories;
		}

		const productId = crypto.randomUUID();
		productList.push({
			_id: productId,
			categories: createCategories(productId),
			name,
			qty,
			price,
			created_at: new Date(),
		});
	}

	async getProduct(params: TGetProduct): Promise<TProductData> {
		if (params.name) {
			const productFound = productList.find((product) => {
				return product.name === params.name;
			});
			// rome-ignore lint/style/noNonNullAssertion: <explanation>
			return productFound!;
		}

		const productFound = productList.find((product) => {
			return product._id === params.id;
		});
		// rome-ignore lint/style/noNonNullAssertion: <explanation>
		return productFound!;
	}

	async getAllProducts(): Promise<TProductData[] | []> {
		return productList;
	}

	async editProduct(params: TEditProduct): Promise<void> {
		const { id, data } = params;
		const { categories: listCategory, name, qty, price } = data;

		const findProduct = productList.find((product) => {
			return product._id === id;
		});

    
    const nonExistentCategories: string[] = [];
		
    for (let i = 0; i < listCategory.length; i++) {
      const item = listCategory[i];
      if (!categories.some((existingItem) => existingItem.name === item)) {
        nonExistentCategories.push(item);
      };

      findProduct?.categories.push({
        _id: crypto.randomUUID(),
        name: nonExistentCategories[i],
        // rome-ignore lint/style/noNonNullAssertion: <explanation>
        parent: findProduct!._id,
      });
    };
    
		// rome-ignore lint/style/noNonNullAssertion: <explanation>
		findProduct!.name = name;
		// rome-ignore lint/style/noNonNullAssertion: <explanation>
		findProduct!.qty = qty;
		// rome-ignore lint/style/noNonNullAssertion: <explanation>
		findProduct!.price = price;
	}

	async deleteProduct(id: string): Promise<void> {
		const indexProduct = productList.findIndex((product) => {
			return product._id === id;
		});

		productList.splice(indexProduct, 1);
	}

	async getAllCategories(): Promise<TCategoryData[] | []> {
		return categories;
	}
}
