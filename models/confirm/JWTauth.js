
const JWT = require("jsonwebtoken");
const authrequire = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    if (token) {
        JWT.verify(token, 'thuje dhekha tho ye jana sanam', (err, decodedtoken) => {
            if (err) {
                console.log(err);
                console.log("you are unauthoried")
                return res.status(401).json({ message: "you are unauthorized" })
            } else {
                console.log("you are verified")
                console.log(decodedtoken);
                next();
            }
        });
    } else {
        return res.status(401).json({})
    }


}

module.exports = { authrequire };

