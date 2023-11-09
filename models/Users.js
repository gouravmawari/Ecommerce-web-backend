const mongoose = require("mongoose")

const User_schema = new mongoose.Schema({
    Name:{type:String,require:true},
    Email:{type:String,require:true},
    Password:{type:String,require:true},
    Street:{type:String,require:true},
    Apartment:{type:String,require:true},
    City:{type:String,require:true},
    Zip:{type:String,require:true},
    Phone:{type:Number,require:true},
    idAdmin:{type:Boolean,require:true}
})

User_schema.virtual('id').get(function(){
    return this._id.toHexString();
})

User_schema.set('toJSON',{
    virtuals : true,
});

const User = mongoose.model("product_user",User_schema);
module.exports = User;