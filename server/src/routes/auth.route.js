import { Router } from "express"

import { LogIn, LogOut, SignUp, ResetPassword, GetProfile, GetAllProfile, DeleteUser, UpdateUser } from "../controllers/auth.controller.js";
import { isLoggedIn, authorize } from "../middlewares/auth.middleware.js";

import AuthRoles from "../utils/authRoles.util.js";


const router = Router();


router.get("/users", GetAllProfile);
router.post("/user", LogIn);
router.post("/deleteUser/:id", DeleteUser);
router.post("/updateUser/:id", UpdateUser);




router.post("/signUp", SignUp);
router.post("/logOut", LogOut);
router.post("/password/reset", isLoggedIn, ResetPassword);

router.get("/profile", GetProfile);




export default router;