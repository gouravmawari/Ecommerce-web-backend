const express = require("express");
const mongoose = require("mongoose");
const Secret = "thuje dhekha tho ye jana sanam"
const JWT = require("jsonwebtoken")
const { authrequire } = require("./models/confirm/JWTauth.js")
const app = express();
const cookieParser = require("cookie-parser");
const Order = require("./models/Orders");
const Orderitem = require("./models/Orderitems");
const Product = require("./models/product.js");
const Category = require("./models/Category.js");
const User = require("./models/Users.js");
const bcrypt = require("bcrypt");
app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
// app.use(auth)
const category_API = require("./APIs/category.js");
const order_API = require("./APIs/orderitems.js");
const product_API = require("./APIs/product.js")
app.use("/Api", category_API)
app.use('/Api', order_API);
app.use("/Api", product_API);



app.post("/register", async (req, res) => {
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ Email: req.body.Email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Hash password asynchronously
        const hashedPassword = await bcrypt.hash(req.body.Password, 10);
        // Note the correct spelling

        const user = new User({
            Name: req.body.Name,
            Email: req.body.Email,
            Password: hashedPassword,
            Street: req.body.Street,
            Apartment: req.body.Apartment,
            City: req.body.City,
            Zip: req.body.Zip,
            Phone: req.body.Phone,
            isAdmin: req.body.isAdmin
        });

        await user.save();
        return res.status(200).json({ message: "User has been registered" });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" }); // More generic error message
    }
});


app.get("/get_user", authrequire, async (req, res) => {
    const { id } = req.body;

    try {
        // const user = await User.findById(req.body.id).select('Name Email Phone -password');
        const user = await User.findById(req.body.id).select('-Password');
        if (!user) { return res.status(404).json({ message: "user id is not available" }) }
        return res.status(200).json(user)
    }
    catch (err) {
        return res.status(500).json(err)
    }
})

const create_token = (ID) => {
    return JWT.sign({ ID }, Secret)
}
app.post("/login", async (req, res) => {  // added async
    const { Email, Password } = req.body;

    try {
        const user = await User.findOne({ Email });  // added await

        if (!user) {
            return res.status(400).json({ message: "Email is invalid" });  // changed status code to 400
        }

        if (bcrypt.compareSync(Password, user.Password)) {
            let token = create_token(user._id)
            res.cookie("new_cookie", token, { httpOnly: true, maxAge: 99999991000009 })
            return res.status(200).json({ email: user.Email, token: token });  // changed email key to user.Email
        } else {
            return res.status(400).json({ message: "Password is incorrect" });  // changed status code to 400
        }

    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });  // generic error message
    }
});
const dbURI = "mongodb+srv://guddu:guddu@cluster1.ved7bni.mongodb.net/yes?retryWrites=true&w=majority";
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        const PORT = process.env.PORT || 8888;
        app.listen(PORT, () => {
            console.log("server is created")
        })
    })
    .catch((err) => console.log(err))     