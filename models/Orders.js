const mongoose = require("mongoose");

const Order_Schema = new mongoose.Schema({
    Orderitem: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Orderitem', required: true }],
    Shipping_Address1:{type:String,require:true},
    Shipping_Address2:{type:String,require:true},
    City:{type:String,require:true},
    Zip:{type:String,require:true},
    Country:{type:String,require:true},
    Phone:{type:Number,require:true},
    status:{type:String,require:true},
    Total:{type:Number,require:true},
    User: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
    DateOrdered:{type: Date, default: Date.now},

})
Order_Schema.virtual('id').get(function(){
    return this._id.toHexString();
})

Order_Schema.set('toJSON',{
    virtuals : true,
});

const Order = mongoose.model("Order",Order_Schema);
module.exports =  Order;