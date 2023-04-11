import mongoose, { Schema } from "mongoose";
import {
	TCreateCategory,
	TCreateProduct,
	TCategoryData,
} from "../dtos/product-dto";

const categorySchema: Schema = new mongoose.Schema({
	parent: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Category",
		default: null,
	},
	_id: { type: mongoose.Schema.Types.ObjectId, required: true },
	name: { type: String, required: true },
});

const productSchema: Schema = new mongoose.Schema({
	categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
	name: { type: String, required: true, unique: true },
	qty: { type: Number, required: true },
	price: { type: Number, required: true },
	createdAt: { type: Date, default: Date.now },
});

export const Category = mongoose.model<TCategoryData | TCreateCategory>(
	"Category",
	categorySchema,
);
export const Product = mongoose.model<TCreateProduct>("Product", productSchema);
