const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    countInStock: { type: Number, required: true, min: 0, max: 100 },
    rating: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    dateCreated: { type: Date, default: Date.now }
})
ProductSchema.virtual('id').get(function(){
    return this._id.toHexString();
})

ProductSchema.set('toJSON',{
    virtuals : true,
});

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
