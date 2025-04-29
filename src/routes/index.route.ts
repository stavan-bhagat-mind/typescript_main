import { Router } from "express";
const IndexRoute = Router();

import userRoute from "./user.route";
IndexRoute.use("/v1/user", userRoute);

export default IndexRoute;
