const express = require("express");
const Router = express.Router();
const Order = require("../models/Orders");
const Orderitem = require("../models/Orderitems");
const Product = require("../models/product.js");
const Category = require("../models/Category.js");
const User = require("../models/Users.js");
const {authrequire} = require("../models/confirm/JWTauth.js");

Router.post("/updateproduct", authrequire,async (req, res) => {
    const { ID } = req.body
    try {
        const product_update = await Product.findByIdAndUpdate(ID, {
            name: req.body.name,
            description: req.body.description,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            isFeatured: req.body.isFeatured,
        }, { new: true })
        if (!product_update) { return res.status(404).json({ message: "product cannot be updated" }) }
        return res.status(200).json({ message: "product has been updated" });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
})


Router.post("/product",authrequire, async (req, res) => {
    try {
        const category = await Category.findById(req.body.category);  // Assuming there's a separate Category model

        if (!category) {
            return res.status(400).json({ message: "Invalid category" });
        }

        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category, // If you intend to store only the ID
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            isFeatured: req.body.isFeatured,
        });

        await product.save();
        return res.status(200).json(product);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

Router.post("/allproduct", authrequire,async (req, res) => {
    const { ID } = req.body;
    try {
        const productdata = await Product.findById(ID).populate('category');
        return res.status(200).json(productdata);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error)
    }
})

module.exports = Router;