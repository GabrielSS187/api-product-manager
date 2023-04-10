import {
	TCategoryData,
	TCreateProduct,
	TProductData,
} from "../../dtos/product-dto";
import { ProductRepositoryContract } from "../../repositories/Product-repository-contract";

type TEditProduct = {
	id: string;
	data: TCreateProduct;
};

type TGetProduct = {
	id: string;
	name: string;
};

export class ProductRepository implements ProductRepositoryContract {
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

	}

	async getProduct(params: TGetProduct): Promise<TProductData | undefined> {
		if (params.name) {
			
		}

	}

	async getAllProducts(): Promise<TProductData[] | []> {
	
	}

	async editProduct(params: TEditProduct): Promise<void> {
		const { id, data } = params;
		const { categories: listCategory, name, qty, price } = data;
    
    // const nonExistentCategories: string[] = [];
		
    // for (let i = 0; i < listCategory.length; i++) {
    //   const item = listCategory[i];
    //   if (!categories.some((existingItem) => existingItem.name === item)) {
    //     nonExistentCategories.push(item);
    //   };

    //   findProduct?.categories.push({
    //     _id: crypto.randomUUID(),
    //     name: nonExistentCategories[i],
    //     // rome-ignore lint/style/noNonNullAssertion: <explanation>
    //     parent: findProduct!._id,
    //   });
    // };
    
	}

	async deleteProduct(id: string): Promise<void> {
		
	}

	async getAllCategories(): Promise<TCategoryData[] | []> {
		
	}
}
