import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";
import {
  hasAdminAccess,
  hasSuperAdminAccess,
} from "../utils/roleUtils.js";

//Protected Routes token base
export const requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
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
