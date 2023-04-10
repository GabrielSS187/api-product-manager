import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  },
  name: { type: String, required: true, unique: true },
});

const productSchema = new mongoose.Schema({
  categories: [{ type: String, required: true, unique: true }],
  name: { type: String, required: true },
  qty: { type: Number, required: true },
  price: { type: Number, required: true },
});

const Category = mongoose.model("Category", categorySchema);
const Product = mongoose.model("Product", productSchema);

module.exports = { Category, Product };
