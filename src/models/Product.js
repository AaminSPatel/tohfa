import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true, trim: true },
    name: { type: String, required: true, trim: true },
    shortDescription: { type: String, default: "" },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, default: null },
    images: { type: [String], default: [] },
    category: { type: String, default: "" },
    categorySlug: { type: String, index: true, default: "" },
    tags: { type: [String], default: [] },
    stock: { type: Number, default: 0, min: 0 },
    featured: { type: Boolean, default: false },
    bestseller: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    occasion: { type: [String], default: [] },
    specifications: { type: [new mongoose.Schema({ label: String, value: String }, { _id: false })], default: [] },
    personalisation: {
      type: new mongoose.Schema(
        { label: String, placeholder: String, maxLength: Number, required: Boolean },
        { _id: false }
      ),
      default: null,
    },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
