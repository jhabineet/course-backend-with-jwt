const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require("../config")
 
function userMiddleware(req, res, next) {
    // Implement user auth logic
    // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
    const token = req.headers.authorization;
    // Bearer sjuriewowenzhwgduw => ["Bearer", "sjuriewowenzhwgduw"];
    const words = token.split(" ");
    const jwtToken = words[1];
    const decodeValue = jwt.verify(jwtToken, JWT_SECRET)
        if(decodeValue.username) {
            req.username = decodeValue.username;
            console.log(req.username);
            next();
        } else {
            res.status(401).send({ message: "Unauthorized" })
        }
}

module.exports = userMiddleware;