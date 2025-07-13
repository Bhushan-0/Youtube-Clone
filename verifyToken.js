import jwt from "jsonwebtoken";

// Custom middleware for verify the JWT token
const verifyToken = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decodedToken = jwt.verify(token, "secret");
            req.user = decodedToken;
            next();
        } catch (err) {
            res.status(401).json({ message: "Not authorized", error: err })
        }
    } else {
        res.status(401).json({ message: "No token provided" })
    }
}

export default verifyToken;