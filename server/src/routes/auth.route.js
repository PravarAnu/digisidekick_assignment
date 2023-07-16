import { Router } from "express"

import { LogIn, LogOut, SignUp, ResetPassword, GetProfile, GetAllProfile, DeleteUser, UpdateUser } from "../controllers/auth.controller.js";
import { isLoggedIn, authorize } from "../middlewares/auth.middleware.js";

import AuthRoles from "../utils/authRoles.util.js";


const router = Router();


router.get("/users", GetAllProfile);
router.post("/users", SignUp);
router.delete("/deleteUser/:id", DeleteUser);
router.patch("/updateUser/:id", UpdateUser);




router.post("/logIn", LogIn);
router.post("/logOut", LogOut);
router.post("/password/reset", isLoggedIn, ResetPassword);

router.get("/profile", GetProfile);




export default router;