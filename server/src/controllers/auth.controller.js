import User from "../models/user.schema.js";

import asyncHandler from "../services/asyncHandler.service.js";
import customError from "../utils/customError.util.js"

import cookieOptions from "../utils/cookieOptions.util.js";


export const SignUp = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new customError("Please provide all details", 400);
    }

    const userExisted = await User.findOne({ email });

    if (userExisted) {
        throw new customError("User already existed", 400);
    }

    const user = await User.create({
        name,
        email,
        password
    })

    const token = await user.getJWTtoken();

    user.password = undefined;
    res.cookie("token", token, cookieOptions);

    res.status(200).json({
        success: true,
        token,
        user
    })
});

export const LogIn = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new customError("Please provide all details", 400);
    }


    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new customError("No user exist");
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (isPasswordMatched) {
        const token = user.getJWTtoken();

        user.password = undefined;

        res.cookie("token", token, cookieOptions);

        res.status(200).json({
            success: true,
            token,
            user
        })
    }
    else {
        throw new customError("Password is incorrect", 400);
    }
});

export const LogOut = asyncHandler(async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: "Logged Out"
    })
});

export const ResetPassword = asyncHandler(async (req, res) => {
    const { email, currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!email || !currentPassword || !newPassword || !confirmNewPassword) {
        throw new customError("Please provide all details", 400);
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new customError("No user found", 400);
    }

    if (newPassword !== confirmNewPassword) {
        throw new customError("New Password and Confirm New Password didn't matched", 400);
    }

    const checkPassword = await user.comparePassword(currentPassword);

    if (!checkPassword) {
        throw new customError("Password is wrong", 400);
    } else {
        user.password = newPassword;

        await user.save();

        const token = user.getJWTtoken();
        res.cookie("token", token, cookieOptions);

        res.status(200).json({
            success: true,
            message: "Password Reset Successfully"
        })

    }



})

export const GetProfile = asyncHandler(async (req, res) => {
    const { id: userId } = req.params;

    const profile = await User.findOne({ _id: userId });

    if (!profile) {
        throw new customError("User not found", 400);
    }

    res.status(200).json({
        success: true,
        profile
    })
})

export const GetAllProfile  = asyncHandler(async (req,res)=>{
    const allProfile = await User.find({});

    if(allProfile.length === 0){
        throw new customError("No user found", 404);
    }

    res.status(200).json({
        success: true,
        allProfile
    })
})


export const DeleteUser = asyncHandler(async (req,res)=>{
    const {id: userId} = req.params;

    const user  = await User.findByIdAndDelete(userId);

    if(!user){
        throw new customError("User Doesn't Exists", 401);
    }

    res.status(200).json({
        success: true,
        message: "User Deleted Successfuly",
        user
    })
})


export const UpdateUser = asyncHandler(async (req,res)=>{
    const {id: userId} = req.params;
    const {name, email, password, role} = req.body;

    const user = await User.findByIdAndUpdate(userId, {name, email, password, role});

    if(!user){
        throw new customError("User Doesn't exists", 401);
    }

    res.status(200).json({
        success: true,
        message: "User Updated Successfully",
        user
    })
})