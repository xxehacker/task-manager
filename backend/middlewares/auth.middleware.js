const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const protected = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({
        message: "Not authorized, token not found",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // console.log("decoded", decoded);

    //note: in this step i getting a error while finding the user in the database i dont get the user because in the time of jwt sign i put userId but now i used decoded._id to find the user. so i have to change the code in this step like this decoded.userId

    const user = await User.findById(decoded.userId).select("-password");
  
    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Token verification error:", error);
    res.status(500).json({
      message: error?.message || "Something went wrong while verifying token",
    });
  }
};

const adminProtected = async (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(401).json({
      message: "Access denied, you are not an admin",
    });
  }
  next();
};

module.exports = { protected, adminProtected };
