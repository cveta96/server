import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyJWT = (req, res, next) => {
  const accessJWT = process.env.JWT_ATS;
  const token = req.header("authorization");

  if (!token)
    return res.status(401).json({ message: "Missing token, action denied." });

  try {
    const decoded = jwt.verify(token, accessJWT);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(403).json({ message: "Token is not valid." });
  }
};
