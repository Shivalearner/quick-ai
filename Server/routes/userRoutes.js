import express from "express";
// 1. Added the missing auth middleware import (adjust the path to where your auth middleware actually lives)
import { auth } from "../middlewares/auth.js";

// 2. Double-check this filename! If your file is named "userController.js" (no 's'), change it below.
import { getPublishedCreations, getUserCreations, toggleLikeCreation } from "../controllers/userControllers.js";

const userRouter = express.Router();

userRouter.get("/get-user-creations", auth, getUserCreations);
userRouter.get("/get-published-creations", auth, getPublishedCreations);
userRouter.post("/toggle-like-creations", auth, toggleLikeCreation);

export default userRouter;