export type TCreateCategory = string[];

export type TCategoryData = {
  _id: string;
  name: string;
  parent: string;
};

export type TCreateProduct = {
  categories: TCreateCategory;
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