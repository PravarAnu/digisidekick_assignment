import JWT from "jsonwebtoken";

import User from "../models/user.schema.js";

import config from "../configs/index.config.js";

import asyncHandler from "../services/asyncHandler.service.js";
import customError from "../utils/customError.util.js";


export const isLoggedIn = asyncHandler(async (req, res, next) => {
    let token;

    if (req.cookie.token || (req.header.authorization && req.header.authorization.startsWith("Bearer"))) {
        token = req.cookie.token || req.header.authorization.split(' ')[1];
    }

    if (!token) {
        throw new customError("Not authorized to access this resource", 401);
    }

    try {
        const decodedToken = JWT.verify(token, config.JWT_SECRET);

        const founduser = await User.findById(decodedToken._id, "name, email, role");

        req["user"] = founduser;

        next();
    } catch (e) {
        throw new customError("Not authorized to access this resource", 401);
    }
});

export const authorize = (...requiredRoles) => asyncHandler(async (req, res, next) => {
    if (!requiredRoles.includes(req.user.role)) {
        throw new customError("You are not authorized to access this resource", 401);
    }

    next();
})