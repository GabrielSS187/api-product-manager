import { TCreateProduct, TProductData, TCategoryData } from "../dtos/product-dto";

type TEditProduct = {
  id: string;
  data: TCreateProduct;
};

type TGetProduct = {
  id?: string;
  name?: string;
};

export abstract class ProductRepositoryContract {
  abstract create ( params: TCreateProduct ): Promise<void>;
  abstract getProduct ( params: TGetProduct ): Promise<TProductData | undefined>;
  abstract getAllProducts (): Promise<TProductData[] | []>;
  abstract editProduct ( params: TEditProduct ): Promise<void>;
  abstract deleteProduct ( id: string ): Promise<void>;
  abstract getAllCategories (): Promise<TCategoryData[] | []>;
};