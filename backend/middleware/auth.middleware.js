import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model.js";

dotenv.config();

export const userVerification = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(404).json({ success: false, message: "No token found" });
  }

  jwt.verify(token, process.env.SECRET_TOKEN, async (err, data) => {
    if(err){
        return res.status(404).json({ success: false, message: "No token found" });
    }
    else{
        const user = await User.findById(data.id);
        if(user){
            return res.status(200).json({ success: true, user });
        }else{
            return res.status(404).json({ success: false, message:"Failed to login" });
        }
    }
  })

  

};

export const protect = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ success: false, message: "Not authorized, token failed" });
  }
};
