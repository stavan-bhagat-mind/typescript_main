import express from "express";
import {
  registerHandler,
  loginHandler,
  getUserHandler,
} from "../modules/user/controllers/user.controller";
import authenticationMiddleware from "../middlewares/auth.middleware";

const userRouter = express.Router();
userRouter.post("/register", registerHandler);
userRouter.post("/login", loginHandler);
userRouter.get("/profile", authenticationMiddleware, getUserHandler);

export default userRouter;
