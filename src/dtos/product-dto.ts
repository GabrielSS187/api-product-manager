import { TCreateCategory, TCategoryData } from "./category-dto";

export type TCreateProduct = {
  categories: TCreateCategory[];
  name: string;
  qty: number;
  price: number;
};

export type TProductData = {
  _id: string;
  categories: TCategoryData[];
  name: string;
  qty: number;
  price: number;
};