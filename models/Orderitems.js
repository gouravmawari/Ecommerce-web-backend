const mongoose = require("mongoose")

const Orderitem_schema = new mongoose.Schema({
    Product:{type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
    Quantity:{type:Number,require:true}
})

const Orderitems = mongoose.model("Orderitem",Orderitem_schema);
module.exports = Orderitems;