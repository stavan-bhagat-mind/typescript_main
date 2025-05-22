import express from "express";
import {
  registerHandler,
  loginHandler,
  getUserHandler,
  handleOAuth,
} from "../modules/user/controllers/user.controller";
import authenticationMiddleware from "../middlewares/auth.middleware";
import passport from "passport";

const userRouter = express.Router();
// email Oauth
userRouter.post("/register", registerHandler);
userRouter.post("/login", loginHandler);
userRouter.get("/profile", authenticationMiddleware, getUserHandler);

// google Oauth
userRouter.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);
userRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/", session: false }),
  handleOAuth
);

// GitHub Oauth
userRouter.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"], session: false })
);
userRouter.get(
  "/auth/github/callback",
  passport.authenticate("github", { session: false, failureRedirect: "/" }),
  handleOAuth
);

export default userRouter;
