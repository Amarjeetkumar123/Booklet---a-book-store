import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";
import {
  hasAdminAccess,
  hasSuperAdminAccess,
} from "../utils/roleUtils.js";

//Protected Routes token base
export const requireSignIn = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    if (!token) {
      return res.status(401).send({
        success: false,
        message: "Authorization token is required",
      });
    }

    const decode = JWT.verify(
      token,
      process.env.JWT_SECRET
    );
    req.user = decode;
    return next();
  } catch (error) {
    console.log(error);
    return res.status(401).send({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

//admin acceess
export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (!user || !hasAdminAccess(user.role)) {
      return res.status(401).send({
        success: false,
        message: "UnAuthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error in admin middelware",
    });
  }
};

// superadmin access
export const isSuperAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (!user || !hasSuperAdminAccess(user.role)) {
      return res.status(401).send({
        success: false,
        message: "Superadmin access required",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error in superadmin middleware",
    });
  }
};
