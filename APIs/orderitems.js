const express = require("express");
const Router = express.Router();
const Order = require("../models/Orders");
const Orderitem = require("../models/Orderitems");
const Product = require("../models/product.js");
const Category = require("../models/Category.js");
const User = require("../models/Users.js");
const {authrequire} = require("../models/confirm/JWTauth.js");


Router.get("/getmyorders",authrequire,async(req,res)=>{
    const {userid} = req.body;
    try{ 
        
        const UserOrder = await Order.find({userid}).populate({path:"Orderitem" , populate:{path:"Product", populate:'category'}})
        if(!UserOrder){
            return res.status(404).json({message :"User not found"})
        }
        return res.status(200).json(UserOrder)
    }catch(error){
        console.log(error);
        return res.status(500).json(error);
    }
})

Router.delete("/deltorder", authrequire,async (req, res) => {
    const { id } = req.body;

    try {
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Delete all associated order items
        await Promise.all(order.Orderitem.map(orderitem => Orderitem.findByIdAndRemove(orderitem)));

        // Delete the main order
        await Order.findByIdAndRemove(id);

        return res.status(200).json({ message: "Order and associated items deleted" });

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

Router.get("/order_list", authrequire,async (req, res) => {
    try {
        const order_list = await Order.find().populate([{ path: 'Orderitem', model: "Orderitem", populate: 'Product' }, { path: "User", model: "product_user", select: 'Name id ' }]);
        return res.status(200).json(order_list);
    } catch (error) {
        console.log(error)
        return res.status(500).json(error);
    }
})

Router.post("/order",authrequire, async (req, res) => {
    try {
        const orderitemsid = await Promise.all(req.body.Orderitem.map(async orderitems => {
            let neworderitem = new Orderitem({
                Product: orderitems.Product,
                Quantity: orderitems.Quantity
            })
            neworderitem = await neworderitem.save();
            return neworderitem._id;
        }));

        const total_prize = await Promise.all(orderitemsid.map(async orderID=>{
            const order_items = await Orderitem.findById(orderID).populate('Product','price');
            const total_prize = order_items.Product.price*order_items.Quantity;
            return total_prize;
        }))
        const total_Prize = total_prize.reduce((acc, currVal) => acc + currVal, 0)

        console.log(total_Prize)
        const orders = new Order({
            Orderitem: orderitemsid,
            Shipping_Address1: req.body.Shipping_Address1,
            Shipping_Address2: req.body.Shipping_Address2,
            City: req.body.City,
            Zip: req.body.Zip,
            Country: req.body.Country,
            Phone: req.body.Phone,
            status: req.body.status,
            Total: total_Prize,
            User: req.body.User,
        });

        const savedOrder = await orders.save();

        // Fetch the saved order with populated Orderitem details
        const populatedOrder = await Order.findById(savedOrder._id).populate({ path: 'Orderitem', model: 'Orderitem' });


        if (!populatedOrder) {
            return res.status(400).json({ message: "Order not recorded" });
        }

        return res.status(200).json(populatedOrder);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});


module.exports = Router;