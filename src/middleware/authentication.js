require("dotenv").config();
const jwt = require("jsonwebtoken");

const Authorization = (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];
  try {
    if (!token) {
      throw new Error("No token provided");
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        throw new Error("Invalid token");
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    return res.status(401).json({
      status: false,
      message: "Unauthorized: " + error.message,
    });
  }
};

module.exports = { Authorization };
