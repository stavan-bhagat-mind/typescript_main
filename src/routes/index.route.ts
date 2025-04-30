import express from "express";
const IndexRoute = express.Router();
import userRoute from "./user.route";
IndexRoute.use("/user", userRoute);

export default IndexRoute;
