const mongoose = require("mongoose")

const Category_schema = new mongoose.Schema({
    // ID:{type:String,require:true},
    Name:{type:String,require:true},
    Colour:{type:String,require:true},
    Icon:{type:String,require:true}
    //image
})
const Category = mongoose.model("Category",Category_schema);
module.exports = Category