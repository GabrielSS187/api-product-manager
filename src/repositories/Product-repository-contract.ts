import { TCreateProduct, TProductData, TCategoryData } from "../dtos/product-dto";

type TEditProduct = {
  id: string;
  data: TCreateProduct;
};

export abstract class ProductRepositoryContract {
  abstract create ( params: TCreateProduct ): Promise<void>;
  abstract getProduct ( id: string ): Promise<TProductData>;
  abstract getAllProducts (): Promise<TProductData[] | []>;
  abstract editProduct ( params: TEditProduct ): Promise<void>;
  abstract deleteProduct ( id: string ): Promise<void>;
  abstract getAllCategories (): Promise<TCategoryData[] | []>;
};