import crypto from "node:crypto";
import { TCategoryData, TCreateProduct, TProductData } from "../../dtos/product-dto";
import { ProductRepositoryContract } from "../../repositories/Product-repository-contract";
import { productList, categories } from "../bd-in-memory/local-data";

type TEditProduct = {
  id: string;
  data: TCreateProduct;
};

export class ProductRepositoryInMemory 
implements ProductRepositoryContract {

  async create ( params: TCreateProduct ): Promise<void> {
    const { 
      categories: listCategory,
      name,
      qty,
      price,
     } = params;

     const filteredCategory = categories.filter((category) => {
      return listCategory.includes(category.name);
     });

     if ( filteredCategory.length > 0 ) {
      throw new Error("This category has already been added to this product.");
     };

     function createCategories (parent: string) {
      const receiverCategories = [];

      for ( let i = 0; i < listCategory.length; i++ ) {
       receiverCategories.push({
          _id: crypto.randomUUID(),
          name: listCategory[i],
          parent,
        });
      };

      return receiverCategories;
     };

     const productId = crypto.randomUUID();
     productList.push({
      _id: productId,
      categories: createCategories(productId), 
      name,
      qty,
      price
     });
  };

  async getProduct ( id: string ): Promise<TProductData> {
    const productFound = productList.find((product) => {
      return product._id === id;
    });
    // rome-ignore lint/style/noNonNullAssertion: <explanation>
    return  productFound!;
  };

  async getAllProducts (): Promise<TProductData[] | []> {
    return productList;
  };

  async editProduct ( params: TEditProduct ): Promise<void> {
    const { id, data } = params;
    const {
      categories,
      name,
      qty,
      price
     } = data;

    const findProduct = productList.find((product) => {
      return product._id === id;
    });

    for ( let i = 0; i < categories.length; i++ ) {
      // rome-ignore lint/style/noNonNullAssertion: <explanation>
      findProduct!.categories[i].name = categories[i]
    };
    // rome-ignore lint/style/noNonNullAssertion: <explanation>
    findProduct!.name = name;
     // rome-ignore lint/style/noNonNullAssertion: <explanation>
    findProduct!.qty = qty;
     // rome-ignore lint/style/noNonNullAssertion: <explanation>
    findProduct!.price = price;
  };

  async deleteProduct ( id: string ): Promise<void> {
    const indexProduct = productList.findIndex((product) => {
      return product._id === id;
    });

    productList.splice(indexProduct, 1);
  };

  async getAllCategories (): Promise<TCategoryData[] | []> {
    return categories;
  };
};