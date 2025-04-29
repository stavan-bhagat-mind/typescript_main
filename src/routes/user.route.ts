import { Router } from "express";
const {
  register,
  //   login,
  // getProfile,
} = require("../modules/user/controllers/user.controller");
// const authenticate = require("../middlewares/middleware");

const userRouter = Router();
userRouter.post("/register", register);
// userRouter.post("/login", login);
// userRouter.get("/profile", authenticate, getProfile);

export default userRouter;
