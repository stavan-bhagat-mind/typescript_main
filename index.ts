import IndexRoute from "./src/routes/index.route";
import * as dotenv from "dotenv";
import Express from "express";
import helmet from "helmet";
import passport from "passport";
const app = Express();
dotenv.config();
require("./src/middlewares/passport.middleware");

const port = process.env.PORT || 7000;

// For parsing the express payloads
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(helmet()); //secure our http headers
app.use(passport.initialize());

// CORS permission
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  next();
});

app.use("/typescript", IndexRoute);
app.get("/", (req, res) => {
  res.send("welcome to typescript");
});

app.listen(port, () => {
  console.log("Server started on port ", port);
  //   console.log("DB connected to ", process.env.DEV_HOST);
});
