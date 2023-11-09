const express = require("express");
const app = express()
const Router = express.Router();
const Order = require("../models/Orders");
const Orderitem = require("../models/Orderitems");
const Product = require("../models/product.js");
const cookieParser =  require("cookie-parser")
const Category = require("../models/Category.js");
const User = require("../models/Users.js");
const {authrequire} = require("../models/confirm/JWTauth.js");


Router.post("/getcategory",authrequire, async (req, res) => {
    const { Name, Colour, Icon } = req.body;

    if (!Name || !Colour || !Icon) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const category = new Category({
            Name,
            Colour,
            Icon,
        });

        await category.save();

        return res.status(200).json(category);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred while processing your request.", error: error.message });
    }
});


Router.post("/deletecategory", authrequire,async(req, res) => {
    const { ID } = req.body;
    try {
        const delet = await Category.findByIdAndDelete(ID);
        if (!delet) { res.status.json({ message: "ID does not exist" }) }
        return res.status(202).json({ message: "category is delted" });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error)
    }
})

Router.get("/allcategory", authrequire,async (req, res) => {
    console.log("helllo")
    try {
        const allCategories = await Category.find();
        return res.status(200).json(allCategories);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred while fetching categories", error: error.message });
    }
});

Router.get("/getcategoryID", authrequire,async (req, res) => {
    const { ID } = req.body;
    try {
        const category = await Category.findById(ID)
        return res.status(200).json(category)
    } catch (error) {
        console.log(error);
        return res.status(500).json(error)
    }
})

module.exports = Router;
