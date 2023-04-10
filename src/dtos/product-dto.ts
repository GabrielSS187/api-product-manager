import { Types } from "mongoose";

export type TCreateCategory = string[];

export type TCategoryData = {
  _id: Types.ObjectId | string;
  name: string;
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
  createdAt: Date;
  __v: number;
};