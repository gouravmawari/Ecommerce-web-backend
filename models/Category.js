const mongoose = require("mongoose")

const Category_schema = new mongoose.Schema({
    Name: { type: String, require: true },
    Colour: { type: String, require: true },
    Icon: { type: String, require: true }
})
const Category = mongoose.model("Category", Category_schema);
module.exports = Category