import mongoose from "mongoose";
import { Product, Category } from "../../models/product-models";
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
    const { categories, name, qty, price } = params;

    const categoryIds = await Promise.all(
      categories.map(async (name) => {
        let category = await Category.findOne({ name }); // busca a categoria pelo nome

        // verifica se a categoria existe
        if (!category) {
          category = new Category({ name }); // cria uma nova categoria
          await category.save();
        }

        return category._id; // retorna o ID da categoria encontrada
      })
    );

    await Product.create({ name, qty, price, categories: categoryIds });
  }

  async getProduct(params: TGetProduct): Promise<TProductData | null> {
    if (params.name) {
      const product = await Product.findOne({
        name: params.name,
      }).lean<TProductData>();
      return product;
    }

    const objectId = new mongoose.Types.ObjectId(params.id);
    const product = await Product.findById(objectId).lean<TProductData>();
    return product;
  }

  async getAllProducts(): Promise<TProductData[] | []> {
    const products = await Product.find()
      .populate("categories", "name")
      .lean<TProductData[] | []>();
    return products;
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
    const objectId = new mongoose.Types.ObjectId(id);
    await Product.findByIdAndDelete(objectId);
  }

  async getAllCategories(): Promise<TCategoryData[] | []> {
    const categories = await Category.find().lean<TCategoryData[] | []>();
    return categories;
  }
}
